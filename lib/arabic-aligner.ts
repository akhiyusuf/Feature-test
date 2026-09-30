// Arabic text normalization and word-level alignment for Quranic recitation

export interface WordAlignment {
  expectedWord: string;
  expectedNormalized: string;
  recitedWord?: string;
  recitedNormalized?: string;
  status: 'correct' | 'incorrect' | 'missing' | 'extra';
  confidence: number;
}

export interface AlignmentResult {
  isMatch: boolean;
  score: number; // 0 to 100
  words: WordAlignment[];
  mistakeCount: number;
  firstMistakeIndex: number; // -1 if no mistakes
  recitedText: string;
  expectedText: string;
}

// Arabic diacritics / tashkeel Unicode ranges
const TASHKEEL_REGEX = /[\u0617-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;

// Normalize Arabic text for robust comparison
export function normalizeArabic(text: string): string {
  if (!text) return '';

  return (
    text
      // Remove all tashkeel / harakat
      .replace(TASHKEEL_REGEX, '')
      // Normalize alif forms (أ, إ, آ, ٱ, etc. -> ا)
      .replace(/[إأآٱ]/g, 'ا')
      // Normalize alif maqsura (ى -> ي)
      .replace(/ى/g, 'ي')
      // Normalize taa marbuta (ة -> ه)
      .replace(/ة/g, 'ه')
      // Normalize Persian/Urdu kaf/gaf/yeh
      .replace(/ک/g, 'ك')
      .replace(/ی/g, 'ي')
      // Remove Quranic stop marks, sajda marks, rub-el-hizb
      .replace(/[\u06D6-\u06ED\u0600-\u0605\u06DD]/g, '')
      // Remove punctuation and extra whitespace
      .replace(/[.,/#!$%^&*;:{}=\-_`~()؟،؛«»"']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

// Simple Levenshtein distance between two strings
export function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));

  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;

  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      if (b.charAt(j - 1) === a.charAt(i - 1)) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // substitution
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i] + 1 // deletion
        );
      }
    }
  }

  return matrix[bn][an];
}

// Similarity ratio (0 to 1)
export function wordSimilarity(w1: string, w2: string): number {
  const norm1 = normalizeArabic(w1);
  const norm2 = normalizeArabic(w2);

  if (norm1 === norm2) return 1.0;
  if (!norm1 || !norm2) return 0.0;

  const dist = levenshteinDistance(norm1, norm2);
  const maxLen = Math.max(norm1.length, norm2.length);
  return 1 - dist / maxLen;
}

// Compare recited Arabic text with expected canonical Quranic text
export function alignRecitation(
  recitedRaw: string,
  expectedUthmani: string,
  tolerance = 0.75 // Allow minor tajweed / phoneme variations
): AlignmentResult {
  const recitedNorm = normalizeArabic(recitedRaw);
  const expectedNorm = normalizeArabic(expectedUthmani);

  const recitedTokens = recitedRaw.split(/\s+/).filter(Boolean);
  const recitedTokensNorm = recitedNorm.split(/\s+/).filter(Boolean);

  const expectedTokens = expectedUthmani.split(/\s+/).filter(Boolean);
  const expectedTokensNorm = expectedNorm.split(/\s+/).filter(Boolean);

  const alignments: WordAlignment[] = [];
  let recitedIdx = 0;
  let correctCount = 0;
  let firstMistakeIndex = -1;

  for (let i = 0; i < expectedTokens.length; i++) {
    const expWord = expectedTokens[i];
    const expNorm = expectedTokensNorm[i] || normalizeArabic(expWord);

    if (recitedIdx < recitedTokensNorm.length) {
      const recWord = recitedTokens[recitedIdx];
      const recNorm = recitedTokensNorm[recitedIdx];
      const sim = wordSimilarity(expNorm, recNorm);

      if (sim >= tolerance) {
        alignments.push({
          expectedWord: expWord,
          expectedNormalized: expNorm,
          recitedWord: recWord,
          recitedNormalized: recNorm,
          status: 'correct',
          confidence: sim,
        });
        correctCount++;
        recitedIdx++;
      } else {
        // Lookahead 1 token to see if user skipped a word or inserted one
        const nextRecNorm = recitedTokensNorm[recitedIdx + 1];
        const nextSim = nextRecNorm ? wordSimilarity(expNorm, nextRecNorm) : 0;

        if (nextSim >= tolerance) {
          // Extra recited word encountered
          alignments.push({
            expectedWord: expWord,
            expectedNormalized: expNorm,
            recitedWord: recitedTokens[recitedIdx + 1],
            recitedNormalized: nextRecNorm,
            status: 'correct',
            confidence: nextSim,
          });
          correctCount++;
          recitedIdx += 2;
        } else {
          alignments.push({
            expectedWord: expWord,
            expectedNormalized: expNorm,
            recitedWord: recWord,
            recitedNormalized: recNorm,
            status: 'incorrect',
            confidence: sim,
          });
          if (firstMistakeIndex === -1) firstMistakeIndex = i;
          recitedIdx++;
        }
      }
    } else {
      // User didn't recite this word yet (missing)
      alignments.push({
        expectedWord: expWord,
        expectedNormalized: expNorm,
        status: 'missing',
        confidence: 0,
      });
      if (firstMistakeIndex === -1) firstMistakeIndex = i;
    }
  }

  const score = expectedTokens.length > 0
    ? Math.round((correctCount / expectedTokens.length) * 100)
    : 0;

  const mistakeCount = expectedTokens.length - correctCount;
  // Consider passed if score >= 85% or 0 mistakes
  const isMatch = mistakeCount === 0 || score >= 90;

  return {
    isMatch,
    score,
    words: alignments,
    mistakeCount,
    firstMistakeIndex,
    recitedText: recitedRaw,
    expectedText: expectedUthmani,
  };
}

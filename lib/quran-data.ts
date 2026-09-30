// Quran Data Provider: Pre-loaded Surahs with audio and dynamic API fetcher

export interface QuranVerse {
  surahNumber: number;
  ayahNumber: number; // relative to surah
  globalAyahNumber: number;
  uthmaniText: string;
  transliteration?: string;
  translation?: string;
  audioUrl: string; // Mishary Rashid Alafasy recitation
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

// Famous popular Surahs bundled for instant zero-latency loading
export const PRELOADED_SURAHS: Record<number, { meta: SurahMeta; verses: QuranVerse[] }> = {
  // Surah 1: Al-Fatihah
  1: {
    meta: {
      number: 1,
      name: 'الفَاتِحة',
      englishName: 'Al-Faatiha',
      englishNameTranslation: 'The Opening',
      numberOfAyahs: 7,
      revelationType: 'Meccan',
    },
    verses: [
      {
        surahNumber: 1,
        ayahNumber: 1,
        globalAyahNumber: 1,
        uthmaniText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Bismillaahir-Rahmaanir-Raheem',
        translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3',
      },
      {
        surahNumber: 1,
        ayahNumber: 2,
        globalAyahNumber: 2,
        uthmaniText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Alhamdu lillaahi Rabbil-aalameen',
        translation: '[All] praise is [due] to Allah, Lord of the worlds.',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3',
      },
      {
        surahNumber: 1,
        ayahNumber: 3,
        globalAyahNumber: 3,
        uthmaniText: 'الرَّحْمَٰنِ الرَّحِيمِ',
        transliteration: 'Ar-Rahmaanir-Raheem',
        translation: 'The Entirely Merciful, the Especially Merciful,',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3',
      },
      {
        surahNumber: 1,
        ayahNumber: 4,
        globalAyahNumber: 4,
        uthmaniText: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'Maaliki Yawmid-Deen',
        translation: 'Sovereign of the Day of Recompense.',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3',
      },
      {
        surahNumber: 1,
        ayahNumber: 5,
        globalAyahNumber: 5,
        uthmaniText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: 'Iyyaaka na\'budu wa lyyaaka nasta\'een',
        translation: 'It is You we worship and You we ask for help.',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3',
      },
      {
        surahNumber: 1,
        ayahNumber: 6,
        globalAyahNumber: 6,
        uthmaniText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'Ihdinas-Siraatal-Mustaqeem',
        translation: 'Guide us to the straight path -',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3',
      },
      {
        surahNumber: 1,
        ayahNumber: 7,
        globalAyahNumber: 7,
        uthmaniText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: 'Siraatal-lazeena an\'amta \'alaihim ghayril-maghdoobi \'alaihim wa lad-daalleen',
        translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3',
      },
    ],
  },

  // Surah 112: Al-Ikhlas
  112: {
    meta: {
      number: 112,
      name: 'الإخْلَاص',
      englishName: 'Al-Ikhlaas',
      englishNameTranslation: 'Sincerity',
      numberOfAyahs: 4,
      revelationType: 'Meccan',
    },
    verses: [
      {
        surahNumber: 112,
        ayahNumber: 1,
        globalAyahNumber: 6222,
        uthmaniText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: 'Qul huwal-laahu ahad',
        translation: 'Say, "He is Allah, [who is] One,',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6222.mp3',
      },
      {
        surahNumber: 112,
        ayahNumber: 2,
        globalAyahNumber: 6223,
        uthmaniText: 'اللَّهُ الصَّمَدُ',
        transliteration: 'Allahus-samad',
        translation: 'Allah, the Eternal Refuge.',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6223.mp3',
      },
      {
        surahNumber: 112,
        ayahNumber: 3,
        globalAyahNumber: 6224,
        uthmaniText: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        transliteration: 'Lam yalid wa lam yoolad',
        translation: 'He neither begets nor is born,',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6224.mp3',
      },
      {
        surahNumber: 112,
        ayahNumber: 4,
        globalAyahNumber: 6225,
        uthmaniText: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        transliteration: 'Wa lam yakun lahoo kufuwan ahad',
        translation: 'Nor is there to Him any equivalent."',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6225.mp3',
      },
    ],
  },

  // Surah 113: Al-Falaq
  113: {
    meta: {
      number: 113,
      name: 'الفَلَق',
      englishName: 'Al-Falaq',
      englishNameTranslation: 'The Daybreak',
      numberOfAyahs: 5,
      revelationType: 'Meccan',
    },
    verses: [
      {
        surahNumber: 113,
        ayahNumber: 1,
        globalAyahNumber: 6226,
        uthmaniText: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        transliteration: 'Qul a\'oozu bi rabbil-falaq',
        translation: 'Say, "I seek refuge in the Lord of daybreak',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6226.mp3',
      },
      {
        surahNumber: 113,
        ayahNumber: 2,
        globalAyahNumber: 6227,
        uthmaniText: 'مِن شَرِّ مَا خَلَقَ',
        transliteration: 'Min sharri maa khalaq',
        translation: 'From the evil of that which He created',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6227.mp3',
      },
      {
        surahNumber: 113,
        ayahNumber: 3,
        globalAyahNumber: 6228,
        uthmaniText: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        transliteration: 'Wa min sharri ghaasiqin izaa waqab',
        translation: 'And from the evil of darkness when it settles',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6228.mp3',
      },
      {
        surahNumber: 113,
        ayahNumber: 4,
        globalAyahNumber: 6229,
        uthmaniText: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        transliteration: 'Wa min sharrin-naffaasaati fil \'uqad',
        translation: 'And from the evil of the blowers in knots',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6229.mp3',
      },
      {
        surahNumber: 113,
        ayahNumber: 5,
        globalAyahNumber: 6230,
        uthmaniText: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        transliteration: 'Wa min sharri haasidin izaa hasad',
        translation: 'And from the evil of an envier when he envies."',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6230.mp3',
      },
    ],
  },

  // Surah 114: An-Naas
  114: {
    meta: {
      number: 114,
      name: 'النَّاس',
      englishName: 'An-Naas',
      englishNameTranslation: 'Mankind',
      numberOfAyahs: 6,
      revelationType: 'Meccan',
    },
    verses: [
      {
        surahNumber: 114,
        ayahNumber: 1,
        globalAyahNumber: 6231,
        uthmaniText: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        transliteration: 'Qul a\'oozu bi rabbin-naas',
        translation: 'Say, "I seek refuge in the Lord of mankind,',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6231.mp3',
      },
      {
        surahNumber: 114,
        ayahNumber: 2,
        globalAyahNumber: 6232,
        uthmaniText: 'مَلِكِ النَّاسِ',
        transliteration: 'Malikin-naas',
        translation: 'The Sovereign of mankind,',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6232.mp3',
      },
      {
        surahNumber: 114,
        ayahNumber: 3,
        globalAyahNumber: 6233,
        uthmaniText: 'إِلَٰهِ النَّاسِ',
        transliteration: 'Ilaahin-naas',
        translation: 'The God of mankind,',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6233.mp3',
      },
      {
        surahNumber: 114,
        ayahNumber: 4,
        globalAyahNumber: 6234,
        uthmaniText: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        transliteration: 'Min sharril-waswaasil-khannaas',
        translation: 'From the evil of the retreating whisperer -',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6234.mp3',
      },
      {
        surahNumber: 114,
        ayahNumber: 5,
        globalAyahNumber: 6235,
        uthmaniText: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        transliteration: 'Allazee yuwaswisu fee sudoorin-naas',
        translation: 'Who whispers [evil] into the breasts of mankind -',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6235.mp3',
      },
      {
        surahNumber: 114,
        ayahNumber: 6,
        globalAyahNumber: 6236,
        uthmaniText: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        transliteration: 'Minal-jinnati wan-naas',
        translation: 'From among the jinn and mankind."',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6236.mp3',
      },
    ],
  },

  // Surah 108: Al-Kawthar
  108: {
    meta: {
      number: 108,
      name: 'الكَوْثَر',
      englishName: 'Al-Kawthar',
      englishNameTranslation: 'Abundance',
      numberOfAyahs: 3,
      revelationType: 'Meccan',
    },
    verses: [
      {
        surahNumber: 108,
        ayahNumber: 1,
        globalAyahNumber: 6205,
        uthmaniText: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
        transliteration: 'Innaaa a\'tainaakal-kawthar',
        translation: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6205.mp3',
      },
      {
        surahNumber: 108,
        ayahNumber: 2,
        globalAyahNumber: 6206,
        uthmaniText: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
        transliteration: 'Fa salli li rabbika wanhar',
        translation: 'So pray to your Lord and sacrifice [to Him alone].',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6206.mp3',
      },
      {
        surahNumber: 108,
        ayahNumber: 3,
        globalAyahNumber: 6207,
        uthmaniText: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
        transliteration: 'Inna shaani\'aka huwal-abtar',
        translation: 'Indeed, your enemy is the one cut off.',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6207.mp3',
      },
    ],
  },

  // Surah 103: Al-Asr
  103: {
    meta: {
      number: 103,
      name: 'العَصْر',
      englishName: 'Al-Asr',
      englishNameTranslation: 'The Declining Day',
      numberOfAyahs: 3,
      revelationType: 'Meccan',
    },
    verses: [
      {
        surahNumber: 103,
        ayahNumber: 1,
        globalAyahNumber: 6177,
        uthmaniText: 'وَالْعَصْرِ',
        transliteration: 'Wal-\'asr',
        translation: 'By time,',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6177.mp3',
      },
      {
        surahNumber: 103,
        ayahNumber: 2,
        globalAyahNumber: 6178,
        uthmaniText: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
        transliteration: 'Innal-insaana lafee khusr',
        translation: 'Indeed, mankind is in loss,',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6178.mp3',
      },
      {
        surahNumber: 103,
        ayahNumber: 3,
        globalAyahNumber: 6179,
        uthmaniText: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        transliteration: 'Illal-lazeena aamanoo wa \'amilus-saalihaati wa tawaasaw bil-haqqi wa tawaasaw bis-sabr',
        translation: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.',
        audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6179.mp3',
      },
    ],
  },
};

// All 114 Surahs list for selection
export const ALL_SURAHS: SurahMeta[] = [
  { number: 1, name: 'الفَاتِحة', englishName: 'Al-Faatiha', englishNameTranslation: 'The Opening', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 2, name: 'البَقَرَة', englishName: 'Al-Baqara', englishNameTranslation: 'The Cow', numberOfAyahs: 286, revelationType: 'Medinan' },
  { number: 3, name: 'آل عِمْرَان', englishName: 'Aal-i-Imraan', englishNameTranslation: 'The Family of Imraan', numberOfAyahs: 200, revelationType: 'Medinan' },
  { number: 4, name: 'النِّسَاء', englishName: 'An-Nisaa', englishNameTranslation: 'The Women', numberOfAyahs: 176, revelationType: 'Medinan' },
  { number: 5, name: 'المَائِدَة', englishName: 'Al-Maaida', englishNameTranslation: 'The Table Spread', numberOfAyahs: 120, revelationType: 'Medinan' },
  { number: 36, name: 'يس', englishName: 'Yaseen', englishNameTranslation: 'Yaseen', numberOfAyahs: 83, revelationType: 'Meccan' },
  { number: 55, name: 'الرَّحْمَٰن', englishName: 'Ar-Rahmaan', englishNameTranslation: 'The Beneficent', numberOfAyahs: 78, revelationType: 'Medinan' },
  { number: 56, name: 'الوَاقِعَة', englishName: 'Al-Waaqia', englishNameTranslation: 'The Inevitable', numberOfAyahs: 96, revelationType: 'Meccan' },
  { number: 67, name: 'المُلْك', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', numberOfAyahs: 30, revelationType: 'Meccan' },
  { number: 78, name: 'النَّبَإ', englishName: 'An-Naba', englishNameTranslation: 'The Tidings', numberOfAyahs: 40, revelationType: 'Meccan' },
  { number: 93, name: 'الضُّحَى', englishName: 'Ad-Dhuhaa', englishNameTranslation: 'The Morning Hours', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 94, name: 'الشَّرْح', englishName: 'Ash-Sharh', englishNameTranslation: 'The Relief', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 95, name: 'التِّين', englishName: 'At-Teen', englishNameTranslation: 'The Fig', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 96, name: 'العَلَق', englishName: 'Al-Alaq', englishNameTranslation: 'The Clot', numberOfAyahs: 19, revelationType: 'Meccan' },
  { number: 97, name: 'القَدْر', englishName: 'Al-Qadr', englishNameTranslation: 'The Power', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 98, name: 'البَيِّنَة', englishName: 'Al-Bayyina', englishNameTranslation: 'The Clear Proof', numberOfAyahs: 8, revelationType: 'Medinan' },
  { number: 99, name: 'الزَّلْزَلَة', englishName: 'Az-Zalzala', englishNameTranslation: 'The Earthquake', numberOfAyahs: 8, revelationType: 'Medinan' },
  { number: 100, name: 'العَادِيَات', englishName: 'Al-Aadiyaat', englishNameTranslation: 'The Courser', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 101, name: 'القَارِعَة', englishName: 'Al-Qaari\'a', englishNameTranslation: 'The Calamity', numberOfAyahs: 11, revelationType: 'Meccan' },
  { number: 102, name: 'التَّكَاثُر', englishName: 'At-Takaathur', englishNameTranslation: 'The Rivalry in World Increase', numberOfAyahs: 8, revelationType: 'Meccan' },
  { number: 103, name: 'العَصْر', englishName: 'Al-Asr', englishNameTranslation: 'The Declining Day', numberOfAyahs: 3, revelationType: 'Meccan' },
  { number: 104, name: 'الهُمَزَة', englishName: 'Al-Humaza', englishNameTranslation: 'The Traducer', numberOfAyahs: 9, revelationType: 'Meccan' },
  { number: 105, name: 'الفِيل', englishName: 'Al-Feel', englishNameTranslation: 'The Elephant', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 106, name: 'قُرَيْش', englishName: 'Quraysh', englishNameTranslation: 'Quraysh', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 107, name: 'المَاعُون', englishName: 'Al-Maa\'oon', englishNameTranslation: 'The Small Kindness', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 108, name: 'الكَوْثَر', englishName: 'Al-Kawthar', englishNameTranslation: 'The Abundance', numberOfAyahs: 3, revelationType: 'Meccan' },
  { number: 109, name: 'الكَافِرُون', englishName: 'Al-Kaafiroon', englishNameTranslation: 'The Disbelievers', numberOfAyahs: 6, revelationType: 'Meccan' },
  { number: 110, name: 'النَّصْر', englishName: 'An-Nasr', englishNameTranslation: 'The Divine Support', numberOfAyahs: 3, revelationType: 'Medinan' },
  { number: 111, name: 'المَسَد', englishName: 'Al-Masad', englishNameTranslation: 'The Palm Fiber', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 112, name: 'الإخْلَاص', englishName: 'Al-Ikhlaas', englishNameTranslation: 'Sincerity', numberOfAyahs: 4, revelationType: 'Meccan' },
  { number: 113, name: 'الفَلَق', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', numberOfAyahs: 5, revelationType: 'Meccan' },
  { number: 114, name: 'النَّاس', englishName: 'An-Naas', englishNameTranslation: 'Mankind', numberOfAyahs: 6, revelationType: 'Meccan' },
];

// Fetch full Surah dynamically if not preloaded
export async function getSurahData(surahNumber: number): Promise<{ meta: SurahMeta; verses: QuranVerse[] }> {
  if (PRELOADED_SURAHS[surahNumber]) {
    return PRELOADED_SURAHS[surahNumber];
  }

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,ar.alafasy`);
    if (!res.ok) throw new Error(`Failed to fetch Surah: ${res.statusText}`);
    const json = await res.json();

    const uthmaniEdition = json.data[0];
    const translationEdition = json.data[1];
    const audioEdition = json.data[2];

    const meta: SurahMeta = {
      number: uthmaniEdition.number,
      name: uthmaniEdition.name,
      englishName: uthmaniEdition.englishName,
      englishNameTranslation: uthmaniEdition.englishNameTranslation,
      numberOfAyahs: uthmaniEdition.numberOfAyahs,
      revelationType: uthmaniEdition.revelationType,
    };

    const verses: QuranVerse[] = uthmaniEdition.ayahs.map((ayah: any, idx: number) => {
      let audio = audioEdition?.ayahs?.[idx]?.audio;
      if (!audio) {
        audio = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;
      }
      return {
        surahNumber,
        ayahNumber: ayah.numberInSurah,
        globalAyahNumber: ayah.number,
        uthmaniText: ayah.text,
        translation: translationEdition?.ayahs?.[idx]?.text || '',
        audioUrl: audio,
      };
    });

    return { meta, verses };
  } catch (err) {
    console.error('Error fetching surah data:', err);
    // Fallback to Al-Fatiha
    return PRELOADED_SURAHS[1];
  }
}

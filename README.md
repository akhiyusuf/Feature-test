# Recite After Me

An AI-powered Quran recitation correction tool.

## Modal Deployment
The `tarteel-ai/whisper-base-ar-quran` model is deployed as a serverless GPU function on Modal.
- The Modal application exposes a FastAPI endpoint for audio processing.
- Audio chunks are processed with VAD followed by ASR inference.

## Alignment Logic
- Word-level Levenshtein alignment is performed against canonical Uthmani text.
- Arabic text is normalized (stripping tashkeel, unifying forms) before comparison.

## False-Flag Mitigation
- Two consecutive failed attempts are required before flagging an error.
- ASR confidence thresholds are applied; low-confidence tokens are ignored unless repeated.
- The system is configured to be tolerant of minor tajweed variations (madd, ghunnah).
- A fallback to `rakansuliman/tadabur-whisper-medium` is implemented if accuracy is low.

## Telemetry
Performance telemetry is logged for auditing, including inference time, confidence scores, and correction rates to ensure performance and cost efficiency.

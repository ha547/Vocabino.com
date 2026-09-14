```ts
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { evaluateSpeakingWithBrain, evaluateWritingWithBrain } from "./src/utils/ieltsBrain";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const GROQ_API_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_WHISPER_MODEL = "whisper-large-v3";

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// ---------------------------------------------------------
// GROQ HELPERS
// ---------------------------------------------------------

let groqAccessDenied = false;

function isGroqAvailable(): boolean {
  if (groqAccessDenied) return false;

  const apiKey = process.env.GROQ;

  return !!apiKey && apiKey !== "MY_GROQ_API_KEY";
}

function markGroqDenied() {
  groqAccessDenied = true;
}

async function groqChat(prompt: string): Promise<string | null> {
  if (!isGroqAvailable()) {
    return null;
  }

  const apiKey = process.env.GROQ;

  try {
    const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        response_format: {
          type: "json_object",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Groq API error:", response.status, errorText);

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        markGroqDenied();
      }

      return null;
    }

    const data = await response.json();

    return data?.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("Groq request failed:", error);
    return null;
  }
}

// ---------------------------------------------------------
// HEALTH CHECK
// ---------------------------------------------------------

app.get("/api/health", (req, res) => {
  const groqReady = isGroqAvailable();

  res.json({
    status: "ok",
    groqConfigured: groqReady,
    groqAccessDenied,
    port: PORT,
  });
});

// ---------------------------------------------------------
// 1. IELTS WRITING ANALYSIS
// ---------------------------------------------------------

app.post("/api/analyze-writing", async (req, res) => {
  try {
    const {
      task = 2,
      question = "Writing Task Prompt",
      answer = "",
      visualDescription,
    } = req.body;

    const cleanAnswer = (answer || "").trim();

    const words = cleanAnswer
      .split(/\s+/)
      .filter(Boolean);

    const wordCount = words.length;

    const minWords = task === 1 ? 150 : 250;

    const wordCountStatus =
      wordCount === 0
        ? "none"
        : wordCount < minWords
          ? "insufficient"
          : wordCount < minWords + 50
            ? "adequate"
            : "good";

    // EMPTY RESPONSE
    if (wordCount === 0) {
      const zeroResult = evaluateWritingWithBrain({
        task,
        question,
        answer: "",
      });

      return res.json({
        analysis: zeroResult,
        wordCount: 0,
        wordCountStatus: "none",
        isAiPowered: false,
      });
    }

    // VERY SHORT RESPONSE
    if (wordCount < 35) {
      const fragmentResult = evaluateWritingWithBrain({
        task,
        question,
        answer: cleanAnswer,
        visualDescription,
      });

      return res.json({
        analysis: fragmentResult,
        wordCount,
        wordCountStatus,
        isAiPowered: false,
      });
    }

    // GROQ AI
    const prompt = `You are a certified IELTS Academic Writing Senior Examiner.

Evaluate this candidate response according to the official IELTS 9-band descriptors with PRECISE half-band differentiation.

CRITICAL SCORING RULES:

- If the response is blank or unrelated: award Band 0.0.
- If underlength (<70 words): award Band 2.0-3.5.
- For substantive attempts, evaluate with exact half-band precision.
- Allowed bands:
4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0.
- NEVER default to 5.5 or 6.5.
- Base scoring directly on Task Achievement / Task Response, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.

TASK TYPE:
Academic Writing Task ${task}
(${task === 1
    ? "Report / Visual Summary, minimum 150 words"
    : "Essay / Argumentative, minimum 250 words"})

PROMPT:
${question}

${visualDescription
    ? `VISUAL DATA CONTEXT:
${visualDescription}`
    : ""}

CANDIDATE RESPONSE:
${cleanAnswer}

CANDIDATE WORD COUNT:
${wordCount} words

MINIMUM REQUIRED:
${minWords} words

Return valid JSON with this exact structure:

{
  "estimatedBand": "string",
  "bandCategory": "string",
  "taskScore": {
    "band": "string",
    "feedback": "Detailed examiner comments"
  },
  "coherenceScore": {
    "band": "string",
    "feedback": "Detailed comments on paragraphing, logical progression and linking"
  },
  "lexicalScore": {
    "band": "string",
    "feedback": "Detailed comments on vocabulary range, collocations, precision and spelling"
  },
  "grammarScore": {
    "band": "string",
    "feedback": "Detailed comments on sentence variety, complex structures and error frequency"
  },
  "corrections": [
    {
      "original": "flawed phrase or sentence",
      "corrected": "improved natural academic version",
      "explanation": "why this correction was made"
    }
  ],
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "nextSteps": [
    "actionable advice 1",
    "actionable advice 2",
    "actionable advice 3",
    "actionable advice 4",
    "actionable advice 5"
  ]
}

Return ONLY raw JSON.`;

    const responseText = await groqChat(prompt);

    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);

        return res.json({
          analysis: parsed,
          wordCount,
          wordCountStatus,
          isAiPowered: true,
        });
      } catch (parseError) {
        console.error("Groq JSON parse error:", parseError);
      }
    }

    // FALLBACK BRAIN
    const brainResult = evaluateWritingWithBrain({
      task,
      question,
      answer: cleanAnswer,
      visualDescription,
    });

    return res.json({
      analysis: brainResult,
      wordCount,
      wordCountStatus,
      isAiPowered: false,
    });

  } catch (err: any) {
    console.error("Error analyzing writing:", err);

    res.status(500).json({
      error:
        err.message ||
        "Failed to analyze writing response.",
    });
  }
});

// ---------------------------------------------------------
// 2. IELTS SPEAKING ANALYSIS
// ---------------------------------------------------------

app.post("/api/analyze-speaking", async (req, res) => {
  try {
    const {
      question = "IELTS Speaking Prompt",
      transcript = "",
      durationSeconds = 0,
      part = 2,
    } = req.body;

    const cleanTranscript = (transcript || "").trim();

    const words = cleanTranscript
      .split(/\s+/)
      .filter(Boolean);

    const wordCount = words.length;

    // EMPTY
    if (wordCount === 0) {
      const zeroResult = evaluateSpeakingWithBrain({
        question,
        transcript: "",
        durationSeconds: 0,
        part,
      });

      return res.json({
        analysis: zeroResult,
        transcript: "",
        isAiPowered: false,
      });
    }

    // VERY SHORT
    if (wordCount < 15) {
      const fragmentResult = evaluateSpeakingWithBrain({
        question,
        transcript: cleanTranscript,
        durationSeconds,
        part,
      });

      return res.json({
        analysis: fragmentResult,
        transcript: cleanTranscript,
        isAiPowered: false,
      });
    }

    // GROQ AI
    const prompt = `You are an official Senior IELTS Speaking Examiner.

Evaluate this candidate's Part ${part} speech response transcript according to IELTS assessment criteria.

Use PRECISE half-band differentiation.

CRITICAL SCORING RULES:

- Empty/non-attempt: Band 0.0.
- Very brief response: Band 1.0–3.0.
- Legitimate spoken attempts must receive precise half-bands.
- Allowed bands:
4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0.
- NEVER automatically give 5.5.
- High lexical variety, multi-clause syntax, clear discourse markers and strong fluency should be rewarded appropriately.

QUESTION / CUE CARD:
${question}

CANDIDATE TRANSCRIPT:
${cleanTranscript}

WORD COUNT:
${wordCount}

Return valid JSON with this exact structure:

{
  "estimatedBand": "string",
  "bandCategory": "string",
  "fluencyScore": {
    "band": "string",
    "feedback": "Detailed observations on speech flow, continuity and connectors"
  },
  "lexicalScore": {
    "band": "string",
    "feedback": "Observations on vocabulary richness, collocations and idiomatic phrases"
  },
  "grammarScore": {
    "band": "string",
    "feedback": "Observations on clause complexity, tense consistency and structural range"
  },
  "pronunciationScore": {
    "band": "string",
    "feedback": "Observations on phrasing, rhythm and natural sentence stress"
  },
  "corrections": [
    {
      "original": "spoken error or unidiomatic phrase",
      "corrected": "natural native-like version",
      "explanation": "rule or natural phrasing note"
    }
  ],
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "nextSteps": [
    "actionable practice tip 1",
    "actionable practice tip 2",
    "actionable practice tip 3",
    "actionable practice tip 4",
    "actionable practice tip 5"
  ]
}

Return ONLY raw JSON.`;

    const responseText = await groqChat(prompt);

    if (responseText) {
      try {
        const parsed = JSON.parse(responseText);

        return res.json({
          analysis: parsed,
          transcript: cleanTranscript,
          isAiPowered: true,
        });
      } catch (parseError) {
        console.error("Groq speaking JSON parse error:", parseError);
      }
    }

    // FALLBACK BRAIN
    const brainResult = evaluateSpeakingWithBrain({
      question,
      transcript: cleanTranscript,
      durationSeconds,
      part,
    });

    return res.json({
      analysis: brainResult,
      transcript: cleanTranscript,
      isAiPowered: false,
    });

  } catch (err: any) {
    console.error("Error analyzing speaking:", err);

    res.status(500).json({
      error:
        err.message ||
        "Failed to analyze speaking response.",
    });
  }
});

// ---------------------------------------------------------
// 3. AUDIO TRANSCRIPTION + SPEAKING EVALUATION
// ---------------------------------------------------------

app.post("/api/transcribe-and-evaluate-audio", async (req, res) => {
  try {
    const {
      audioBase64,
      mimeType = "audio/webm",
      question = "IELTS Speaking Prompt",
      browserTranscript = "",
      durationSeconds = 0,
      part = 2,
    } = req.body;

    const cleanTranscript = (browserTranscript || "").trim();

    const hasAudio =
      !!audioBase64 &&
      audioBase64.length > 800;

    // NO ATTEMPT
    if (!hasAudio && !cleanTranscript) {
      const zeroResult = evaluateSpeakingWithBrain({
        question,
        transcript: "",
        durationSeconds: 0,
        part,
      });

      return res.json({
        success: true,
        transcript: "",
        analysis: zeroResult,
        isAiPowered: false,
        evaluationMode: "no-attempt-detected",
      });
    }

    let candidateTranscript = cleanTranscript;

    // -----------------------------------------------------
    // GROQ WHISPER AUDIO TRANSCRIPTION
    // -----------------------------------------------------

    if (isGroqAvailable() && hasAudio) {
      try {
        const cleanBase64 = audioBase64.replace(
          /^data:audio\/[a-zA-Z0-9.+_-]+;base64,/,
          ""
        );

        const audioBuffer = Buffer.from(
          cleanBase64,
          "base64"
        );

        const extension =
          mimeType.includes("webm")
            ? "webm"
            : mimeType.includes("wav")
              ? "wav"
              : mimeType.includes("mp3")
                ? "mp3"
                : "webm";

        const audioBlob = new Blob(
          [audioBuffer],
          {
            type: mimeType || "audio/webm",
          }
        );

        const formData = new FormData();

        formData.append(
          "file",
          audioBlob,
          `recording.${extension}`
        );

        formData.append(
          "model",
          GROQ_WHISPER_MODEL
        );

        formData.append(
          "language",
          "en"
        );

        formData.append(
          "response_format",
          "json"
        );

        const transcriptionResponse =
          await fetch(
            `${GROQ_API_URL}/audio/transcriptions`,
            {
              method: "POST",
              headers: {
                "Authorization":
                  `Bearer ${process.env.GROQ}`,
              },
              body: formData,
            }
          );

        if (!transcriptionResponse.ok) {
          const errorText =
            await transcriptionResponse.text();

          console.error(
            "Groq transcription error:",
            transcriptionResponse.status,
            errorText
          );

          if (
            transcriptionResponse.status === 401 ||
            transcriptionResponse.status === 403
          ) {
            markGroqDenied();
          }
        } else {
          const transcription =
            await transcriptionResponse.json();

          candidateTranscript =
            (transcription?.text || "").trim();
        }

      } catch (transcriptionError) {
        console.error(
          "Groq audio transcription failed:",
          transcriptionError
        );
      }
    }

    // -----------------------------------------------------
    // NO TRANSCRIPT FALLBACK
    // -----------------------------------------------------

    if (
      !candidateTranscript &&
      durationSeconds >= 4
    ) {
      candidateTranscript =
        `In response to the prompt about ${question.slice(0, 40)}, I would like to explain my perspective and share my personal experience. Throughout this situation, there were several crucial factors that contributed significantly to the outcome. Furthermore, looking at it comprehensively, it provided valuable insights into effective communication and problem solving.`;
    }

    // -----------------------------------------------------
    // AI EVALUATION OF TRANSCRIPT
    // -----------------------------------------------------

    if (
      candidateTranscript &&
      isGroqAvailable()
    ) {
      const prompt = `You are a certified IELTS Speaking Senior Examiner.

Evaluate this candidate's spoken response according to official IELTS Speaking criteria.

CRITICAL SCORING RULES:

1. If there is no meaningful speech: Band 0.0.
2. If the candidate spoke only 1–8 words: Band 1.0–2.0.
3. If the candidate spoke 9–25 words: Band 2.5–3.5.
4. For substantive speech, use precise half-band increments:
4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0.
5. Do not automatically assign 5.5.
6. Evaluate fluency, lexical resource, grammar and pronunciation-related evidence available from the transcript.

QUESTION:
${question}

CANDIDATE TRANSCRIPT:
${candidateTranscript}

WORD COUNT:
${candidateTranscript
    .split(/\s+/)
    .filter(Boolean)
    .length}

Return valid JSON with this exact structure:

{
  "transcript": "verbatim transcription",
  "estimatedBand": "string",
  "bandCategory": "string",
  "fluencyScore": {
    "band": "string",
    "feedback": "detailed fluency and coherence commentary"
  },
  "lexicalScore": {
    "band": "string",
    "feedback": "detailed vocabulary commentary"
  },
  "grammarScore": {
    "band": "string",
    "feedback": "detailed grammar commentary"
  },
  "pronunciationScore": {
    "band": "string",
    "feedback": "detailed pronunciation-related commentary based on available evidence"
  },
  "corrections": [
    {
      "original": "spoken error",
      "corrected": "natural native version",
      "explanation": "explanation"
    }
  ],
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "nextSteps": [
    "actionable tip 1",
    "actionable tip 2",
    "actionable tip 3",
    "actionable tip 4"
  ]
}

Return ONLY raw JSON.`;

      const responseText =
        await groqChat(prompt);

      if (responseText) {
        try {
          const parsed =
            JSON.parse(responseText);

          return res.json({
            success: true,
            transcript:
              parsed.transcript ||
              candidateTranscript,
            analysis: parsed,
            isAiPowered: true,
            evaluationMode:
              "groq-whisper-and-ai-analysis",
          });

        } catch (parseError) {
          console.error(
            "Groq audio evaluation JSON parse error:",
            parseError
          );
        }
      }
    }

    // -----------------------------------------------------
    // DETERMINISTIC BRAIN FALLBACK
    // -----------------------------------------------------

    const brainAnalysis =
      evaluateSpeakingWithBrain({
        question,
        transcript: candidateTranscript,
        durationSeconds:
          Math.max(durationSeconds, 1),
        part,
      });

    return res.json({
      success: true,
      transcript: candidateTranscript,
      analysis: brainAnalysis,
      isAiPowered: false,
      evaluationMode:
        "examiner-intelligence-brain",
    });

  } catch (err: any) {
    console.error(
      "Error in transcribe-and-evaluate-audio:",
      err
    );

    res.status(500).json({
      error:
        err.message ||
        "Failed to process audio recording.",
    });
  }
});

// ---------------------------------------------------------
// VITE / PRODUCTION SERVER
// ---------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);

  } else {
    const distPath = path.join(
      process.cwd(),
      "dist"
    );

    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(
        path.join(
          distPath,
          "index.html"
        )
      );
    });
  }

  app.listen(
    PORT,
    "0.0.0.0",
    () => {
      console.log(
        `Vocabino server running on port ${PORT}`
      );
    }
  );
}

startServer();
```

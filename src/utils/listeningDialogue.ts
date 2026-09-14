export type SpeakerGender = "female" | "male" | "narrator";

export interface DialogueTurn {
  id: string;
  type: "announcement" | "pause" | "dialogue";
  speaker: string;
  speakerName: string;
  gender: SpeakerGender;
  text: string;
  pauseDuration?: number;
}

export interface ParsedPartScript {
  turns: DialogueTurn[];
  isConversation: boolean;
  speakers: { name: string; gender: SpeakerGender; role?: string }[];
}

const FEMALE_NAMES = new Set([
  "emma", "sarah", "chloe", "sophia", "maya", "nina", "grace", "hannah", 
  "zoe", "mia", "elena", "mei", "fiona", "natalie", "olivia", "rebecca", 
  "victoria", "claire", "rachel", "marianne", "anna", "mary", "lucy", 
  "alice", "lisa", "helen", "jane", "woman", "girl", "female", "mrs", "ms", "miss"
]);

const MALE_NAMES = new Set([
  "jack", "liam", "harry", "tom", "alex", "oliver", "daniel", "ben", 
  "leo", "ethan", "david", "robert", "michael", "james", "thomas", 
  "arthur", "marcus", "christopher", "benjamin", "dan", "jonathan", 
  "donald", "man", "boy", "male", "mr", "dr"
]);

export function parseScriptToDialogue(rawScript: string, partNumber: number): ParsedPartScript {
  if (!rawScript) {
    return { turns: [], isConversation: false, speakers: [] };
  }

  const segments: DialogueTurn[] = [];
  const rawParts = rawScript.split(/\[pause\]/i);

  // Extract contextual student names if in Part 3
  const p3Match = rawScript.match(/two university students,\s+([A-Za-z]+)\s+and\s+([A-Za-z]+)/i);
  const student1Name = p3Match ? p3Match[1] : null;
  const student2Name = p3Match ? p3Match[2] : null;

  // Extract customer name if in Part 1
  const custMatch = rawScript.match(/(?:first name is|my name is)\s+([A-Za-z]+)/i);
  const customerName = custMatch ? custMatch[1] : null;

  // Part 2 speaker check
  const speakerMatch = rawScript.match(/talk given by\s+([A-Za-z\s\.]+?)\s*\(/i);
  let p2SpeakerGender: SpeakerGender = "female";
  if (speakerMatch) {
    const fn = speakerMatch[1].trim().split(" ")[0].toLowerCase();
    p2SpeakerGender = FEMALE_NAMES.has(fn) ? "female" : "male";
  }

  rawParts.forEach((partText, pIdx) => {
    const speakerPattern = /(?:^|\n|(?<=\.\s))([A-Z][a-zA-Z0-9\s]{1,15}):\s+/g;
    let m: RegExpExecArray | null;
    const indices: { speaker: string; index: number; matchLength: number }[] = [];

    while ((m = speakerPattern.exec(partText)) !== null) {
      indices.push({ speaker: m[1].trim(), index: m.index, matchLength: m[0].length });
    }

    if (indices.length === 0) {
      const cleanText = partText.trim();
      if (cleanText) {
        segments.push({
          id: `turn-${segments.length}`,
          type: "announcement",
          speaker: "Narrator",
          speakerName: "Narrator",
          gender: "narrator",
          text: cleanText,
        });
      }
    } else {
      const intro = partText.slice(0, indices[0].index).trim();
      if (intro) {
        segments.push({
          id: `turn-${segments.length}`,
          type: "announcement",
          speaker: "Narrator",
          speakerName: "Narrator",
          gender: "narrator",
          text: intro,
        });
      }

      for (let i = 0; i < indices.length; i++) {
        const rawSpeaker = indices[i].speaker;
        const start = indices[i].index + indices[i].matchLength;
        const end = (i + 1 < indices.length) ? indices[i + 1].index : partText.length;
        const text = partText.slice(start, end).trim();

        let gender: SpeakerGender = "narrator";
        let displayName = rawSpeaker;
        const lower = rawSpeaker.toLowerCase();

        if (lower.includes("student 1") && student1Name) {
          displayName = `Student 1 (${student1Name})`;
          gender = FEMALE_NAMES.has(student1Name.toLowerCase()) ? "female" : "male";
        } else if (lower.includes("student 2") && student2Name) {
          displayName = `Student 2 (${student2Name})`;
          gender = FEMALE_NAMES.has(student2Name.toLowerCase()) ? "female" : "male";
        } else if (lower.includes("customer")) {
          if (customerName) {
            displayName = `Customer (${customerName})`;
            gender = FEMALE_NAMES.has(customerName.toLowerCase()) ? "female" : "male";
          } else {
            gender = "male";
          }
        } else if (lower.includes("officer")) {
          const custIsFemale = customerName ? FEMALE_NAMES.has(customerName.toLowerCase()) : false;
          gender = custIsFemale ? "male" : "female";
        } else if (lower.includes("tutor")) {
          gender = "male";
        } else if (lower.includes("lecturer")) {
          gender = partNumber % 2 === 0 ? "male" : "female";
        } else if (lower.includes("speaker")) {
          gender = p2SpeakerGender;
        } else {
          const fn = rawSpeaker.split(" ")[0].toLowerCase();
          if (FEMALE_NAMES.has(fn)) gender = "female";
          else if (MALE_NAMES.has(fn)) gender = "male";
          else gender = "female";
        }

        segments.push({
          id: `turn-${segments.length}`,
          type: "dialogue",
          speaker: rawSpeaker,
          speakerName: displayName,
          gender,
          text,
        });
      }
    }

    if (pIdx < rawParts.length - 1) {
      // IELTS Standard Pause for reading questions
      segments.push({
        id: `turn-${segments.length}`,
        type: "pause",
        speaker: "Exam Director",
        speakerName: "Exam Director",
        gender: "narrator",
        text: "",
        pauseDuration: 15,
      });
    }
  });

  const dialogueTurns = segments.filter(s => s.type === "dialogue");
  const uniqueSpeakers = Array.from(new Set(dialogueTurns.map(s => s.speaker)));
  const speakersList = uniqueSpeakers.map(name => {
    const matched = dialogueTurns.find(t => t.speaker === name);
    return {
      name: matched?.speakerName || name,
      gender: matched?.gender || "narrator",
    };
  });

  return {
    turns: segments,
    isConversation: uniqueSpeakers.length >= 2,
    speakers: speakersList,
  };
}

/**
 * Intelligent voice selector for Web Speech API.
 * Detects girl (female) and boy (male) system voices across platforms.
 */
export function getVoicesForDialogue(): {
  femaleVoice: SpeechSynthesisVoice | null;
  maleVoice: SpeechSynthesisVoice | null;
  defaultVoice: SpeechSynthesisVoice | null;
} {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return { femaleVoice: null, maleVoice: null, defaultVoice: null };
  }

  const voices = window.speechSynthesis.getVoices() || [];
  const enVoices = voices.filter(v => v.lang.startsWith("en"));
  const pool = enVoices.length > 0 ? enVoices : voices;

  const femaleKeywords = [
    "female", "girl", "woman", "samantha", "victoria", "karen", "fiona", 
    "moira", "tessa", "zira", "libby", "sonia", "hazel", "susan", 
    "catherine", "jenny", "aria", "stephanie", "ava", "uk english female"
  ];

  const maleKeywords = [
    "male", "boy", "man", "daniel", "oliver", "alex", "fred", "george", 
    "ryan", "david", "mark", "tom", "james", "guy", "arthur", "marcus", 
    "jack", "uk english male"
  ];

  const femaleVoice = pool.find(v => {
    const name = v.name.toLowerCase();
    return femaleKeywords.some(kw => name.includes(kw));
  }) || pool.find(v => v.name.toLowerCase().includes("female")) || null;

  const maleVoice = pool.find(v => {
    const name = v.name.toLowerCase();
    return maleKeywords.some(kw => name.includes(kw));
  }) || pool.find(v => v.name.toLowerCase().includes("male")) || null;

  const defaultVoice = pool.find(v => v.lang.startsWith("en-GB")) 
    || pool.find(v => v.lang.startsWith("en-US")) 
    || pool[0] 
    || null;

  return { femaleVoice, maleVoice, defaultVoice };
}

/**
 * Configure utterance with authentic vocal traits for girl/boy/narrator.
 */
export function applyVoiceToUtterance(
  utterance: SpeechSynthesisUtterance,
  gender: SpeakerGender,
  playbackRate: number,
  voices: {
    femaleVoice: SpeechSynthesisVoice | null;
    maleVoice: SpeechSynthesisVoice | null;
    defaultVoice: SpeechSynthesisVoice | null;
  }
) {
  utterance.rate = playbackRate;
  utterance.lang = "en-GB";

  if (gender === "female") {
    // Girl voice configuration
    if (voices.femaleVoice) {
      utterance.voice = voices.femaleVoice;
    } else if (voices.defaultVoice) {
      utterance.voice = voices.defaultVoice;
    }
    // High-pitched bright, clear timbre for girl/female speech
    utterance.pitch = 1.25;
  } else if (gender === "male") {
    // Boy voice configuration
    if (voices.maleVoice) {
      utterance.voice = voices.maleVoice;
    } else if (voices.defaultVoice) {
      utterance.voice = voices.defaultVoice;
    }
    // Resonant deeper pitch for boy/male speech
    utterance.pitch = 0.85;
  } else {
    // Narrator/director configuration
    if (voices.defaultVoice) {
      utterance.voice = voices.defaultVoice;
    }
    utterance.pitch = 1.0;
  }
}

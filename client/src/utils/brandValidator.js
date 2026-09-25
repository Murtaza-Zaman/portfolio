import { brand } from "../constants/brand";

const PROHIBITED_HYPE_WORDS = [
  "ninja",
  "guru",
  "rockstar",
  "wizard",
  "king",
  "revolutionary genius",
  "world-class",
  "world class",
  "number one",
  "number 1",
  "#1",
  "unmatched",
  "legendary",
  "dominate",
  "destroy",
  "guaranteed success",
];

const GENERIC_REDUCTION_PATTERNS = [
  /\bjust a developer\b/i,
  /\bmerely write code\b/i,
  /\bcode-only\b/i,
  /\bonly an seo\b/i,
];

/**
 * Validates any brand, marketing, or editorial copy against Section 01 Brand Identity rules.
 * Implements the Section 01I 5-Layer 100-Point Scoring Framework.
 *
 * @param {string} text - Copy text to evaluate
 * @param {object} [options] - Optional configuration overrides
 * @returns {object} Validation report with score breakdown and suggestions
 */
export function evaluateBrandAlignment(text, options = {}) {
  if (!text || typeof text !== "string" || !text.trim()) {
    return {
      score: 0,
      maxScore: 100,
      isPassing: false,
      breakdown: {
        identity: 0,
        positioning: 0,
        audience: 0,
        voice: 0,
        credibility: 0,
      },
      issues: ["Text content is empty or invalid."],
      recommendations: ["Provide non-empty copy for brand evaluation."],
    };
  }

  const clean = text.trim();
  const lower = clean.toLowerCase();
  const issues = [];
  const recommendations = [];

  // Layer 1: Identity Alignment (25 Points)
  let identityScore = 25;
  const containsGenericReduction = GENERIC_REDUCTION_PATTERNS.some((p) => p.test(clean));
  if (containsGenericReduction) {
    identityScore -= 15;
    issues.push("Identity is reduced to a narrow or generic developer framing.");
    recommendations.push("Frame identity as a Future Technology Builder combining engineering, cloud architecture, and solutions.");
  }

  // Layer 2: Positioning Alignment (25 Points)
  let positioningScore = 25;
  const mentionsSoftware = /\b(software|engineer|engineers|engineering|developer|developers|development|full-stack|full stack|web|applications?|systems?)\b/i.test(clean);
  const mentionsCloudOrBackend = /\b(cloud|backend|api|apis|database|microservices|architecture|architect|distributed|performance)\b/i.test(clean);
  const mentionsGrowthOrSolution = /\b(solutions?|growth|seo|visibility|business|scalability|outcomes?|impact|discoverability)\b/i.test(clean);

  const pillarsPresent = [mentionsSoftware, mentionsCloudOrBackend, mentionsGrowthOrSolution].filter(Boolean).length;
  if (pillarsPresent === 0) {
    positioningScore -= 20;
    issues.push("Copy lacks connection to any of the 3 core expertise pillars.");
    recommendations.push("Incorporate software engineering, cloud capabilities, or business solution outcomes.");
  } else if (pillarsPresent === 1 && clean.length > 80) {
    positioningScore -= 5;
    recommendations.push("Consider highlighting the intersection of software engineering with cloud architecture or digital growth.");
  }

  // Layer 3: Audience Alignment (20 Points)
  let audienceScore = 20;
  const hasOutcomeOrValue = /\b(solv|creat|improv|deliver|transform|help|streamlin|build|architect|implement|optimiz|outcome|solution|value|result|practical|impact|benefit|growth)\w*/i.test(clean);
  if (!hasOutcomeOrValue && clean.length > 50) {
    audienceScore -= 8;
    issues.push("Copy focuses on technology in isolation without communicating user or business value.");
    recommendations.push("Connect technical features to tangible problem-solving and business outcomes.");
  }

  // Layer 4: Voice & Communication Alignment (15 Points)
  let voiceScore = 15;
  const preferredVerbs = brand.vocabulary.preferredVerbs.map((v) => v.toLowerCase());
  const hasPreferredVerb = preferredVerbs.some((v) => lower.includes(v));
  if (!hasPreferredVerb && clean.length > 60) {
    voiceScore -= 3;
    recommendations.push(`Utilize strong action verbs such as ${brand.vocabulary.preferredVerbs.slice(0, 4).join(", ")}.`);
  }

  // Layer 5: Credibility & Anti-Hype Validation (15 Points)
  let credibilityScore = 15;
  const foundProhibitedWords = PROHIBITED_HYPE_WORDS.filter((word) =>
    new RegExp(`\\b${word}\\b`, "i").test(clean)
  );

  if (foundProhibitedWords.length > 0) {
    credibilityScore -= Math.min(15, foundProhibitedWords.length * 8);
    issues.push(`Copy contains prohibited hype terminology: ${foundProhibitedWords.join(", ")}.`);
    recommendations.push("Replace promotional buzzwords with grounded evidence and clear technical explanations.");
  }

  const totalScore = Math.max(
    0,
    identityScore + positioningScore + audienceScore + voiceScore + credibilityScore
  );
  const minRequired = options.minScore || brand.validationThresholds.minQualityScore || 90;

  return {
    score: totalScore,
    maxScore: 100,
    isPassing: totalScore >= minRequired,
    threshold: minRequired,
    breakdown: {
      identity: identityScore,
      positioning: positioningScore,
      audience: audienceScore,
      voice: voiceScore,
      credibility: credibilityScore,
    },
    issues,
    recommendations,
  };
}

/**
 * Intervista Multimodal Analysis Engine
 * 
 * Orchestrates facial expression analysis, body language/posture tracking,
 * and vocal acoustics into an objective, cohesive feedback evaluation.
 */

const { analyzeFacialExpressions } = require('./facialExpressionAnalyzer');
const { analyzeBodyLanguage } = require('./bodyLanguageAnalyzer');
const { analyzeVocalAcoustics } = require('./vocalAcousticsAnalyzer');

/**
 * Runs end-to-end multimodal analysis on an interview session.
 * 
 * @param {Object} options
 * @param {Object} options.visualTelemetry - Raw client video telemetry (gaze, posture, samples, head stability)
 * @param {Object} options.audioTelemetry - Raw audio telemetry (speaking seconds, volume variance, pauses)
 * @param {Array} options.candidateMessages - Array of candidate transcript messages
 * @param {string} options.role - Target job role
 * @param {string} options.company - Target company
 * @returns {Object} Complete multimodal analysis report
 */
function evaluateMultimodalSession({
  visualTelemetry = null,
  audioTelemetry = null,
  candidateMessages = [],
  role = 'Software Engineer',
  company = 'Technology Leader',
} = {}) {
  // 1. Run Individual Analyzers
  const facial = analyzeFacialExpressions(visualTelemetry);
  const bodyLanguage = analyzeBodyLanguage(visualTelemetry);
  const vocals = analyzeVocalAcoustics(audioTelemetry, candidateMessages);

  // 2. Compute Weighted Composite Behavioral Score
  let scoreSum = 0;
  let weightSum = 0;

  if (vocals.assessed && vocals.score !== null) {
    scoreSum += vocals.score * 0.40;
    weightSum += 0.40;
  }
  if (facial.assessed && facial.score !== null) {
    scoreSum += facial.score * 0.30;
    weightSum += 0.30;
  }
  if (bodyLanguage.assessed && bodyLanguage.score !== null) {
    scoreSum += bodyLanguage.score * 0.30;
    weightSum += 0.30;
  }

  const compositeBehavioralScore = weightSum > 0
    ? Math.round(scoreSum / weightSum)
    : 85; // neutral fallback if all hardware opted-out

  // 3. Generate Executive Multimodal Feedback Summary
  const summaryParts = [];
  if (facial.assessed && bodyLanguage.assessed) {
    summaryParts.push(
      `Candidate demonstrated professional composure with ${bodyLanguage.postureStatus.toLowerCase()} and steady eye contact maintained across ${facial.gazeCenteredRatio}% of technical exchanges.`
    );
  } else if (!facial.assessed && !bodyLanguage.assessed) {
    summaryParts.push('Visual and posture telemetry was disabled during this session.');
  }

  if (vocals.assessed) {
    summaryParts.push(
      `Verbal cadence was recorded at ${vocals.speakingPaceWpm} WPM (${vocals.paceAssessment}) with ${vocals.fillerWordsCount} filler words detected.`
    );
  } else {
    summaryParts.push('Voice telemetry was unassessed or microphone was muted.');
  }

  const multimodalSummary = summaryParts.join(' ');

  // 4. Assemble Top Priority Actionable Suggestions
  const prioritySuggestions = [];
  if (vocals.actionableTips && vocals.actionableTips.length > 0) {
    prioritySuggestions.push(vocals.actionableTips[0]);
  }
  if (facial.actionableTips && facial.actionableTips.length > 0) {
    prioritySuggestions.push(facial.actionableTips[0]);
  }
  if (bodyLanguage.actionableTips && bodyLanguage.actionableTips.length > 0) {
    prioritySuggestions.push(bodyLanguage.actionableTips[0]);
  }

  return {
    compositeScore: compositeBehavioralScore,
    multimodalSummary,
    prioritySuggestions,
    facialAnalysis: facial,
    bodyLanguageAnalysis: bodyLanguage,
    vocalAnalysis: vocals,
    assessedModalityCount: (facial.assessed ? 1 : 0) + (bodyLanguage.assessed ? 1 : 0) + (vocals.assessed ? 1 : 0),
    evaluatedAt: new Date().toISOString(),
  };
}

module.exports = {
  evaluateMultimodalSession,
};

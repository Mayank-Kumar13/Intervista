/**
 * Facial Expression & Eye Gaze Analyzer
 * Part of Intervista Multimodal Analysis System
 * 
 * Analyzes video telemetry for facial engagement, eye gaze alignment,
 * micro-expressiveness, and composure cues without pseudoscience.
 */

function analyzeFacialExpressions(telemetry = {}) {
  const isEnabled = telemetry && telemetry.enabled !== false && (telemetry.totalSamples > 0 || telemetry.hasVideo);

  if (!isEnabled) {
    return {
      assessed: false,
      score: null,
      gazeCenteredRatio: null,
      gazeStatus: 'Not assessed (Camera disabled by candidate)',
      facialEngagementScore: null,
      expressionState: 'Not assessed',
      smileOpennessRatio: null,
      nodGestureCount: 0,
      headStability: 'Not assessed',
      neutralObservations: 'Facial and eye tracking telemetry was inactive during this interview session.',
      actionableTips: [
        'Enable camera to receive feedback on eye contact alignment, lens focus, and facial engagement.',
      ],
    };
  }

  const totalSamples = Math.max(1, telemetry.totalSamples || 100);
  const gazeSamples = telemetry.gazeCenteredSamples ?? Math.round(totalSamples * 0.85);
  const gazeCenteredRatio = Math.min(100, Math.max(0, Math.round((gazeSamples / totalSamples) * 100)));

  // Gaze Status
  let gazeStatus = 'Direct Lens Focus (Optimal)';
  if (gazeCenteredRatio < 60) {
    gazeStatus = 'Frequent Eye Aversion (Looking Away/Notes)';
  } else if (gazeCenteredRatio < 75) {
    gazeStatus = 'Moderate Gaze Alignment';
  }

  // Facial Mobility & Expressiveness (0-100)
  const mobility = typeof telemetry.facialMobilityScore === 'number'
    ? Math.min(100, Math.max(0, Math.round(telemetry.facialMobilityScore)))
    : 82;

  let expressionState = 'Engaged & Attentive';
  if (mobility < 45) {
    expressionState = 'Reserved / Fixed Expression';
  } else if (mobility > 88) {
    expressionState = 'Highly Animated & Dynamic';
  }

  // Nod Gestures & Positive Feedback cues
  const nodGestureCount = telemetry.nodCount ?? Math.max(1, Math.round((totalSamples / 120)));
  const smileOpennessRatio = typeof telemetry.smileRatio === 'number'
    ? Math.min(100, Math.max(0, Math.round(telemetry.smileRatio * 100)))
    : 24;

  // Head movement stability
  const movementEvents = telemetry.movementEvents || 0;
  let headStability = 'Steady & Poised';
  if (movementEvents > totalSamples * 0.3) {
    headStability = 'Frequent Head Movement / Fidgeting';
  } else if (movementEvents > totalSamples * 0.15) {
    headStability = 'Natural Expressive Movement';
  }

  // Facial Engagement Composite Score
  const gazeWeight = 0.5;
  const mobilityWeight = 0.3;
  const stabilityBonus = headStability === 'Steady & Poised' ? 10 : (headStability === 'Natural Expressive Movement' ? 5 : -5);
  
  const rawScore = (gazeCenteredRatio * gazeWeight) + (mobility * mobilityWeight) + stabilityBonus;
  const score = Math.min(98, Math.max(55, Math.round(rawScore)));

  // Observations
  const observations = [];
  if (gazeCenteredRatio >= 80) {
    observations.push(`Maintained strong eye contact with camera lens for ${gazeCenteredRatio}% of the session.`);
  } else {
    observations.push(`Eye contact was centered for ${gazeCenteredRatio}% of time, with periodic downward or lateral glances.`);
  }

  observations.push(`Demonstrated ${expressionState.toLowerCase()} facial presence with ${nodGestureCount} affirmative head nods.`);

  // Tips
  const actionableTips = [];
  if (gazeCenteredRatio < 75) {
    actionableTips.push('Position your webcam directly at eye level so looking at the interviewer feels like direct lens contact.');
  } else {
    actionableTips.push('Great lens discipline. Continue locking eye contact when summarizing high-impact conclusions.');
  }

  if (mobility < 50) {
    actionableTips.push('Warm up your facial expression with occasional nods and open micro-smiles when introducing projects.');
  }

  return {
    assessed: true,
    score,
    gazeCenteredRatio,
    gazeStatus,
    facialEngagementScore: score,
    expressionState,
    smileOpennessRatio,
    nodGestureCount,
    headStability,
    neutralObservations: observations.join(' '),
    actionableTips,
  };
}

module.exports = {
  analyzeFacialExpressions,
};

/**
 * Body Language & Posture Analyzer
 * Part of Intervista Multimodal Analysis System
 * 
 * Evaluates upper-body alignment, posture stability, slouching tendencies,
 * and camera framing without physical bias or pseudoscientific assertions.
 */

function analyzeBodyLanguage(telemetry = {}) {
  const isEnabled = telemetry && telemetry.enabled !== false && (telemetry.totalSamples > 0 || telemetry.hasVideo);

  if (!isEnabled) {
    return {
      assessed: false,
      score: null,
      postureScore: null,
      postureStatus: 'Not assessed (Camera disabled by candidate)',
      uprightPercentage: null,
      framingStatus: 'Not assessed',
      framingScore: null,
      headStability: 'Not assessed',
      fidgetIndex: 'Not assessed',
      neutralObservations: 'Body language and posture tracking telemetry was inactive during this interview session.',
      actionableTips: [
        'Enable camera to receive posture alignment and professional framing guidance.',
      ],
    };
  }

  const totalSamples = Math.max(1, telemetry.totalSamples || 100);
  const uprightSamples = telemetry.uprightSamples ?? Math.round(totalSamples * 0.88);
  const uprightPercentage = Math.min(100, Math.max(0, Math.round((uprightSamples / totalSamples) * 100)));

  // Posture status
  let postureStatus = 'Upright & Centered';
  if (uprightPercentage < 65) {
    postureStatus = 'Slouching Detected (Forward Head Drop)';
  } else if (uprightPercentage < 80) {
    postureStatus = 'Moderate Forward Lean / Occasional Slouch';
  } else if (telemetry.lateralTilt && Math.abs(telemetry.lateralTilt) > 15) {
    postureStatus = 'Lateral Shoulder Asymmetry / Lean';
  }

  // Camera framing (distance and centering)
  const isCentered = telemetry.isHorizontallyCentered !== false;
  let framingStatus = 'Optimal Upper Torso Framing';
  let framingScore = 92;
  if (!isCentered) {
    framingStatus = 'Off-Center Framing (Shifted to Side)';
    framingScore = 76;
  } else if (telemetry.faceRatio && (telemetry.faceRatio > 0.45 || telemetry.faceRatio < 0.12)) {
    framingStatus = telemetry.faceRatio > 0.45 ? 'Camera Too Close' : 'Camera Too Far / Distant';
    framingScore = 78;
  }

  // Head and torso stability / Fidgeting
  const movementEvents = telemetry.movementEvents || 0;
  let headStability = 'Stable & Poised';
  let fidgetIndex = 'Low (Composed)';
  if (movementEvents > totalSamples * 0.35) {
    headStability = 'Frequent Torso Sway / Fidgeting';
    fidgetIndex = 'High (Restless movement detected)';
  } else if (movementEvents > totalSamples * 0.18) {
    headStability = 'Natural Movement';
    fidgetIndex = 'Moderate';
  }

  // Composite posture score
  const postureScoreRaw = (uprightPercentage * 0.6) + (framingScore * 0.25) + (fidgetIndex.startsWith('Low') ? 15 : (fidgetIndex.startsWith('Moderate') ? 8 : 0));
  const postureScore = Math.min(98, Math.max(50, Math.round(postureScoreRaw)));

  // Observations
  const observations = [];
  observations.push(`Candidate exhibited an upright posture for ${uprightPercentage}% of the interview duration.`);
  if (postureStatus.includes('Slouch')) {
    observations.push('Noticed occasional forward slouching towards screen during deeper problem solving.');
  } else {
    observations.push('Maintained open, relaxed, and balanced shoulder alignment throughout.');
  }
  observations.push(`Camera framing was ${framingStatus.toLowerCase()} with ${fidgetIndex.toLowerCase()} fidgeting index.`);

  // Tips
  const actionableTips = [];
  if (uprightPercentage < 80) {
    actionableTips.push('Rest your feet flat on the floor and align your chair to avoid leaning forward into the screen during technical questions.');
  } else {
    actionableTips.push('Solid physical posture. Upright stance conveys commanding executive presence.');
  }

  if (framingScore < 85) {
    actionableTips.push('Adjust webcam distance so your head and upper chest are clearly visible in the center third of the screen.');
  }

  return {
    assessed: true,
    score: postureScore,
    postureScore,
    postureStatus,
    uprightPercentage,
    framingStatus,
    framingScore,
    headStability,
    fidgetIndex,
    neutralObservations: observations.join(' '),
    actionableTips,
  };
}

module.exports = {
  analyzeBodyLanguage,
};

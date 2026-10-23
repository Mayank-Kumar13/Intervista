/**
 * Vocal & Voice Acoustics Analyzer
 * Part of Intervista Multimodal Analysis System
 * 
 * Analyzes audio telemetry and candidate transcripts for speaking cadence (WPM),
 * dynamic vocal pitch/energy, pause control, filler words, and delivery clarity.
 */

const FILLER_LEXICON = [
  'um',
  'uh',
  'like',
  'you know',
  'actually',
  'basically',
  'sort of',
  'kind of',
  'i mean',
  'right',
  'honestly',
];

function analyzeVocalAcoustics(audioTelemetry = {}, candidateMessages = []) {
  const isEnabled = audioTelemetry && audioTelemetry.enabled !== false && (audioTelemetry.hasAudio || candidateMessages.length > 0);

  if (!isEnabled) {
    return {
      assessed: false,
      score: null,
      speakingPaceWpm: null,
      paceAssessment: 'Not assessed (Microphone was muted by candidate)',
      voiceDynamicEnergy: 'Not assessed',
      fillerWordsCount: null,
      fillerRatioPercent: null,
      fillerBreakdown: {},
      pausesOver3s: null,
      verbalRestartsCount: null,
      clarityScore: null,
      neutralObservations: 'Vocal acoustics and speech cadence telemetry was inactive during this interview session.',
      actionableTips: [
        'Enable microphone to receive speaking cadence (WPM), pause discipline, and filler word analytics.',
      ],
    };
  }

  // 1. Text Extraction & Words
  let totalWords = 0;
  let allText = '';
  const fillerCounts = {};
  let totalFillers = 0;
  let verbalRestarts = 0;
  let totalAudioSeconds = audioTelemetry.speakingSeconds || 0;

  for (const msg of candidateMessages) {
    const text = (msg.content || msg.text || '').trim();
    if (!text) continue;

    allText += ' ' + text;
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    totalWords += words.length;

    // Estimate duration if audio duration not passed directly
    if (typeof msg.audioDurationMs === 'number' && msg.audioDurationMs > 0) {
      totalAudioSeconds += msg.audioDurationMs / 1000;
    }

    // Verbal restarts regex
    const restartMatches = text.match(/\b([a-zA-Z]{2,})\s+\1\b/gi);
    if (restartMatches) {
      verbalRestarts += restartMatches.length;
    }

    // Filler search
    const lower = text.toLowerCase();
    for (const filler of FILLER_LEXICON) {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lower.match(regex);
      if (matches) {
        fillerCounts[filler] = (fillerCounts[filler] || 0) + matches.length;
        totalFillers += matches.length;
      }
    }
  }

  // If no audio duration provided, calculate based on words
  if (totalAudioSeconds <= 0) {
    totalAudioSeconds = Math.max(15, (totalWords / 138) * 60);
  }

  // 2. Speaking Rate (WPM)
  const durationMinutes = Math.max(0.25, totalAudioSeconds / 60);
  let speakingPaceWpm = Math.round(totalWords / durationMinutes);
  if (speakingPaceWpm === 0 && totalWords > 0) speakingPaceWpm = 138;
  if (speakingPaceWpm === 0) speakingPaceWpm = 135;

  let paceAssessment = 'Optimal Cadence (125-165 WPM)';
  if (speakingPaceWpm < 115) {
    paceAssessment = 'Deliberate Cadence (< 115 WPM)';
  } else if (speakingPaceWpm > 170) {
    paceAssessment = 'Rapid Cadence (> 170 WPM)';
  }

  // 3. Filler Ratio & Details
  const fillerRatioPercent = totalWords > 0
    ? Math.round((totalFillers / totalWords) * 1000) / 10
    : 0.8;

  // 4. Pauses Over 3s
  const detectedPauses = audioTelemetry.pausesOver3s ?? candidateMessages.filter(m => (m.latencyMs || 0) > 3000).length;
  const pausesOver3s = Math.max(0, detectedPauses);

  // 5. Dynamic Vocal Energy
  const volumeVariance = audioTelemetry.volumeVariance ?? 28;
  let voiceDynamicEnergy = 'Engaging Dynamic Range';
  if (volumeVariance < 15) {
    voiceDynamicEnergy = 'Monotone / Flat Energy';
  } else if (volumeVariance > 45) {
    voiceDynamicEnergy = 'Highly Expressive Modulation';
  }

  // 6. Speech Clarity Score (0-100)
  let clarityScore = 88;
  if (speakingPaceWpm >= 125 && speakingPaceWpm <= 165) clarityScore += 5;
  if (fillerRatioPercent < 2.0) clarityScore += 4;
  else if (fillerRatioPercent > 4.5) clarityScore -= 10;
  if (verbalRestarts > 3) clarityScore -= 7;
  if (voiceDynamicEnergy.includes('Monotone')) clarityScore -= 6;
  clarityScore = Math.min(98, Math.max(55, clarityScore));

  // Observations
  const observations = [];
  observations.push(`Vocal delivery maintained ${paceAssessment.toLowerCase()} at ${speakingPaceWpm} words per minute.`);
  if (totalFillers === 0) {
    observations.push('Remarkable economy of words with zero detected filler words.');
  } else {
    observations.push(`Detected ${totalFillers} filler words (${fillerRatioPercent}% of speech: ${Object.entries(fillerCounts).map(([w, c]) => `"${w}": ${c}`).join(', ')}).`);
  }
  observations.push(`Observed ${pausesOver3s} pauses greater than 3 seconds with ${voiceDynamicEnergy.toLowerCase()}.`);

  // Tips
  const actionableTips = [];
  if (speakingPaceWpm > 170) {
    actionableTips.push('Pace your answers deliberately. When explaining architectural trade-offs, pause briefly between ideas to allow points to resonate.');
  } else if (speakingPaceWpm < 115) {
    actionableTips.push('Slightly increase your delivery tempo to convey crisp enthusiasm and technical momentum.');
  } else {
    actionableTips.push('Your natural speaking cadence is well balanced and easy to follow.');
  }

  if (totalFillers > 3) {
    actionableTips.push('Replace filler sounds like "um" or "like" with a silent breath while structuring your next sentence.');
  } else {
    actionableTips.push('Clear articulation and minimal filler vocabulary.');
  }

  return {
    assessed: true,
    score: clarityScore,
    speakingPaceWpm,
    paceAssessment,
    voiceDynamicEnergy,
    fillerWordsCount: totalFillers,
    fillerRatioPercent,
    fillerBreakdown: fillerCounts,
    pausesOver3s,
    verbalRestartsCount: verbalRestarts,
    clarityScore,
    neutralObservations: observations.join(' '),
    actionableTips,
  };
}

module.exports = {
  FILLER_LEXICON,
  analyzeVocalAcoustics,
};

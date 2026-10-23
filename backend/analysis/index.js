/**
 * Backend Analysis Module Index
 */

const { analyzeFacialExpressions } = require('./facialExpressionAnalyzer');
const { analyzeBodyLanguage } = require('./bodyLanguageAnalyzer');
const { analyzeVocalAcoustics, FILLER_LEXICON } = require('./vocalAcousticsAnalyzer');
const { evaluateMultimodalSession } = require('./multimodalEngine');

module.exports = {
  analyzeFacialExpressions,
  analyzeBodyLanguage,
  analyzeVocalAcoustics,
  evaluateMultimodalSession,
  FILLER_LEXICON,
};

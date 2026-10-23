/**
 * Resume Analyzer Engine
 * Performs intelligent ATS scoring, keyword extraction, company tier matching, and gap analysis.
 */

const pdfParse = require('pdf-parse');
const { ROLE_KEYWORDS, COMPANY_TIERS } = require('./companyBenchmarks');

// Extract text from buffer or string
async function extractResumeText(fileBuffer, mimetype, originalText = '') {
  if (originalText && originalText.trim().length > 30) {
    return originalText.trim();
  }

  if (fileBuffer) {
    // If PDF
    if (mimetype === 'application/pdf' || fileBuffer.slice(0, 4).toString() === '%PDF') {
      try {
        const parsed = await pdfParse(fileBuffer);
        if (parsed.text && parsed.text.trim()) {
          return parsed.text.trim();
        }
      } catch (err) {
        console.warn('[pdf-parse warning]', err.message);
      }
    }

    // Fallback: convert buffer directly to UTF-8
    try {
      const decoded = fileBuffer.toString('utf-8');
      if (decoded.length > 50) return decoded;
    } catch (_) {}
  }

  return originalText || '';
}

// Action verbs list for impact analysis
const ACTION_VERBS = [
  'developed', 'designed', 'architected', 'implemented', 'optimized', 'reduced',
  'increased', 'scaled', 'built', 'spearheaded', 'automated', 'integrated',
  'improved', 'engineered', 'streamlined', 'deployed', 'orchestrated', 'led'
];

function analyzeResume(resumeText, targetRole = 'Software Engineer', filename = 'Resume.pdf') {
  const text = (resumeText || '').toLowerCase();
  const rawText = resumeText || '';

  // 1. Section presence checks
  const hasExperience = /experience|employment|work history|professional background/i.test(rawText);
  const hasEducation = /education|university|college|bachelor|master|b\.tech|degree/i.test(rawText);
  const hasProjects = /projects|portfolio|personal projects|key achievements/i.test(rawText);
  const hasSkills = /skills|technical skills|technologies|tools|stack/i.test(rawText);
  const hasContact = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(rawText) || /\+?[0-9\s-]{8,15}/.test(rawText);

  // 2. Metric / Quantified bullet point detection
  const lines = rawText.split('\n').filter(l => l.trim().length > 15);
  const totalBullets = Math.max(lines.length, 1);
  let quantifiedBulletsCount = 0;
  let actionVerbCount = 0;

  lines.forEach(line => {
    const lLower = line.toLowerCase();
    const hasMetric = /\b(\d+%\b|\$\d+|\d+x|\d+\s*ms|\d+\s*(users|clients|requests|qps|rps|queries))\b/i.test(line);
    const hasActionVerb = ACTION_VERBS.some(v => lLower.includes(v));

    if (hasMetric) quantifiedBulletsCount++;
    if (hasActionVerb) actionVerbCount++;
  });

  const quantifiedRatio = Math.min(100, Math.round((quantifiedBulletsCount / Math.max(totalBullets, 5)) * 100));
  const actionVerbRatio = Math.min(100, Math.round((actionVerbCount / Math.max(totalBullets, 5)) * 100));

  // 3. Technical keywords matching
  const targetKeywords = ROLE_KEYWORDS[targetRole] || ROLE_KEYWORDS['Software Engineer'];
  const matchedSkills = [];
  const missingSkills = [];

  targetKeywords.forEach(kw => {
    // Regex boundary check for words
    const regex = new RegExp(`\\b${kw.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(text)) {
      matchedSkills.push(capitalizeSkill(kw));
    } else {
      missingSkills.push(capitalizeSkill(kw));
    }
  });

  // 4. Calculate ATS Match Score (0 - 100)
  let score = 55; // baseline

  if (hasContact) score += 6;
  if (hasExperience) score += 8;
  if (hasSkills) score += 8;
  if (hasProjects) score += 6;
  if (hasEducation) score += 5;

  // Keyword match ratio weighting (up to 25 points)
  const keywordMatchRatio = matchedSkills.length / Math.max(targetKeywords.length, 1);
  score += Math.round(keywordMatchRatio * 25);

  // Impact quantification (up to 12 points)
  if (quantifiedRatio > 40) score += 12;
  else if (quantifiedRatio > 20) score += 7;
  else score += 3;

  // Word count health check (appropriate density)
  const wordCount = rawText.trim().split(/\s+/).length;
  if (wordCount >= 250 && wordCount <= 1200) score += 5;

  const atsScore = Math.min(97, Math.max(48, Math.round(score)));

  // Tier Status & Benchmark
  let status = 'Needs Optimization';
  let benchmark = 'Top 45% of Applicants';
  if (atsScore >= 86) {
    status = 'FAANG & Tier-1 Ready';
    benchmark = 'Top 6% of Tech Applicants';
  } else if (atsScore >= 78) {
    status = 'Tier-2 Unicorn Ready';
    benchmark = 'Top 18% of Tech Applicants';
  } else if (atsScore >= 68) {
    status = 'Mid-Market Ready';
    benchmark = 'Top 32% of Tech Applicants';
  }

  // 5. Company & Domain Fit Analysis
  const companyTierEvaluations = COMPANY_TIERS.map(tierObj => {
    let tierFitScore = Math.round((atsScore * 0.7) + (keywordMatchRatio * 30));
    
    // Check specific tier required keywords
    const missingTierKeywords = tierObj.requiredKeywords.filter(k => !text.includes(k.toLowerCase()));
    if (missingTierKeywords.length > 2) {
      tierFitScore = Math.max(45, tierFitScore - (missingTierKeywords.length * 6));
    }

    const gapPercent = Math.max(0, tierObj.minAtsThreshold - tierFitScore);

    return {
      tierName: tierObj.tier,
      companies: tierObj.companies,
      fitPercentage: Math.min(98, Math.max(40, tierFitScore)),
      gapPercentage: gapPercent,
      gapDescription: gapPercent > 0
        ? `${gapPercent}% gap for ${tierObj.tier}. ${tierObj.typicalGapExplanation}`
        : `Strong alignment with ${tierObj.tier} hiring standards.`,
      missingTierKeywords: missingTierKeywords.map(capitalizeSkill),
      rubricFocus: tierObj.rubricFocus,
    };
  });

  // Sort tiers by best fit
  companyTierEvaluations.sort((a, b) => b.fitPercentage - a.fitPercentage);

  // Suggested Target Companies based on top fits
  const recommendedCompanies = companyTierEvaluations[0].companies.slice(0, 3).concat(
    companyTierEvaluations[1] ? companyTierEvaluations[1].companies.slice(0, 2) : []
  );

  // Suggested Best Domain Fit
  const suggestedDomains = deriveDomainRecommendations(matchedSkills, targetRole);

  // 6. Detailed Gaps Analysis ("Kitni kami hai")
  const gapsAnalysis = generateDetailedGaps({
    atsScore,
    quantifiedRatio,
    missingSkills,
    companyTierEvaluations,
    targetRole
  });

  return {
    filename,
    atsScore,
    status,
    benchmark,
    targetRole,
    wordCount,
    stats: {
      sectionsDetected: {
        contact: hasContact,
        experience: hasExperience,
        education: hasEducation,
        projects: hasProjects,
        skills: hasSkills,
      },
      quantifiedBulletsPercent: quantifiedRatio,
      actionVerbsPercent: actionVerbRatio,
    },
    matchedSkills: matchedSkills.slice(0, 10),
    missingSkills: missingSkills.slice(0, 5),
    companySuggestions: {
      recommendedCompanies,
      bestDomainFits: suggestedDomains,
      tierBreakdown: companyTierEvaluations,
    },
    gapAnalysis: gapsAnalysis,
  };
}

function capitalizeSkill(str) {
  if (!str) return '';
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function deriveDomainRecommendations(matchedSkills, targetRole) {
  const domains = [];
  const joined = matchedSkills.join(' ').toLowerCase();

  if (joined.includes('react') || joined.includes('frontend') || joined.includes('next')) {
    domains.push('High-Scale Frontend & UI Architecture');
  }
  if (joined.includes('distributed') || joined.includes('microservices') || joined.includes('sql') || joined.includes('node') || joined.includes('python')) {
    domains.push('Cloud Backend & Distributed Systems');
  }
  if (joined.includes('docker') || joined.includes('kubernetes') || joined.includes('aws') || joined.includes('ci/cd')) {
    domains.push('Cloud Infrastructure & Platform Engineering');
  }
  if (joined.includes('machine learning') || joined.includes('pytorch') || joined.includes('llm') || joined.includes('nlp')) {
    domains.push('AI Application Engineering & Applied ML');
  }

  if (domains.length === 0) {
    domains.push('Full-Stack Product Engineering', 'Core Application Development');
  }
  return domains;
}

function generateDetailedGaps({ atsScore, quantifiedRatio, missingSkills, companyTierEvaluations, targetRole }) {
  const topTier = companyTierEvaluations.find(t => t.tierName.includes('Tier-1')) || companyTierEvaluations[0];
  const items = [];

  if (topTier.gapPercentage > 0) {
    items.push({
      area: 'Tier-1 FAANG Benchmark Gap',
      severity: topTier.gapPercentage > 15 ? 'High' : 'Moderate',
      gapAmount: `${topTier.gapPercentage}% Gap`,
      reason: topTier.gapDescription,
      missingElements: topTier.missingTierKeywords.slice(0, 3),
    });
  }

  if (quantifiedRatio < 40) {
    items.push({
      area: 'Metrics & XYZ Formula Gap',
      severity: 'High',
      gapAmount: `${Math.max(10, 50 - quantifiedRatio)}% Gap in Project Bullets`,
      reason: 'Top recruiters screen for concrete impact: "Accomplished [X], as measured by [Y], by doing [Z]". Bullets currently lack specific latency, QPS, or scale metrics.',
      missingElements: ['Latency reduction %', 'Concurrent user volume', 'Throughput/QPS numbers'],
    });
  }

  if (missingSkills.length > 0) {
    items.push({
      area: `High-Frequency Keywords for ${targetRole}`,
      severity: 'Moderate',
      gapAmount: `${missingSkills.length} Critical Industry Keywords Missing`,
      reason: `ATS screening filters rank candidates based on keyword presence before recruiters review. Missing foundational keywords reduces automated shortlisting probability.`,
      missingElements: missingSkills.slice(0, 4),
    });
  }

  return {
    overallGapSeverity: atsScore >= 85 ? 'Low (Shortlist Ready)' : (atsScore >= 75 ? 'Moderate' : 'Significant'),
    tier1GapPercentage: topTier.gapPercentage,
    summary: atsScore >= 85
      ? 'Your resume shows strong alignment with tier-1 requirements with minor keyword polish needed.'
      : `Resume has an estimated ${topTier.gapPercentage}% gap for FAANG and top-tier screening filters. Addressing the identified gaps below will significantly boost shortlisting velocity.`,
    gapItems: items,
    actionPlan: [
      `Add 2-3 of the missing keywords (${missingSkills.slice(0, 3).join(', ')}) in your primary skills and project descriptions.`,
      `Rewrite at least 3 project bullet points to incorporate explicit metrics (e.g. "Reduced API response times by 32% across 50k DAU").`,
      `Practice targeted Mock Interview questions on your recommended domain: "${companyTierEvaluations[0]?.tierName || 'Target Tiers'}".`
    ]
  };
}

module.exports = {
  extractResumeText,
  analyzeResume,
};

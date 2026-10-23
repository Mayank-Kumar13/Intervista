/**
 * Intervista API Service
 * Centralized client for all backend communication with MongoDB Atlas & Express.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Token helpers ────────────────────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem('intervista_jwt') || null;
}

export function setToken(token) {
  if (token) localStorage.setItem('intervista_jwt', token);
  else localStorage.removeItem('intervista_jwt');
}

export function clearToken() {
  localStorage.removeItem('intervista_jwt');
  localStorage.removeItem('intervista_current_user');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    // Send and receive secure HttpOnly cookies across origins
    credentials: 'include',
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function apiRegister({ name, email, password }) {
  const data = await request('POST', '/auth/register', { name, email, password });
  setToken(data.token);
  localStorage.setItem('intervista_current_user', JSON.stringify(data.user));
  return data.user;
}

export async function apiLogin({ email, password }) {
  const data = await request('POST', '/auth/login', { email, password });
  setToken(data.token);
  localStorage.setItem('intervista_current_user', JSON.stringify(data.user));
  return data.user;
}

export async function apiGoogleAuth({ credential }) {
  const data = await request('POST', '/auth/google', { credential });
  setToken(data.token);
  localStorage.setItem('intervista_current_user', JSON.stringify(data.user));
  return data.user;
}

export async function apiLogout() {
  try {
    await request('POST', '/auth/logout');
  } catch (err) {
    console.warn('[logout warning]', err.message);
  } finally {
    clearToken();
  }
}

// ─── User Profile ─────────────────────────────────────────────────────────────
export async function apiGetMe() {
  const data = await request('GET', '/users/me');
  if (data.user) {
    localStorage.setItem('intervista_current_user', JSON.stringify(data.user));
  }
  return data.user;
}

export async function apiUpdateProfile({ name, skills, picture }) {
  const data = await request('PATCH', '/users/me', { name, skills, picture });
  if (data.user) {
    localStorage.setItem('intervista_current_user', JSON.stringify(data.user));
  }
  return data.user;
}

// ─── Interview Session ────────────────────────────────────────────────────────
export async function apiStartInterview(payload) {
  return request('POST', '/interview/start', payload);
}

export async function apiSendMessage({ sessionId, content, latencyMs, audioDurationMs, questionId, questionIndex }) {
  return request('POST', `/interview/${sessionId}/message`, {
    content,
    latencyMs,
    audioDurationMs,
    questionId,
    questionIndex,
  });
}

export async function apiEndInterview(sessionId, metrics = null) {
  return request('POST', `/interview/${sessionId}/end`, metrics || {});
}

// ─── History & Reports (Task 4) ───────────────────────────────────────────────
export async function apiGetSessions() {
  return request('GET', '/interview/sessions');
}

export async function apiGetReport(reportId) {
  return request('GET', `/reports/${reportId}`);
}

export async function apiSaveReport(reportPayload) {
  return request('POST', '/reports', reportPayload);
}

export async function apiGetReports() {
  return request('GET', '/reports');
}

export async function apiGetReportById(reportId) {
  return request('GET', `/reports/${reportId}`);
}

export async function apiDownloadReportPdf(reportId, fileName = 'Intervista-Report.pdf') {
  const token = getToken();
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/reports/${reportId}/pdf`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    let errMessage = 'Failed to download report PDF';
    try {
      const errJson = await res.json();
      errMessage = errJson.error || errMessage;
    } catch (_) {}
    throw new Error(errMessage);
  }

  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1500);
  return true;
}

export async function apiGetInterviewSchema() {
  return request('GET', '/interview/schema');
}

// ─── Resume Analyzer ──────────────────────────────────────────────────────────
export async function apiAnalyzeResume(payload) {
  if (payload instanceof FormData) {
    const res = await fetch(`${BASE_URL}/resume-analyzer/analyze`, {
      method: 'POST',
      body: payload,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to analyze resume.');
    return data;
  }
  return request('POST', '/resume-analyzer/analyze', payload);
}

export async function apiGetSampleResumeAnalysis(role = 'Software Engineer') {
  return request('GET', `/resume-analyzer/sample?role=${encodeURIComponent(role)}`);
}

// ─── Health ───────────────────────────────────────────────────────────────────
export async function apiHealth() {
  const res = await fetch(`${BASE_URL}/health`, { credentials: 'include' });
  return res.json();
}

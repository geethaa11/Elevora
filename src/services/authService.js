const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      if (response.status === 422 && Array.isArray(errorData.detail)) {
        errorMsg = errorData.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
      } else {
        errorMsg = errorData.detail || errorData.message || errorMsg;
      }
    } catch (e) {
      // Ignore JSON parse error
    }
    
    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function loginApi(email, password) {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleResponse(response);
}

export async function signupApi(name, email, password, role = 'student') {
  const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  return handleResponse(response);
}

export async function getUserProfile(userId) {
  const response = await fetch(`${BASE_URL}/api/v1/users/${userId}`, {
    method: 'GET',
    headers: getHeaders()
  });
  return handleResponse(response);
}

export async function submitOnboarding(userId, profileData) {
  const response = await fetch(`${BASE_URL}/api/v1/users/${userId}/onboarding`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(profileData)
  });
  return handleResponse(response);
}

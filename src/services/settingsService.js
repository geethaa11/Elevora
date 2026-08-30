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
      errorMsg = errorData.detail || errorData.message || errorMsg;
    } catch (e) {
      // Ignore JSON parse error
    }
    throw new Error(errorMsg);
  }
  return response.json();
}

export async function getSettings() {
  const response = await fetch(`${BASE_URL}/api/v1/settings`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return handleResponse(response);
}

export async function updateSettings(settingsData) {
  const response = await fetch(`${BASE_URL}/api/v1/settings`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(settingsData),
  });
  return handleResponse(response);
}

export async function changePassword(currentPassword, newPassword) {
  const response = await fetch(`${BASE_URL}/api/v1/auth/change-password`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
  return handleResponse(response);
}

export async function deleteAccount() {
  const response = await fetch(`${BASE_URL}/api/v1/account`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(response);
}

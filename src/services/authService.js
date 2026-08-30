// src/services/authService.js

// Production backend for the deployed GitHub Pages application.
// VITE_API_BASE_URL can still override this during local development.
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://elevora-m1d3.onrender.com';

function getHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    // Response may not contain JSON.
  }

  if (!response.ok) {
    let errorMsg = `Request failed with status ${response.status}`;

    if (response.status === 422 && Array.isArray(data?.detail)) {
      errorMsg = data.detail
        .map(
          (err) =>
            `${err.loc?.join('.') || 'field'}: ${
              err.msg || 'Invalid value'
            }`
        )
        .join(', ');
    } else if (typeof data?.detail === 'string') {
      errorMsg = data.detail;
    } else if (typeof data?.message === 'string') {
      errorMsg = data.message;
    }

    const error = new Error(errorMsg);
    error.status = response.status;
    error.response = data;

    throw error;
  }

  return data;
}

/**
 * Login
 */
export async function loginApi(email, password) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    return await handleResponse(response);
  } catch (error) {
    // Fetch network/CORS/backend connection failure
    if (error instanceof TypeError) {
      const networkError = new Error(
        'Network error: Unable to connect to the Elevora backend.'
      );

      networkError.status = 0;
      throw networkError;
    }

    throw error;
  }
}

/**
 * Signup
 */
export async function signupApi(
  name,
  email,
  password,
  role = 'student'
) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/auth/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      }
    );

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      const networkError = new Error(
        'Network error: Unable to connect to the Elevora backend.'
      );

      networkError.status = 0;
      throw networkError;
    }

    throw error;
  }
}

/**
 * Get logged-in user's profile
 */
export async function getUserProfile(userId) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/users/${userId}`,
      {
        method: 'GET',
        headers: getHeaders()
      }
    );

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      const networkError = new Error(
        'Network error: Unable to connect to the Elevora backend.'
      );

      networkError.status = 0;
      throw networkError;
    }

    throw error;
  }
}

/**
 * Submit student onboarding data
 */
export async function submitOnboarding(userId, profileData) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/users/${userId}/onboarding`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(profileData)
      }
    );

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      const networkError = new Error(
        'Network error: Unable to connect to the Elevora backend.'
      );

      networkError.status = 0;
      throw networkError;
    }

    throw error;
  }
}

/**
 * Logout
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user');
}

/**
 * Get stored JWT token
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Check whether a JWT token exists
 */
export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}

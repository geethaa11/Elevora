const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
        errorMsg = errorData.detail
          .map(
            (err) =>
              `${err.loc?.join('.') || 'field'}: ${err.msg || 'Invalid value'}`
          )
          .join(', ');
      } else {
        errorMsg =
          errorData.detail ||
          errorData.message ||
          `Request failed with status ${response.status}`;
      }
    } catch (error) {
      errorMsg = `Request failed with status ${response.status}`;
    }

    const error = new Error(errorMsg);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function loginApi(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Network error: Unable to connect to the Elevora backend.'
      );
    }

    throw error;
  }
}

export async function signupApi(
  name,
  email,
  password,
  role = 'student'
) {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
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
    });

    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Network error: Unable to connect to the Elevora backend.'
      );
    }

    throw error;
  }
}

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
      throw new Error(
        'Network error: Unable to connect to the Elevora backend.'
      );
    }

    throw error;
  }
}

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
      throw new Error(
        'Network error: Unable to connect to the Elevora backend.'
      );
    }

    throw error;
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user');
}

export function getToken() {
  return localStorage.getItem('token');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('token'));
}

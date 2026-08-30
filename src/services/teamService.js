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
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message = data.detail || data.message || message;
    } catch {
      // Keep default message
    }

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export async function getTeamMatches(userId, limit = 10, offset = 0) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const response = await fetch(
    `${BASE_URL}/api/v1/team-matches/${userId}?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: getHeaders()
    }
  );

  return handleResponse(response);
}

export async function swipeAction(swipedId, action) {
  if (!swipedId) {
    throw new Error('Student ID is required');
  }

  if (action !== 'interested' && action !== 'pass') {
    throw new Error('Invalid swipe action');
  }

  const response = await fetch(
    `${BASE_URL}/api/v1/team-matches/${action}`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        swiped_id: swipedId,
        action
      })
    }
  );

  return handleResponse(response);
}

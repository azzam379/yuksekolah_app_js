const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function untuk handle API responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Network response was not ok');
  }
  return response.json();
}

// Auth API functions
export const authApi = {
  async registerSchool(data: {
    school_name: string;
    school_email: string;
    school_phone: string;
    school_address: string;
    admin_name: string;
    admin_email: string;
    admin_password: string;
  }) {
    const response = await fetch(`${API_URL}/register-school`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  async logout(token: string) {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  async getCurrentUser(token: string) {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

export default { authApi };
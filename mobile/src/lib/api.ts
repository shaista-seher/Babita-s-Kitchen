import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000';

export async function sendOTP(phone: string): Promise<{ success: boolean; otp?: string; message?: string }> {
  const response = await fetch(`${API_URL}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return response.json();
}

export async function verifyOTP(phone: string, otp: string): Promise<{ success: boolean; token?: string; message?: string }> {
  const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  return response.json();
}


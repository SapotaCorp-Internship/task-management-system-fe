const API_URL = import.meta.env.VITE_API_URL;

export function getGoogleLoginUrl() {
  return `${API_URL}/auth/google`;
}

export default function loginWithGgApi() {
  window.location.assign(getGoogleLoginUrl());
}

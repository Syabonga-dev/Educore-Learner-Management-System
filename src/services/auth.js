
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5036";

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data || "Login failed");
  
  return data;
}


export function setToken(token) {
  localStorage.setItem("educore_token", token);
}

export function getToken() {
  return localStorage.getItem("educore_token");
}

export function logout() {
  localStorage.removeItem("educore_token");
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload));

    
    const user = {
      id: json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
      email: json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      role: json["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
      exp: json.exp,
    };

    return user;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
}


export function isAuthenticated() {
  const u = getUserFromToken();
  if (!u) return false;
  if (u.exp) {
    const now = Math.floor(Date.now() / 1000);
    if (u.exp < now) {
      logout();
      return false;
    }
  }
  return true;
}

export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  console.log("FETCHING:", url, "Token:", token?.substring(0, 20) + "...");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    logout();
    window.location.href = "/login";
    return;
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export async function getStudentIdFromGuid(guid) {
  const data = await fetchWithAuth(`/api/Student/by-guid/${guid}`);
  return data.studentId;
}


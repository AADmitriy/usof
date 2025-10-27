const API_URL = "http://localhost:5000/api/auth";

export const login_request = (username, email, password) => fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ "login":username, email, password })
});

export const logout_request = () => fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
});

export const signup_request = (login, email, password, 
                               password_confirmation, full_name) => fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, email, password, password_confirmation, full_name })
})

export const confirm_email = (token) => fetch(`${API_URL}/confirm-email?token=${token}`, {
    method: "GET",
    credentials: "include"
})

export const resend_confirm_email = (email) => fetch(`${API_URL}/resend_confirm_email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email})
})
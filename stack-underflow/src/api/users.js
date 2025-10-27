const API_URL = "http://localhost:5000/api/users";

export const get_self = () => fetch(`${API_URL}/self`, {
    method: "GET",
    credentials: "include"
});

export const get_user_data = (user_id) => fetch(`${API_URL}/user_preview_data/${user_id}`, {
    method: "GET",
    credentials: "include"
});

export const update_profile = (user_id, full_name, login, email) => fetch(`${API_URL}/${user_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ full_name, login, email })
});

export const delete_profile = (user_id) => fetch(`${API_URL}/${user_id}`, {
    method: "DELETE",
    credentials: "include"
});

export const set_avatar = (form_data) => fetch(`${API_URL}/avatar`, {
    method: "PATCH",
    credentials: "include",
    body: form_data
})
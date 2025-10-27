const API_URL = "http://localhost:5000/api/categories";

export const get_categories = () => fetch(`${API_URL}`, {
    method: "GET",
    credentials: "include"
});

export const create_category = (title, description) => fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({title, description})
});

export const edit_category = (id, title, description) => {
    const request = {}
    if (title) {
        request.title = title
    }
    if (description) {
        request.description = description
    }

    return fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(request)
    })
}

export const delete_category = (id) => fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include"
});
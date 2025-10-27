const API_URL = "http://localhost:5000/api/posts";

export const get_all_posts = (post_filters) => {
    const post_filter_options = []
    
    for (const [key, value] of Object.entries(post_filters)) {
        if (key === 'categories' && value !== null) {
            for (const category_id of value) {
                post_filter_options.push(`${key}=${category_id}`)
            }
        }
        else if (value !== null) {
            post_filter_options.push(`${key}=${value}`)
        }
    }

    return fetch(
        `${API_URL}?${post_filter_options.join("&")}`, 
    {
        method: "GET",
        credentials: "include"
    }
    )
};

export const get_post_data = (post_id) => fetch(`${API_URL}/${post_id}`, {
    method: "GET",
    credentials: "include"
});

export const create_post = (title, content, categories) => fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, content, categories })
})

export const update_post = (id, title, content, categories) => fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, content, categories })
})

export const update_post_status = (id, status) => fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status })
})

export const delete_post = (post_id) => fetch(`${API_URL}/${post_id}`, {
    method: "DELETE",
    credentials: "include"
});

export const get_post_comments = (post_id) => fetch(`${API_URL}/${post_id}/comments`, {
    method: "GET",
    credentials: "include"
})

export const get_post_likes = (post_id) => fetch(`${API_URL}/${post_id}/like`, {
    method: "GET",
    credentials: "include"
})

export const create_post_like = (post_id) => fetch(`${API_URL}/${post_id}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ "type": "like" })
})

export const create_post_dislike = (post_id) => fetch(`${API_URL}/${post_id}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ "type": "dislike" })
})

export const delete_post_like = (post_id) => fetch(`${API_URL}/${post_id}/like`, {
    method: "DELETE",
    credentials: "include"
})
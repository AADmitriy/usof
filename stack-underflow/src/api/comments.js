const API_URL = "http://localhost:5000/api/comments";

export const create_comment = (id, commentContent) => fetch(`${API_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({"post_id": id, "content": commentContent})
});

export const get_comment_likes = (comment_id) => fetch(`${API_URL}/${comment_id}/like`, {
    method: "GET",
    credentials: "include"
})

export const create_comment_like = (comment_id) => fetch(`${API_URL}/${comment_id}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ "type": "like" })
})

export const update_comment = (comment_id, content) => fetch(`${API_URL}/${comment_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content })
})

export const update_comment_status = (comment_id, status) => fetch(`${API_URL}/${comment_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status })
})

export const delete_comment = (comment_id) => fetch(`${API_URL}/${comment_id}`, {
    method: "DELETE",
    credentials: "include"
});

export const create_comment_dislike = (comment_id) => fetch(`${API_URL}/${comment_id}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ "type": "dislike" })
})

export const delete_comment_like = (comment_id) => fetch(`${API_URL}/${comment_id}/like`, {
    method: "DELETE",
    credentials: "include"
})
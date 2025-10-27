import styles from "../styles/CommentForm.module.css"
import { useState } from "react";
import { create_comment } from "../api/comments";


export default function CommentForm({post_id, setRefreshComments}) {
    const [commentContent, setCommentContent] = useState("");

    const handleCreateComment = async (e) => {
        e.preventDefault()

        await create_comment(post_id, commentContent)
        setRefreshComments(prev => !prev)
        setCommentContent("")
    }

    return (
        <div className={styles.comment_creation_wrapper}>
            <p className={styles.comment_form_title}>Your Answer</p>
            <form onSubmit={handleCreateComment}>
                <textarea required placeholder="Type your comment here..." 
                        value={commentContent} 
                        onChange={e => setCommentContent(e.target.value)}>
                </textarea>
                <button type="submit">Create Comment</button>
            </form>
        </div>
    )
}
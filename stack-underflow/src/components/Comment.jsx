import { useState } from "react";
import { useSelector } from "react-redux"
import {
    get_comment_likes, create_comment_like,
    create_comment_dislike, delete_comment_like,
    update_comment, delete_comment, update_comment_status
} from "../api/comments";
import LikeDislikeButtons from "../components/LikeDislikeButtons"
import DeletePopup from "./DeletePopup";
import EditDeleteMenu from "./EditDeleteMenu";
import UserPreview from "./UserPreview";
import styles from "../styles/Comment.module.css"

function useCommentEditForm(comment_id, default_content, setIsEdit, setRefreshComments) {
    const [content, setContent] = useState(default_content)

    const handleUpdateComment = async (e) => {
        e.preventDefault()

        const response = await update_comment(comment_id, content)
        const data = await response.json();
        console.log(data)
        setIsEdit(false)
        setRefreshComments(prev => !prev)
    }
    return (
        <div className={styles.comment_edit_form}>
            <textarea required placeholder="Type your comment here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}>
            </textarea>
            <div className={styles.comment_edit_form_buttons}>
                <button className="default_button" onClick={() => setIsEdit(false)}>Cancel</button>
                <button className="default_button" onClick={handleUpdateComment}>Update Comment</button>
            </div>
        </div>
    )
}

function useDeleteForm(comment_id, setIsDelete, setRefreshComments) {
    const handleDeleteComment = async (e) => {
        e.preventDefault()

        const response = await delete_comment(comment_id)

        const data = await response.json();
        console.log(data)
        setIsDelete(false)
        setRefreshComments(prev => !prev)
    }

    return (
        <DeletePopup
          handleDelete={handleDeleteComment}
          setIsDelete={setIsDelete}
          popup_question={"Are you sure you want to delete this comment?"}
        />
    )
}


export default function Comment({comment_data, setRefreshComments}) {
    const user = useSelector((state) => state.user.value);
    const is_own_comment = (user && user.id === comment_data.author_id)

    const [isEdit, setIsEdit] = useState(false)

    const comment_edit_form = useCommentEditForm(
        comment_data.id,
        comment_data.content,
        setIsEdit,
        setRefreshComments
    )

    const [isDelete, setIsDelete]  = useState(false)
    const delete_form = useDeleteForm(
        comment_data.id,
        setIsDelete,
        setRefreshComments
    )

    const [banButtonText, setBanButtonText] = useState(
        comment_data['status'] === "active" ? 'Ban comment' : 'Unban comment'
    )

    
    if (is_own_comment && isEdit) {
        return (
            <div className={styles.comment}>
                {isDelete ? delete_form : ""}
                {comment_edit_form} 
            </div>
        )
    }

    const handleBanButtonClick = async () => {
        let new_status = null

        if (comment_data['status'] === 'unactive') {
            new_status = "active"
        }
        else {
            new_status = "unactive"
        }

        const response = await update_comment_status(comment_data['id'], new_status)
        const data = await response.json()
        console.log(data )

        if (data.success) {
            setRefreshComments(prev => !prev)
            comment_data['status'] = new_status
            if (new_status === 'active') {
                setBanButtonText('Ban post')
            }
            else {
                setBanButtonText('Unban post')
            }
        }
    }

    const like_functions = {
        "get_likes": get_comment_likes,
        "create_like": create_comment_like,
        "create_dislike": create_comment_dislike,
        "delete_like": delete_comment_like
    }
    
    return (
        <div className={styles.comment}>
            {is_own_comment && isDelete ? delete_form : ""}
            <div className={styles.comment_buttons}>
                <LikeDislikeButtons
                    id={comment_data.id}
                    block_data={comment_data}
                    like_functions={like_functions}
                />
                {is_own_comment ?
                <EditDeleteMenu
                  setIsEdit={setIsEdit}
                  setIsDelete={setIsDelete}
                /> : ""}
            </div>
            <div className={styles.comment_text_info_wrapper}>
                {user && user.role === "admin" ? 
                <button onClick={handleBanButtonClick} className="ban_button">{banButtonText}</button> 
                : ""}
                <div className={styles.comment_text_info}>
                    
                    <p>{ comment_data.content }</p>
                    <div className={styles.comment_user_preview_wrapper}>
                        <UserPreview id={comment_data.author_id}/>
                    </div>
                </div>
            </div>
        </div>
    )

}
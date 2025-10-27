import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { 
    get_post_data, get_post_comments, get_post_likes, 
    create_post_like, create_post_dislike, delete_post_like,
    delete_post, update_post_status
} from "../api/posts";
import { make_datetime_readable } from "../utils/datetime_utils"

import LikeDislikeButtons from "../components/LikeDislikeButtons"
import PostUpdateForm from "../components/PostUpdateForm"
import EditDeleteMenu from "../components/EditDeleteMenu";
import DeletePopup from "../components/DeletePopup";
import Comment from "../components/Comment"
import CommentForm from "../components/CommentForm"
import UserPreview from "../components/UserPreview";

import styles from "../styles/PostPage.module.css"



function usePost(id) {
    const [post_data, setPostData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        get_post_data(id)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((json) => {
            setPostData(json.post_data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            setError(error);
            setLoading(false);
        });
    }, [id]);

    let post_content = null
    let post_title = null

    if (loading) {
        post_title = <p>loading...</p>
    }
    else if (error) {
        post_title = <p>Error loading data 😢</p>
    }
    else {
        post_title = (
            <div>
                <h2>{post_data.title}</h2>
                <p> Published at: {make_datetime_readable(post_data.published_at)}</p>
            </div>
        )
        post_content = (
        <div className={styles.post_text_content}>
            <p>{post_data.content}</p>
            <ul>
                {post_data.categories.map(category => (
                    <li key={category.id}>{category.title}</li>
                ))}
            </ul>
            <div className={styles.post_author_preview_wrapper}>
                <UserPreview id={post_data.author_id}/>
            </div>
            {/* {JSON.stringify(post_data)} */}
        </div>
        )
    }

    return {post_title, post_content, post_data}
}


function useComments(id, post_data, refreshComments, setRefreshComments) {
    const [comments, setPostComments] = useState([])
    const [comments_loading, setCommentsLoading] = useState(true);
    const [comments_error, setCommentsError] = useState(null);
    
    useEffect(() => {
        if (post_data.length === 0) {
            return
        }
        get_post_comments(id)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((json) => {
            setPostComments(json.data);
            setCommentsLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            setCommentsError(error);
            setCommentsLoading(false);
        });
    }, [id, post_data, refreshComments]);

    let comments_list = null

    if (comments_loading) { 
        comments_list = <p>loading comments...</p>
    }
    else if (comments_error) {
        comments_list = <p>Error loading comments 😢</p>
    }
    else {
        comments_list = (
            <div className="comments">
                <p className={styles.comments_list_title}>{comments.length} Answers</p>
                {comments.map(comment => (
                    <Comment
                      comment_data={comment}
                      setRefreshComments={setRefreshComments}
                    />
                ))}
            </div>
        )
    }

    return { comments_list }
}


function usePostEditForm(post_id, title, content, categories, setIsEdit) {
    if (!categories) {
        categories = []
    }
    const categories_id = categories.map(item => item.id)
    return (
        <div className={styles.post_edit_form}>
            <button className="default_button" onClick={() => setIsEdit(false)}>Cancel</button>
            <PostUpdateForm
              post_id={post_id}
              default_title={title}
              default_content={content}
              default_categories={categories_id}
            />
        </div>
    )
}

function usePostDeleteForm(post_id, setIsDelete) {
    const navigate = useNavigate()

    const handleDeletePost = async (e) => {
        e.preventDefault()

        const response = await delete_post(post_id)

        const data = await response.json();
        console.log(data)
        navigate('/')
    }

    return (
        <DeletePopup
          handleDelete={handleDeletePost}
          setIsDelete={setIsDelete}
          popup_question={"Are you sure you want to delete this post?"}
        />
    )
}


function PostPage() {
    const { id } = useParams();

    const { post_title, post_content, post_data } = usePost(id)

    const [isEdit, setIsEdit] = useState(false)
    const post_edit_form = usePostEditForm(
        id,
        post_data.title,
        post_data.content,
        post_data.categories,
        setIsEdit
    )
    
    const [isDelete, setIsDelete] = useState(false)
    const delete_form = usePostDeleteForm(id, setIsDelete)


    const like_functions = {
        "get_likes": get_post_likes,
        "create_like": create_post_like,
        "create_dislike": create_post_dislike,
        "delete_like": delete_post_like
    }
    
    const [refreshComments, setRefreshComments] = useState(false)
    const {comments_list} = useComments(id, post_data, refreshComments, setRefreshComments)

    const user = useSelector((state) => state.user.value);
    const is_own_post = (user && user.id === post_data.author_id)
    const [banButtonText, setBanButtonText] = useState(
        post_data['status'] === "active" ? 'Ban post' : 'Unban post'
    )

    useEffect(() => {
        setBanButtonText(post_data['status'] === "active" ? 'Ban post' : 'Unban post')
    }, [post_data])

    if (!post_content) {
        return ( <div>{post_title}</div> )
    }

    const handleBanButtonClick = async () => {
        let new_status = null

        if (post_data['status'] === 'unactive') {
            new_status = "active"
        }
        else {
            new_status = "unactive"
        }

        const response = await update_post_status(post_data['id'], new_status)
        const data = await response.json()
        console.log(data )

        if (data.success) {
            post_data['status'] = new_status
            if (new_status === 'active') {
                setBanButtonText('Ban post')
            }
            else {
                setBanButtonText('Unban post')
            }
        }
    }

    const post_layout = (
        <div>
        {post_title}
        {user && user.role === "admin" ? 
        <button onClick={handleBanButtonClick} className="ban_button">{banButtonText}</button> 
        : ""}
        <div className={styles.post_layout}>
            <div className={styles.post_buttons}>
                <LikeDislikeButtons
                id={id}
                block_data={post_data}
                like_functions={like_functions}
                />
                {is_own_post ?
                <EditDeleteMenu
                  setIsEdit={setIsEdit}
                  setIsDelete={setIsDelete}
                /> : ""}
            </div>
            {post_content}
        </div>
        </div>
    )

    return (
        <div className={styles.Post}>
            {is_own_post && isDelete ? delete_form : ""}
            {is_own_post && isEdit ?
             post_edit_form :
             post_layout
            }
            {comments_list}
            {user ? 
            <CommentForm
              post_id={id}
              setRefreshComments={setRefreshComments}
            /> 
            : ""}
        </div>
    )
}

export default PostPage;
import { useEffect, useState } from "react";
import styles from "../styles/LikeDislikeButtons.module.css"
import { useNavigate } from 'react-router-dom';

export default function useLikes({id, block_data, like_functions}) {
    const [likes, setLikes] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshLikes, setRefreshLikes] = useState(false)
    const [activeReaction, setActiveReaction] = useState(null);
    
    const {get_likes, create_like, create_dislike, delete_like} = like_functions

    const navigate = useNavigate()


    useEffect(() => {
        if (block_data.length === 0) {
            return
        }
        get_likes(id)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login')
                }
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((json) => {
            setLikes(json.data);
            if (json.data.has_user_like) {
                setActiveReaction("like")
            }
            else if (json.data.has_user_dislike) {
                setActiveReaction("dislike")
            }
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            setError(error);
            setLoading(false);
        });
    }, [id, block_data, refreshLikes, get_likes, navigate]);

    const handleReaction = async (type) => {
        if (type !== "like" && type !== "dislike") {
            return
        }

        if (type === activeReaction) {
            await delete_like(id)
            setActiveReaction(null)
        }
        else {
            if (type === "like") {
                await create_like(id)
            }
            else {
                await create_dislike(id)
            }
        }

        setRefreshLikes(prev => !prev)
    }

    if (loading) { 
        return <p>loading likes...</p>
    }
    else if (error) {
        return <p>Error loading likes 😢</p>
    }
    else {
        return (
            <div className={styles.voting_container}>
                <button onClick={() => handleReaction("like")} 
                        className={likes.has_user_like ? styles.active_reaction : ""}>
                    <svg aria-hidden="true" 
                         width="18" height="18" viewBox="0 0 18 18">
                        <path d="M1 12h16L9 4z"></path>
                    </svg>
                </button>
                <h3>{likes.likes - likes.dislikes}</h3>
                <button onClick={() => handleReaction("dislike")} 
                        className={likes.has_user_dislike ? styles.active_reaction : ""}>
                    <svg aria-hidden="true"
                         width="18" height="18" viewBox="0 0 18 18">
                        <path d="M1 6h16l-8 8z"></path>
                    </svg>
                </button>
                
            </div>
        )
    }
}
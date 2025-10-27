import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { create_post } from "../api/posts"
import styles from '../styles/PostForm.module.css'
import CategoriesInput from "./CategoriesInput"



export default function PostCreationForm({
        default_title="", 
        default_content="",
        default_categories=[]}) {
    const navigate = useNavigate()
    const [title, setTitle] = useState(default_title);
    const [content, setContent] = useState(default_content);
    const [selectedCategories, setSelectedCategories] = useState(default_categories);


    const handlePostCreate = async (e) => {
        e.preventDefault()

        const response = await create_post(title, content, selectedCategories)

        const data = await response.json();
        console.log(data)
        navigate(`/posts/${data.post.id}`)
    }

    return (
        <form className={styles.post_creation_form} onSubmit={handlePostCreate}>
            <h3>Title:</h3>
            <input value={title} onChange={e => setTitle(e.target.value)} required/>
            <h3>Content:</h3>
            <textarea required placeholder="Type your question here..."
                      value={content}
                      onChange={e => setContent(e.target.value)}>
            </textarea>
            <h3>Categories:</h3>
            <CategoriesInput
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
            <button className="default_button" type="submit">Submit</button>
        </form>
    )
}
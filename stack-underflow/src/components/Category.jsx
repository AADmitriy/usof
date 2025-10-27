import styles from "../styles/Category.module.css"
import { useState } from "react"
import { edit_category, delete_category } from "../api/categories"
import DeletePopup from "../components/DeletePopup"

export default function Category({category_data, setRefreshCategories}) {
    const [isEdit, setIsEdit] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    const [title, setTitle] = useState(category_data.title)
    const [description, setDescription] = useState(category_data.title)

    const handleCategoryEdit = async (e) => {
        e.preventDefault()

        const response = await edit_category(category_data['id'], title, description)
        const data = await response.json()
        console.log(data)

        setIsEdit(false)
        setRefreshCategories(prev => !prev)
    }

    const handleCategoryDelete = async (e) => {
        e.preventDefault()

        const response = await delete_category(category_data['id'])
        const data = await response.json()
        console.log(data)

        setIsDelete(false)
        setRefreshCategories(prev => !prev)
    }

    return (
        <div className={styles.category_wrapper}>
            {isDelete ?
            <DeletePopup
              setIsDelete={setIsDelete}
              handleDelete={handleCategoryDelete}
              popup_question={"Are you sure you want to delete this category?"}
            /> :
            ""}
            {isEdit ?
            <form onSubmit={handleCategoryEdit} className={styles.category_edit_form}>
                <input required value={title} onChange={(e) => setTitle(e.target.value)}/>
                <textarea required value={description} 
                          onChange={(e) => setDescription(e.target.value)}></textarea>
                <div className={styles.category_buttons}>
                    <button className="default_button" onClick={() => setIsEdit(false)}>
                        Cancel
                    </button>
                    <button className="default_button" type="submit">
                        Submit
                    </button>
                </div>
            </form>
            :
            <div>
                <p>{category_data.title}</p>
                <p>{category_data.description}</p>
                <div className={styles.category_buttons}>
                    <button className="default_button" onClick={() => setIsEdit(true)}>
                        Edit
                    </button>
                    <button className="default_button" onClick={() => setIsDelete(true)}>
                        Delete
                    </button>
                </div>
            </div>}
        </div>
    )
}
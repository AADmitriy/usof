import { get_categories, create_category } from "../api/categories";
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import Category from "../components/Category";
import styles from "../styles/AdminPanelPage.module.css"

export default function AdminPanelPage() {
    const user = useSelector((state) => state.user.value);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshCategories, setRefreshCategories] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        get_categories()
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((json) => {
            setData(json);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            setError(error);
            setLoading(false);
        });
    }, [refreshCategories]);

    if (!user || user.role !== "admin") {
        return <div>Admins only</div>
    }

    if (loading) return ( 
        <p>Loading...</p>
    );
    if (error) return ( 
        <p>Error loading categories 😢</p>
    );

    const handleCreateCategory = async (e) => {
        e.preventDefault()


        const response = await create_category(title, description)
        const data = await response.json()
        console.log(data)

        setRefreshCategories(prev => !prev)
        setTitle("")
        setDescription("")
    }

    return (
        <div>
            <div className={styles.categories_list}>
                {data.map((category) => (
                    <Category 
                    category_data={category}
                    setRefreshCategories={setRefreshCategories}/>
                ))}
            </div>
            <form onSubmit={handleCreateCategory} className={styles.category_creation_form}>
                <input required placeholder="Category Title..." value={title}
                       onChange={(e) => setTitle(e.target.value)}/>
                <textarea required placeholder="Category Description..." 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)}></textarea>
                <button className="default_button" type="submit">
                    Submit
                </button>
            </form>
        </div>
    )
}
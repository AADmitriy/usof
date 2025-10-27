import styles from "../styles/CategoriesInput.module.css"

import { useEffect, useState } from "react";
import { get_categories } from "../api/categories"


export default function CategoriesInput({selectedCategories, setSelectedCategories}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const categories_ids_to_titles_str = (categories_ids) => {
        const categories = categories_ids.map((category_id) => {
            return data.find(obj => obj.id === +category_id)
        })
        return categories.map(category => category.title).join(", ")
    }

    const handleCheckboxChange = (category) => {
        if (selectedCategories.includes(category)) {
          setSelectedCategories(selectedCategories.filter((c) => c !== category));
        }
        else {
          setSelectedCategories([...selectedCategories, category]);
        }
    };


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
    }, []);

    if (loading) return ( 
        <p>Loading...</p>
    );
    if (error) return ( 
        <p>Error loading categories 😢</p>
    );

    return (
        <div>
            <p>Choose categories:</p>
            
            <div className={styles.categories_container}>
                {data.map((category) => (
                    <label key={category.id} style={{ display: "block" }}>
                    {category.title}
                    <input
                        type="checkbox"
                        value={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCheckboxChange(category.id)}
                    />
                    </label>
                ))}
            </div>

            <p>Selected: {categories_ids_to_titles_str(selectedCategories)}</p>
        </div>
    )
}
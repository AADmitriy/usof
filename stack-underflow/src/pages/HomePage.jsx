import { useEffect, useState } from "react";
import styles from '../styles/HomePage.module.css'
import { get_all_posts } from '../api/posts';
import PostPreview from '../components/PostPreview'
import { make_date_sql_compatible, isValidDateString, isValidDateRange } from '../utils/datetime_utils'
import CategoriesInput from "../components/CategoriesInput";


function HomePage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [postsSortBy, setPostsSortBy] = useState("likes")
    const [postsStartDate, setPostsStartDate] = useState("")
    const [postsEndDate, setPostsEndDate] = useState("")
    const [postsStatus, setPostsStatus] = useState(null)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [questionsLabel, setQuestionsLabel] = useState("Highest scored")
    const [descSort, setDescSort] = useState(true)

    const display_status = () => {
        if (postsStatus !== null) {
            return postsStatus
        }
        else {
            return "all"
        }
    }

    const handleSortOrderChange = (order_by, desc, label) => {
        if (order_by !== postsSortBy) {
            setPostsSortBy(order_by)
        }
        if (desc !== descSort) {
            setDescSort(desc)
        }
        setQuestionsLabel(label)
    }

    const handleStatusChange = () => {
        if (postsStatus === null) {
            setPostsStatus("active")
        }
        else if (postsStatus === "active") {
            setPostsStatus("unactive")
        }
        else {
            setPostsStatus(null)
        }
    }

    const handleDateChange = (setter, date_str, type) => {
        if (isValidDateString(date_str)) {
            if ((type === "start" && isValidDateRange(date_str, postsEndDate)) ||
                (type === "end" && isValidDateRange(postsStartDate, date_str))) {
                setter(make_date_sql_compatible(date_str))
            }
        }
        else {
            setter("")
        }
    }


    const post_filters_component = (
        <div className={styles.post_filters}>
            <div className={styles.sort_options}>
                <button id={postsSortBy === "likes" && descSort === true ? 
                                   styles.active_sort_order : ""}
                        onClick={() => handleSortOrderChange("likes", true, "Highest scored")}>
                    Highest score
                </button>
                <button id={postsSortBy === "likes" && descSort === false ? 
                                   styles.active_sort_order : ""}
                        onClick={() => handleSortOrderChange("likes", false, "Lowest scored")}>
                    Lowest score
                </button>
                <button id={postsSortBy === "date" && descSort === true ? 
                                   styles.active_sort_order : ""}
                        onClick={() => handleSortOrderChange("date", true, "New")}>Newest</button>
                <button id={postsSortBy === "date" && descSort === false ? 
                                   styles.active_sort_order : ""}
                        onClick={() => handleSortOrderChange("date", false, "Old")}>Oldest</button>
            </div>
            <div className={styles.date_range_filter}>
                <label htmlFor="start-date">Start Date:</label>
                <input type="date" id="start-date" name="start-date"
                       value={postsStartDate}
                       onChange={(e) => handleDateChange(setPostsStartDate, e.target.value, "start")}/>

                <label htmlFor="end-date">End Date:</label>
                <input type="date" id="end-date" name="end-date"
                       value={postsEndDate}
                       onChange={(e) => handleDateChange(setPostsEndDate, e.target.value, "end")}/>
            </div>
            <div className={styles.status_filter}>
                Status:
                <button onClick={handleStatusChange}>{display_status()}</button>
            </div>
            <div>
                <CategoriesInput
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
            </div>
        </div>
    )

    useEffect(() => {
        const post_filters = {
            "sort_by": postsSortBy,
            "status": postsStatus,
            "start_date": postsStartDate || null,
            "end_date": postsEndDate || null,
            "categories": selectedCategories
        }

        get_all_posts(post_filters)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((json) => {
            setData(json);
            setLoading(false);
            setError(null);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            setError(error);
            setLoading(false);
        });
    }, [postsSortBy, postsStatus, postsStartDate, postsEndDate, selectedCategories]);

    const header_and_filters = (
        <div>
        <header className={styles["Questions-header"]}>
            <p>{questionsLabel} Questions</p>
            <button onClick={() => window.location.href = "/create_post" }>Ask Question</button>
        </header>
        {post_filters_component}
        </div>
    )

    if (loading) return ( 
        <div className={styles.Questions}>
            {header_and_filters}
            <p>Loading...</p>
        </div>
    );
    if (error) return ( 
        <div className={styles.Questions}>
            {header_and_filters}
            <p>No data was found 😢</p>
        </div>
    );

    return (
        <div className={styles.Questions}>
            {header_and_filters}
            <div className={styles.QuestionsList}>
                {descSort ?
                data.map((item) => (
                    <PostPreview
                      post_data={item}
                    />
                )) :
                data.toReversed().map((item) => (
                    <PostPreview
                      post_data={item}
                    />
                )) }
            </div>
        </div>
    )
}

export default HomePage;
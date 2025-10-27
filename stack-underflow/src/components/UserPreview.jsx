import styles from '../styles/UserPreview.module.css'
import { get_user_data } from "../api/users"
import { useEffect, useState } from "react";

export default function UserPreview({id}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        get_user_data(id)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((json) => {
            setData(json.user_data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            setLoading(true)
        });
    }, [id]); 

    if (loading) {
        return <div></div>
    }

    const username = data.full_name || data.login
    const backend_url = "http://localhost:5000"
    

    return (
      <div className={styles.user_info}>
          {data.profile_picture ?
          <div className={styles.user_preview_avatar}>
              <img alt="" src={backend_url + data.profile_picture}/>
          </div> :
          <div className={styles.user_preview_avatar_placeholder}>{username[0]}</div> }
          <p className={styles.user_preview_name}>{username}</p>
          <p className={styles.user_preview_rating}>{data.rating}</p>
      </div>
    );
}
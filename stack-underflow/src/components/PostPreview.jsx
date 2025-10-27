import styles from '../styles/PostPreview.module.css'
import { Link } from 'react-router-dom';
import { get_difference_between_now_and_date } from '../utils/datetime_utils'
import UserPreview from "../components/UserPreview";

export default function PostPreview({post_data}) {
    return (
      <div key={post_data.id} className={styles.post}>
        <div className={styles.post_preview_numbers}>
            <p>{post_data.rating ? post_data.rating : 0} votes</p>
            <p>
              <span className={post_data.status === "active" ? styles.post_active : styles.post_unactive}>
                {post_data.status}
              </span> status
            </p>
        </div>
        <div className={styles.post_preview_text_info}>
            <Link className={styles.link_to_post} to={`/posts/${post_data.id}`}>{post_data.title}</Link>
            <p className={styles.post_preview_content}>{post_data.content}</p>
            <UserPreview id={post_data.author_id}/>
            <p>Asked: {get_difference_between_now_and_date(post_data.published_at)}</p>
        </div>
      </div>
    );
}
  
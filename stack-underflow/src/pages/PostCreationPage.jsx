import styles from '../styles/PostCreationPage.module.css'
import PostCreationForm from "../components/PostCreationForm";


export default function PostCreationPage() {

    return (
        <div className={styles.post_creation_form_wrapper}>
            <PostCreationForm/>
        </div>
    )
}
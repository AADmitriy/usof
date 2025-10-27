import styles from "../styles/DeletePopup.module.css"

export default function DeletePopup({handleDelete, setIsDelete, popup_question}) {
    return (
        <div className={styles.delete_popup}>
            <div className={styles.delete_popup_overlay}></div>
            <div className={styles.delete_popup_content}>
                <p>{popup_question}</p>
                <div className={styles.delete_popup_buttons}>
                    <button onClick={() => setIsDelete(false)}>Cancel</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}
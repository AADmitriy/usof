import styles from "../styles/EditDeleteMenu.module.css"
import { ReactComponent as TreeDotsVert} from "../svgs/TreeDotsVert.svg"

export default function EditDeleteMenu({setIsEdit, setIsDelete}) {
    return (
        <div className={styles.options_wrapper}>
            <button className={styles.options}>
                <TreeDotsVert/>
            </button>
            <div className={styles.options_menu}>
                <button onClick={() => setIsEdit(true)}>Edit</button>
                <button onClick={() => setIsDelete(true)}>Delete</button>
            </div>
        </div>
    )
}
import { logout_request } from '../api/auth'
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { logout } from "../slices/userSlice";
import styles from "../styles/LogoutPage.module.css"
import { ReactComponent as DoorOpen } from "../svgs/DoorOpen.svg";

function LogoutPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleLogout = async (e) => {
        e.preventDefault();

        const response = await logout_request()

        const data = await response.json();
        console.log(data);
        dispatch(logout())
        navigate('/login')
    };

    const handleReturnToPrevPage = async (e) => {
        window.history.back();
    }

    return (
        <div className={styles.logout_form_wrapper}>
            <div className={styles.logout_form}>
                <div className={styles.exit_icon}>
                    <DoorOpen/>
                </div>
                <p>Are you sure you want to logout? You would need to reenter username and password</p>
                <button onClick={handleReturnToPrevPage}>Return to previous page</button>
                <button onClick={handleLogout} 
                        className={styles.logout_form_button}>
                    Log Out
                </button>
            </div>
        </div>
    );
}
  
export default LogoutPage;
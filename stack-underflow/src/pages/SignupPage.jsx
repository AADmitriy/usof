import { signup_request } from '../api/auth'
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setEmail as setStoreEmail } from "../slices/emailSlice"
import styles from "../styles/SignupPage.module.css"

function SignupPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const [errorMsg, setErrorMsg] = useState("")

    const handleSignup = async (e) => {
        e.preventDefault();

        const response = await signup_request(username, email, password, password_confirmation, null)

        const data = await response.json();
        console.log(data); // for example: token, user info
        if (data.success) {
            dispatch(setStoreEmail(email))
            navigate('/confirm_email')
        }
        else {
            setErrorMsg(data.message)
        }
        
    };

    return (
        <div className={styles.signup_form_wrapper}>
            <form className={styles.signup_form} onSubmit={handleSignup}>
                <h4>Username:</h4>
                <input value={username} onChange={e => setUsername(e.target.value)} />
                <h4>Email:</h4>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <h4>Password:</h4>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                <h4>Confirm password:</h4>
                <input type="password" value={password_confirmation} onChange={e => setPasswordConfirmation(e.target.value)} />
                {errorMsg !== "" ? <p className="form_error">{errorMsg}</p> : ""}
                <button className={styles.signup_form_button} type="submit">Sign Up</button>
            </form>
        </div>
    );
}
  
export default SignupPage;
import { login_request } from '../api/auth'
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { login } from "../slices/userSlice";
import styles from "../styles/LoginPage.module.css"

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [email] = useState("placeholder@email.com");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await login_request(username, email, password)

        const data = await response.json();
        console.log(data); // for example: token, user info
        if (data.success) {
            dispatch(login({id: data.user_data.id, name: data.user_data.username, role: data.user_data.role}))
            navigate('/self')
        }
        else {
            setErrorMsg(data.message || "Something went wrong")
        }
    };

    return (
        <div className={styles.login_form_wrapper}>
            <form className={styles.login_form} onSubmit={handleLogin}>
                <h4>Username:</h4>
                <input value={username} onChange={e => setUsername(e.target.value)} />
                {/* <h4>Email:</h4>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} /> */}
                <h4>Password:</h4>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                {errorMsg !== "" ? <p className="form_error">{errorMsg}</p> : ""}
                <button className={styles.login_form_button} type="submit">Login</button>
            </form>
        </div>
    );
}
  
export default LoginPage;
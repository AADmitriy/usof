import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ReactComponent as GoodEmail } from "../svgs/GoodEmail.svg"
import { ReactComponent as BadEmail } from "../svgs/BadEmail.svg"
import { ReactComponent as OutgoingMail } from "../svgs/OutgoingMail.svg"
import styles from "../styles/ConfirmEmailPage.module.css"
import { confirm_email, resend_confirm_email } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { login } from "../slices/userSlice";
import { cleanEmail } from "../slices/emailSlice"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"; 

export default function ConfirmEmailPage() {
    let [searchParams] = useSearchParams();
    const token = searchParams.get('token')
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [errorMsg, setErrorMsg] = useState("")
    const email = useSelector((state) => state.email.value);

    useEffect(() => {
        if (!token) {
            return
        }
        async function confirmEmail() {
            const response = await confirm_email(token)

            const data = await response.json()
            console.log(data)

            if (data.success) {
                dispatch(cleanEmail())
                dispatch(login({
                    id: data.user_data.id,
                    name: data.user_data.username,
                    role: data.user_data.role
                }))
                navigate('/self')
            }
            else {
                setErrorMsg(`Something went wrong. Error message: ${data.message}`)
            }
        }

        confirmEmail()
    }, [dispatch, navigate, token])

    const handleResendLink = async () => {
        
        const response = await resend_confirm_email(email)

        const data = await response.json()
        console.log(data)
    }

    if (!token) {
        return (
            <div className="whitesmoke_content_wrapper">
                <div className="default_form">
                    <div className={styles.email_icon}>
                        <OutgoingMail/>
                    </div>
                    <p className={styles.email_confirmation_info}>
                        Follow the link we send to you to confirm your email
                    </p>
                    <button className={styles.resend_email} 
                            onClick={handleResendLink}>Resend link</button>
                </div>
            </div>
        )
    }

    return (
        <div className="whitesmoke_content_wrapper">
            <div className="default_form">
                <div className={styles.email_icon}>
                    {errorMsg === "" ?
                    <GoodEmail/> :
                    <BadEmail/>}
                </div>
                <p className={styles.email_confirmation_info}>
                    {errorMsg === "" ?
                    "Verifying your email..." :
                    <span>{errorMsg}</span>}
                </p>
            </div>
        </div>
    )
}
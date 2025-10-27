import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { get_self } from "../api/users"
import { logout } from "../slices/userSlice"
import { persistor } from '../store';
import styles from "../styles/UserPage.module.css"
import { update_profile, set_avatar } from "../api/users";
import { ReactComponent as Photocamera} from "../svgs/Photocamera.svg"

function useAvatarInput(user_data, avatarSrc, setAvatarSrc, backend_url) {
    if (Object.keys(user_data).length === 0) {
        return <div></div>
    }
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData();

        if (file) {
            formData.append('file', file);
        }
        else {
            formData.append('file', null)
        }

        const response = await set_avatar(formData)
        const data = await response.json();
        console.log(data);
        user_data.profile_picture = data.avatarUrl
        setAvatarSrc(data.avatarUrl || "#")
    }

    const username = user_data.full_name || user_data.login

    return (
        <div className={styles.avatar_input_wrapper}>
            <Photocamera/>
            <input alt="avatar_image" type="file" accept="image/png, image/jpeg"
                onChange={handleAvatarChange}/>
            {avatarSrc !== '#' ?
            <img className={styles.avatar_input_preview} 
                src={backend_url + avatarSrc} alt="avatar input preview"
                onError={e => e.target.style.display = "none"}/>
            : 
            <div className={styles.avatar_placeholder}><span>{username[0]}</span></div>
            }
        </div>
    )
}

function useProfileEditForm(user_data, backend_url) {
    const [fullName, setFullName] = useState(user_data.full_name || "")
    const [login, setLogin] = useState(user_data.login || "")
    const [email, setEmail] = useState(user_data.email || "")
    const [avatarSrc, setAvatarSrc] = useState(user_data.profile_picture || "#")

    useEffect(() => {
        setFullName(user_data.full_name || "")
        setLogin(user_data.login || "")
        setEmail(user_data.email || "")
        setAvatarSrc(user_data.profile_picture || "#")
    }, [user_data.full_name, user_data.login, user_data.email, user_data.profile_picture])

    const avatar_input_form = useAvatarInput(user_data, avatarSrc, setAvatarSrc, backend_url)

    if (Object.keys(user_data).length === 0) {
        return <div></div>
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()

        const response = await update_profile(
            user_data.id,
            fullName !== "" ? fullName : null,
            login,
            email
        )
        const data = await response.json();
        console.log(data)
        window.location.reload();
    }
    
    return (
        <div className={styles.user_profile}>
            {avatar_input_form}
            <div>
                <p>Full name:</p>
                <input value={fullName} onChange={e => setFullName(e.target.value)}/>
                <p>Login:</p>
                <input value={login} onChange={e => setLogin(e.target.value)}/>
                <p>Email:</p>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}/>
                <br/>
                <br/>
                <button className="default_button" onClick={handleUpdateProfile}>Submit</button>
            </div>
        </div>
    )
}

// function useDeleteProfile(user_id) {
//     const [isDelete, setIsDelete] = useState(false)
//     const navigate = useNavigate()

//     const handleProfileDelete = async (e) => {
//         e.preventDefault()
//         console.log('here')

//         const response = await delete_profile(user_id)
//         const data = await response.json();
//         console.log(data)

//         if (data.success) {
//             navigate(`/login`)
//         }
       
//     }
//     return (
//         <div>
//             {isDelete ? <DeletePopup
//               handleDelete={handleProfileDelete}
//               setIsDelete={setIsDelete}
//               popup_question={"Are you sure you want to delete your account?"}
//             /> : ""}
//             <p>If you delete your profile all your activity would also be deleted</p>
//             <button onClick={() => setIsDelete(true)}>Delete Profile</button>
//         </div>
//     )
// }

function UserPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    // const [isDelete, setIsDelete] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const backend_url = "http://localhost:5000"

    useEffect(() => {
        get_self()
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
            dispatch(logout())
            persistor.purge()
            navigate('/login')
        });
    }, [dispatch, navigate]); 

    const profileEditForm = useProfileEditForm(data, backend_url)
    // const deleteProfileForm = useDeleteProfile(data.id)

    if (loading) return <div>Getting your data...</div>

    const username = data.full_name || data.login


    return (
      <div className={styles.User}>
        <div className={styles.user_page_navigation}>
            <button className={(!isEdit) ? styles.active_profile_part : ""}
                    onClick={() => {setIsEdit(false)}}>
                Profile
            </button>
            <button className={isEdit ? styles.active_profile_part : ""}
                    onClick={() => {setIsEdit(true)}}>
                Edit Profile
            </button>
            {/* <button className={isDelete ? styles.active_profile_part : ""}
                    onClick={() => {setIsEdit(false); setIsDelete(true)}}>
                Delete Account
            </button> */}
        </div>
        {(!isEdit) ?
        <div className={styles.user_profile}>
            <div>
                {data.profile_picture ?
                <div className={styles.avatar_image}>
                    <img alt="" src={backend_url + data.profile_picture}/>
                </div> :
                <div className={styles.avatar_placeholder}><span>{username[0]}</span></div>}
            </div>
            <div>
                <p className={styles.account_name}>{username}</p>
                {data.full_name ? <p className={styles.login}>{data.login}</p> : ""}
                <p className={styles.rating}>Rating: <span>{data.rating ? data.rating : 0}</span></p>
            </div>
        </div> : ""}
        {isEdit ? profileEditForm : ""}
        {/* {isDelete ? deleteProfileForm : ""} */}
      </div>
    )
  }
  
export default UserPage;
import './profile.scss';
import { useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import avatar from '../../assets/avatar.jpg';
import { axiosInstance } from '../../utils/axios';
import { updateUser } from '../../redux/usersSlice';
import { useDispatch } from 'react-redux';
import { app } from '../../firebase/firebase';
import { Link } from 'react-router-dom';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";

const ProfileImages = lazy(() => import('../../components/profileImages/ProfileImages'));

const Profile = () => {
    const { currentUser } = useSelector(state => state.user);
    const [name, setName] = useState(currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [img, setImg] = useState(null);
    const [selectedPredefinedImg, setSelectedPredefinedImg] = useState(null);
    const [isImgOpen, setIsImgOpen] = useState(false);
    const [imgPerc, setImgPerc] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const storage = getStorage(app);

    const handleChangeName = (e) => {
        setName(e.target.value)
    };

    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    };

    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            const name = new Date().getTime() + file.name;
            const storageRef = ref(storage, name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImgPerc(Math.round(progress))
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImgPerc(0);
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleUpdateImage = async (e) => {
        e.preventDefault();
        try {
            let imageUrl;
            if (img) {
                imageUrl = await uploadFile(img);
            } else if (selectedPredefinedImg) {
                imageUrl = selectedPredefinedImg;
            }

            if (imageUrl) {
                const response = await axiosInstance.put(`/users/${currentUser?._id}`, { img: imageUrl, name: name, email: email });
                dispatch(updateUser(response.data));
            }
        } catch (err) {

            console.log("Error updating user profile:", err);
        }
    };

    return (
        <>
            {
                !isLoading ?
                    <div className="profile-container">
                        {
                            currentUser ?
                                <div className="profile-wrapper">
                                    <h1>Update your profile</h1>
                                    <h3>{"How you'll appear"}</h3>
                                    <div className="profile-img">
                                        {
                                            currentUser?.img ?
                                                <img src={currentUser?.img} alt={currentUser?.name} />
                                                :
                                                <img src={avatar} alt={currentUser?.name} />
                                        }
                                    </div>
                                    <button onClick={() => setIsImgOpen(true)}>Select picture</button>
                                    <form>
                                        <div className="user-flex-container">
                                            <label htmlFor="name">Name</label>
                                            <input onChange={handleChangeName} type="text" value={name} />
                                        </div>
                                        <div className="user-flex-container">
                                            <label htmlFor="email">Handle</label>
                                            <input onChange={handleChangeEmail} type="text" value={email} />
                                        </div>
                                        <div className="profile-description">
                                            <p>By clicking Update Channel you agree to <span>Youtube's Terms of Service</span>. Changes made to your name and profile picture are visible only on Youtube.</p>
                                        </div>
                                        <button className="upload" onClick={handleUpdateImage}>
                                            Upload changes
                                        </button>
                                    </form>
                                </div>
                                :
                                <button className='login'>
                                    <PersonPinIcon className="user-icon" />
                                    <Link to="/login">Sign in</Link>
                                </button>
                        }
                        {
                            isImgOpen &&
                            <Suspense fallback={<div className='loading-bar'></div>}>
                                <div className="upload-images-container">
                                    <ProfileImages setIsImgOpen={setIsImgOpen} imgPerc={imgPerc} setImg={setImg} selectedPredefinedImg={selectedPredefinedImg} setSelectedPredefinedImg={setSelectedPredefinedImg} />
                                </div>
                            </Suspense>
                        }
                    </div>
                    :
                    <div className="loading-bar"></div>
            }
        </>
    )
};

export default Profile;

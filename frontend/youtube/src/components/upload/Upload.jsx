import { useEffect, useState } from 'react';
import './upload.scss';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";
import { app } from '../../firebase/firebase';
import { axiosInstance } from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NoSubscriptions from '../../pages/noSubscribtions/NoSubscriptions';

const Upload = () => {
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [imgPerc, setImgPerc] = useState(0);
    const [videoPerc, setVideoPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [category, setCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);

    const handleChange = (e) => {
        setInputs(prev => {
            return { ...prev, [e.target.name]: e.target.value }
        });
    };

    const handleCategory = (e) => {
        setCategory(e.target.value)
    };


    const uploadFile = (file, urlType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                urlType === "imgUrl" ? setImgPerc(Math.round(progress)) : setVideoPerc(Math.round(progress));
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (error) => { },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => {
                        return { ...prev, [urlType]: downloadURL };
                    });
                });
            }
        );
    };

    useEffect(() => {
        video && uploadFile(video, "videoUrl");
    }, [video]);

    useEffect(() => {
        image && uploadFile(image, "imgUrl");
    }, [image]);

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response = await axiosInstance.post('/videos', {
                ...inputs,
                category
            },
            );
            response.status === 200 && navigate(`/video/${response.data._id}`)
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.log("Error uploading channel: ", err)
        }

    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>

            <div className="upload-container">
                {
                    isLoading ?
                        <div className='loading-bar'></div>
                        :
                        <>
                            {
                                currentUser ?
                                    <>
                                        <h1>Channel content</h1>
                                        <div className="upload">
                                            <label htmlFor='video'>Choose a video</label>
                                            {
                                                videoPerc > 0 ?
                                                    "Uploading " + videoPerc + "%"
                                                    :
                                                    <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />
                                            }
                                            <input type="text" name="title" placeholder="Title" onChange={handleChange} />
                                            <textarea name="category" placeholder="Category" rows={8} onChange={handleCategory}></textarea>
                                            <input type="text" placeholder={`Created by ${currentUser?.name}`} onChange={handleCategory} />
                                            <label htmlFor="image">Choose an image</label>
                                            {
                                                imgPerc > 0 ?
                                                    "Uploading " + imgPerc + "%"
                                                    :
                                                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                                            }
                                            <button onClick={handleUpload}>Upload</button>
                                        </div>
                                    </>
                                    :
                                    <NoSubscriptions title={"Don't miss new videos"} description={"Sign in to upload your Youtube channel"} />
                            }
                        </>
                }
            </div>
        </div>
    )
};

export default Upload;

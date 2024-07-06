import React, { useState } from 'react';
import './profileImages.scss';
import CloseIcon from '@mui/icons-material/Close';
import img1 from '/img1.avif';
import img2 from '/img2.avif';
import img3 from '/img3.avif';
import img4 from '/img4.avif';
import img5 from '/img5.avif';
import img6 from '/img6.avif';
import img7 from '/img7.avif';
import img8 from '/img8.avif';
import img9 from '/img9.avif';
import img10 from '/img10.avif';
import img11 from '/img11.avif';
import img12 from '/img12.avif';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


const predefinedImagesPath = [
    img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12
];

const ProfileImages = ({ setIsImgOpen, selectedPredefinedImg, imgPerc, setImg, setSelectedPredefinedImg }) => {
    const [imageType, setImageType] = useState("illustrations");

    const handleImageChange = (e) => {
        setImg(e.target.files[0]);
        setSelectedPredefinedImg(null);
    };

    const handlePredefinedImageClick = (imageUrl) => {
        setSelectedPredefinedImg(imageUrl);
        setImg(null);
    };

    return (
        <div className="profile-images-container">
            <CloseIcon onClick={() => setIsImgOpen(false)} className="close-icon" />
            <h2>Choose image</h2>
            <div className="img-type">
                <h3 onClick={() => setImageType("illustrations")}>Illustrations</h3>
                <h3 onClick={() => setImageType("computer")}>From your computer</h3>
            </div>
            {
                imageType === "illustrations" ?
                    <div className="predefined-container">
                        {predefinedImagesPath.map((imagePath, index) => (
                            <LazyLoadImage
                                key={index}
                                src={imagePath}
                                effect="blur"
                                alt="predefined"
                                onClick={() => handlePredefinedImageClick(imagePath)}
                                className={selectedPredefinedImg === imagePath ? "selected" : ""}
                            />
                        ))}
                    </div>
                    :
                    <div className="upload-img">
                        <h3>Upload an image</h3>
                        <input type="file" onChange={handleImageChange} />
                        {
                            imgPerc > 0 &&
                            <h1>{imgPerc}%</h1>
                        }
                    </div>
            }
        </div>
    )
};

export default ProfileImages;

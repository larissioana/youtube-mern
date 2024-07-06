import './card.scss';
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { format } from "timeago.js";
import { formatViews } from '../../utils/formatNumber';
import { axiosInstance } from '../../utils/axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import avatar from '../../assets/avatar.jpg';

const Card = ({ video, handleHover }) => {

    const [channel, setChannel] = useState({});
    const { videoUrl, title, views, createdBy, imgUrl, createdAt, _id, userId, isHovered } = video;

    useEffect(() => {
        const fetchUserChannel = async () => {
            const channelResponse = await axiosInstance.get(`users/find/${userId}`);
            setChannel(channelResponse.data)
        };
        fetchUserChannel();
    }, [userId]);

    return (
        <div className="card-container">
            <div className='videos-left'>
                <div className="wrapper"
                    onMouseEnter={() => handleHover(_id, true)}
                    onMouseLeave={() => handleHover(_id, false)}
                >
                    {
                        isHovered ? (
                            <div className="react-player-container">
                                <ReactPlayer
                                    controls
                                    playing
                                    width="100%"
                                    height="100%"
                                    muted
                                    className="react-player"
                                    url={videoUrl}

                                />
                            </div>
                        ) : (
                            <LazyLoadImage
                                effect="blur"
                                src={imgUrl.startsWith('https://firebasestorage') ? imgUrl : `https://img.youtube.com/vi/${imgUrl}/hqdefault.jpg`}
                                alt={title} className="youtube-img"
                            />
                        )}
                </div>

            </div>
            <div className="videos-right">
                <Link to={`/video/${_id}`} className="link">
                    {title}
                </Link>
                <div className="views-container">
                    <p>{formatViews(views)} views </p>
                    <span className="circle"></span>
                    <p>{format(createdAt)}</p>
                </div>
                <div className="channel-flex">
                    <Link to={`/user/${userId}`}>
                        {
                            channel?.img ?
                                <LazyLoadImage src={channel.img} className="channel-img" width={40} height={40} alt="user" effect="blur" />
                                :
                                <LazyLoadImage src={avatar} className="channel-img" width={40} height={40} alt="user" effect="blur" />
                        }
                    </Link>
                    <h4>{channel?.name}</h4>
                </div>

            </div>
        </div>
    )
};

export default Card;

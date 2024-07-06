import { useState, useEffect } from 'react';
import './channel.scss';
import { formatNumber } from '../../utils/formatNumber';
import { format } from "timeago.js";
import { axiosInstance } from '../../utils/axios';
import { Link } from 'react-router-dom';
import { formattedString } from '../../utils/formatText';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import avatar from '../../assets/avatar.jpg';

const Channel = ({ id, title, views, createdAt, videoId, showInfo }) => {
    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchUserChannel = async () => {
            const channelResponse = await axiosInstance.get(`users/find/${id}`);
            setChannel(channelResponse.data)
        };
        fetchUserChannel();
    }, []);

    return (
        <div className='channel-container'>
            {
                showInfo &&
                <div className="channel-left">
                    <Link to={`/user/${id}`}>
                        {
                            channel?.img ?
                                <LazyLoadImage src={channel.img} className="channel-img" width={40} height={40} alt="user" effect="blur" />
                                :
                                <LazyLoadImage src={avatar} className="channel-img" width={40} height={40} alt="user" effect="blur" />
                        }
                    </Link>
                </div>
            }
            <div className="channel-right">
                <Link to={`/video/${videoId}`}>
                    <h3>{formattedString(title, 30)}</h3>
                </Link>
                {
                    showInfo &&
                    <p>{channel?.name}</p>
                }
                <div className="subscribers-container">
                    <p>{formatNumber(views)} views</p>
                    <span className="circle"></span>
                    <p className="date">{format(createdAt)}</p>
                </div>
            </div>
        </div>
    )
};

export default Channel;

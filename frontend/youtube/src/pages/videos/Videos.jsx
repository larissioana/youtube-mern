import { useEffect, useState, lazy, Suspense } from 'react';
import './videos.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSuccess, like, dislike } from '../../redux/videoSlice';
import ReactPlayer from 'react-player';
import { formatNumber, formatViews, formatDate } from '../../utils/formatNumber';
import MovieIcon from '@mui/icons-material/Movie';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LaptopIcon from '@mui/icons-material/Laptop';
import DiamondIcon from '@mui/icons-material/Diamond';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ShareIcon from '@mui/icons-material/Share';
import { Link } from 'react-router-dom';
import { subscription } from '../../redux/usersSlice';
import Comments from '../../components/comments/Comments';
import { axiosInstance } from '../../utils/axios';


const Share = lazy(() => import('../../components/share/Share'));

const Videos = () => {
    const [channel, setChannel] = useState({});
    const [copied, setCopied] = useState(false);
    const [message, setMessage] = useState("");
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();
    const { currentVideo } = useSelector((state) => state.video);
    const { currentUser } = useSelector((state) => state.user);
    const subscribedUsers = useSelector(state => state.user.currentUser?.subscribedUsers || []);
    const dispatch = useDispatch();

    const categoryIcons =
    {
        music: MusicNoteIcon,
        science: PsychologyIcon,
        sports: FitnessCenterIcon,
        coding: LaptopIcon,
        fashion: DiamondIcon,
        movies: MovieIcon
    };
    const CategoryIcon = currentVideo?.category ? categoryIcons[currentVideo.category.toLowerCase()] : null;


    const shareUrl = window.location.href;

    const handleCopy = () => {
        setCopied(true);
        const timeout = setTimeout(() => setCopied(false), 3000);
        return () => clearTimeout(timeout);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const videoRes = await axiosInstance.get(`/videos/find/${id}`);
                const channelRes = await axiosInstance.get(
                    `/users/find/${videoRes.data.userId}`
                );

                const promiseDelay = new Promise(resolve => setTimeout(resolve, 1000));
                const [videoResponse, channelResponse] = await Promise.all([videoRes, channelRes, promiseDelay])
                setChannel(channelResponse.data);
                dispatch(fetchSuccess(videoResponse.data));
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                console.log(err)
            }
        };
        fetchData();
    }, [id, dispatch]);

    const setMessageWithTimeout = (msg, timeout = 2000) => {
        setMessage(msg);
        const timer = setTimeout(() => setMessage(""), timeout);
        return () => clearTimeout(timer)
    };


    const handleLike = async () => {
        try {
            await axiosInstance.put(`/users/like/${currentVideo._id}`);
            dispatch(like(currentUser._id));
        } catch (err) {
            setMessageWithTimeout(err.response.data.message)
        }
    };

    const handleDislike = async () => {
        try {
            await axiosInstance.put(`/users/dislike/${currentVideo._id}`);
            dispatch(dislike(currentUser._id));
        } catch (err) {
            setMessageWithTimeout(err.response.data.message);
            console.log(err)
        }
    };


    const handleSubscribe = async () => {
        try {
            if (subscribedUsers.includes(channel._id)) {
                await axiosInstance.put(`/users/unsubscribe/${channel._id}`);
            } else {
                await axiosInstance.put(`/users/subscribe/${channel._id}`);
            }

            dispatch(subscription(channel._id));
        } catch (error) {
            setMessageWithTimeout(error.response.data.message);
            console.error('Error subscribing the video:', error);
        }
    };

    return (
        <>
            {
                !isLoading ?
                    <>
                        <div>
                            <div className="video-container" >
                                <div className="left" >
                                    <div className="react-player">
                                        <ReactPlayer width="100%" height="85%" playing controls url={currentVideo?.videoUrl} className="video" />
                                    </div>
                                    {
                                        currentVideo?.title &&

                                        <h1>{currentVideo?.title}</h1>
                                    }
                                    <div className="user-wrapper">
                                        <div className="user-flex-container" >
                                            {
                                                channel?.img &&
                                                <Link to={`/user/${currentVideo.userId}`}>
                                                    <img src={channel?.img} alt={channel.name} className="channel-img" width="3rem" height="3rem" />
                                                </Link>
                                            }
                                            <div className="name-icon-container">
                                                <h3 className="channel-name">
                                                    {channel?.name}
                                                    {CategoryIcon && <CategoryIcon className="category-icon" />}
                                                </h3>
                                                <div className="subscribers-container">
                                                    {channel?.subscribers > 0 &&
                                                        <p>{formatNumber(channel?.subscribers)} {channel.subscribers === 1 ? "subscriber" : "subscribers"}</p>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="video-details">
                                            <button
                                                className='subscribe-btn'
                                                onClick={handleSubscribe}
                                                style={{
                                                    background: currentUser?.subscribedUsers.includes(channel._id) ?
                                                        "#272727" : "#fff",
                                                    color: currentUser?.subscribedUsers.includes(channel._id) ? "#fff" : "#111"
                                                }}
                                            >
                                                <NotificationsIcon />
                                                {
                                                    currentUser?.subscribedUsers?.includes(channel?._id) ? "Subscribed" : "Subscribe"
                                                }
                                            </button>
                                            <div className="like-dislike">
                                                {currentVideo?.likes?.includes(currentUser?._id) ? (
                                                    <ThumbUpIcon onClick={handleLike} />
                                                ) : (
                                                    <ThumbUpOutlinedIcon onClick={handleLike} />
                                                )}{" "}
                                                {currentVideo?.likes?.length}
                                                {
                                                    !currentUser && message && < >
                                                        <p className="message">{message}
                                                            <Link to="/login">Sign in</Link>
                                                        </p>
                                                    </>
                                                }
                                                {currentVideo?.dislikes?.includes(currentUser?._id) ? (
                                                    <ThumbDownIcon onClick={handleDislike} />
                                                ) : (
                                                    <ThumbDownOffAltOutlinedIcon onClick={handleDislike} />
                                                )}{" "}
                                                {currentVideo?.dislikes?.length > 0 && currentVideo.dislikes.length}
                                                {
                                                    message && <>
                                                        <p className="message">{message}
                                                            <Link to="/login">Sign in</Link>
                                                        </p>
                                                    </>
                                                }
                                            </div>
                                            <button onClick={() => setIsShareOpen(true)}>
                                                <ShareIcon />
                                                Share
                                            </button>
                                        </div>
                                    </div>

                                    <div className="attribution" onClick={() => setMessage("")}>
                                        <p className='views'>{formatViews(currentVideo?.views)} views {formatDate(currentVideo?.createdAt)}</p>
                                        <p className="source">Source code:
                                            <a href={currentVideo?.videoUrl} target="_blank" rel="noopener noreferrer">
                                                {currentVideo?.videoUrl}
                                            </a>
                                        </p>
                                        <h4>Created by {currentVideo?.createdBy ? currentVideo.createdBy : currentUser?.name}</h4>
                                        <p>This video is licensed under the Creative Commons Attribution license (reuse allowed).</p>
                                        <Link to="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</Link>
                                    </div>
                                    <Comments currentUser={currentUser} videoId={currentVideo?._id} />
                                </div>
                            </div>
                        </div>
                        {
                            isShareOpen &&
                            <Suspense fallback={<div className="loading-bar"></div>}>
                                <Share shareUrl={shareUrl} copied={copied} setIsShareOpen={setIsShareOpen} handleCopy={handleCopy} />
                            </Suspense>
                        }
                    </>
                    :
                    <div className="loading-bar"></div>
            }
        </>
    )
};

export default Videos;

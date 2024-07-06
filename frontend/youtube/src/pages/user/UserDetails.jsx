import { useEffect, useState, lazy, Suspense } from 'react';
import './userDetails.scss';
import { axiosInstance } from '../../utils/axios';
import { useParams } from 'react-router-dom';
import { formatNumber, formatDate } from '../../utils/formatNumber';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { subscription } from '../../redux/usersSlice';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import VideocamIcon from '@mui/icons-material/Videocam';
import TimerIcon from '@mui/icons-material/Timer';
import EmailIcon from '@mui/icons-material/Email';
import ShareIcon from '@mui/icons-material/Share';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import FeedCard from '../../components/feedCard/FeedCard';

const Share = lazy(() => import('../../components/share/Share'));

const UserDetails = () => {
    const [user, setUser] = useState({});
    const [userVideos, setUserVideos] = useState([]);
    const [totalViews, setTotalViews] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    const { id } = useParams();
    const dispatch = useDispatch();
    const subscribedUsers = useSelector(state => state.user.currentUser?.subscribedUsers || []);

    const shareUrl = window.location.href;

    const handleCopy = () => {
        setCopied(true);
        const timeout = setTimeout(() => setCopied(false), 3000);
        return () => clearTimeout(timeout);
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                setIsLoading(true);
                const userPromise = await axiosInstance.get(`/users/${id}`);
                const videosPromise = await axiosInstance.get(`/users/${id}/videos`);

                const delayPromise = new Promise(resolve => setTimeout(resolve, 1000));
                const [userResponse, videosResponse] = await Promise.all([userPromise, videosPromise, delayPromise])

                setUser(userResponse.data);
                setUserVideos(videosResponse.data);
                const viewsSum = videosResponse.data.reduce((acc, video) => acc + video.views, 0);
                setTotalViews(viewsSum);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                console.log("Unable to fetch user details: ", err);
            }
        };
        getUser();
    }, [id]);

    const userEmail = user?.email?.split("@")[0];

    const handleSubscribe = async () => {
        try {
            subscribedUsers.includes(user._id)
                ? await axiosInstance.put(`/users/unsubscribe/${user._id}`)
                : await axiosInstance.put(`/users/subscribe/${user._id}`);
            dispatch(subscription(user._id));
            const response = await axiosInstance.get(`/users/find/${id}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error subscribing the video:', error);
        }
    };

    const firstSentence = user?.description?.substring(0, 130) + "...";
    const newSubscribers = formatNumber(user?.subscribers);
    const videos = userVideos.length === 1 ? userVideos.length + " video" : userVideos.length + " videos";

    const handleHover = (id, isHovered) => {
        setUserVideos(prevVideos =>
            prevVideos.map(video =>
                video._id === id ? { ...video, isHovered } : video
            )
        );
    };
    return (
        <div className="user-details-wrapper">
            {
                !isLoading ?
                    <>
                        <div className="user-wrapper-info">
                            <div className="user-left">
                                <LazyLoadImage src={user.img} alt={user.name} effect="blur" width={200} />
                            </div>
                            <div className="user-right">
                                <h1>{user.name}</h1>
                                <div className="user-flex-wrapper">
                                    <p>@{userEmail}</p>
                                    <span></span>
                                    <p>{newSubscribers} {newSubscribers === 1 ? "subscriber" : "subscribers"}</p>
                                    <span></span>
                                    <p>{videos}</p>
                                </div>
                                <button className="subscribe-btn" onClick={handleSubscribe} style={{
                                    backgroundColor: subscribedUsers?.includes(user?._id) ? "#252424" : "#fff",
                                    color: subscribedUsers?.includes(user?._id) ? "#fff" : "#1e1d1d",
                                }}>
                                    <NotificationsIcon />
                                    {
                                        subscribedUsers?.includes(user?._id) ? "Subscribed" : "Subscribe"
                                    }
                                </button>
                                {
                                    user.description ?
                                        <p className="desc">{firstSentence}
                                            <ArrowForwardIosIcon style={{
                                                fontSize: "1rem",
                                                verticalAlign: "top",
                                                cursor: "pointer"
                                            }}
                                                onClick={() => setShowFullDescription(true)}
                                            />
                                        </p>
                                        :
                                        <p className="desc">More about this channel...
                                            <ArrowForwardIosIcon style={{
                                                fontSize: "1rem",
                                                verticalAlign: "middle",
                                                cursor: "pointer"
                                            }}
                                                onClick={() => setShowFullDescription(true)}
                                            />
                                        </p>
                                }
                                {
                                    showFullDescription &&
                                    <div className="full-desc">
                                        <CloseIcon className="close-icon" onClick={() => setShowFullDescription(false)} />
                                        {
                                            user?.description &&
                                            <h2>About</h2>
                                        }
                                        {
                                            user.description &&
                                            <p className="full-description" >{user?.description}</p>
                                        }
                                        <h2>Channel details</h2>
                                        <p className="about-user">
                                            <EmailIcon />
                                            <a href={`mailto: ${user?.email}`}>Email</a>
                                        </p>
                                        <p className="about-user">
                                            <RecordVoiceOverIcon /> {newSubscribers} subscribers
                                        </p>
                                        <p className="about-user">
                                            <VideocamIcon /> {videos}
                                        </p>
                                        <p className="about-user">
                                            <TimerIcon /> Joined {formatDate(user?.createdAt)}
                                        </p>
                                        <p className="about-user">
                                            <TrendingUpIcon />  {totalViews === 1 ? totalViews + " view" : totalViews.toLocaleString() + " views"}
                                        </p>
                                        <button onClick={() => setIsShareOpen(true)}>
                                            <Suspense fallback={<div className='loading-bar'></div>}>
                                                <ShareIcon />
                                            </Suspense>
                                            Share Channel
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                        {
                            isShareOpen &&
                            <Share shareUrl={shareUrl} handleCopy={handleCopy} copied={copied} setIsShareOpen={setIsShareOpen} />
                        }
                        <div className="user-videos">
                            {
                                userVideos.map((video) => {
                                    return <Link to={`/video/${video._id}`} key={video._id}>
                                        <FeedCard video={video} showInfo={false} handleHover={handleHover} />
                                    </Link>
                                })
                            }
                        </div>
                    </>
                    :
                    <div className="loading-bar"></div>
            }
        </div >
    )
};

export default UserDetails;;

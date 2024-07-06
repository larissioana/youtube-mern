import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import './feedSubscriptions.scss';
import { Link } from 'react-router-dom';
import { axiosInstance } from "../../utils/axios";
import FeedCard from "../../components/feedCard/FeedCard";


const FeedSubscriptions = () => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const fetchSubscribedVideos = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get(`users/${currentUser?._id}/subscribedVideos`);
                const delayPromise = new Promise(resolve => setTimeout(resolve, 1000));
                const [videoResponse] = await Promise.all([response, delayPromise]);
                setVideos(videoResponse.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Failed to fetch subscribed videos:', error);
            }
        };

        if (currentUser) {
            fetchSubscribedVideos();
        }
    }, [currentUser]);

    const handleHover = (id, isHovered) => {
        setVideos(prevVideos =>
            prevVideos.map(video =>
                video._id === id ? { ...video, isHovered } : video
            )
        );
    };

    return (
        <>
            {
                !isLoading ?
                    <div className="feed-subscriptions-container" >
                        <div className="manage-container">
                            <Link to="/channels">See subscribers</Link>
                        </div>
                        <div className="videos">
                            {
                                videos.length > 0 &&
                                videos.map((video) => {
                                    return (
                                        <FeedCard handleHover={handleHover} key={video._id} video={video} isSidebarOpen={isSidebarOpen} showInfo={true} />
                                    );
                                })}
                        </div>
                    </div>
                    :
                    <div className="loading-bar"></div>
            }
        </>

    );
};


export default FeedSubscriptions;

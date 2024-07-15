import { useEffect, useState } from 'react';
import './home.scss';
import Categories from '../../components/categories/Categories';
import { axiosInstance } from '../../utils/axios';
import FeedCard from '../../components/feedCard/FeedCard';

const Home = ({ type }) => {
    const [videos, setVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getVideos = async () => {
            try {
                setIsLoading(true);
                await new Promise(resolve => setTimeout(resolve, 1000));
                const response = await axiosInstance.get(`/videos/${type}`);

                setVideos(response.data);
                setIsLoading(false);

            } catch (error) {
                setIsLoading(false);
                console.error('Failed to fetch videos:', error);
            }
        };
        getVideos();
    }, [type]);


    const filteredVideosByCategory = () => {
        if (selectedCategory === "all") {
            return videos;
        } else {
            return videos.filter(video => video.category === selectedCategory);
        }
    };

    //const filteredVideos = filteredVideosByCategory();
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
                    <>
                        <div className="home-container">
                            {
                                videos?.map((video) => {
                                    return <FeedCard key={video._id} handleHover={handleHover} video={video} showInfo={true} />
                                })
                            }
                        </div>
                    </>
                    :
                    <div className="loading-bar"></div>
            }

        </ >
    )
};

export default Home;

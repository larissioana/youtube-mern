import { axiosInstance } from '../../utils/axios';
import './search.scss';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../../components/card/Card';
import Searchbar from '../../components/searchbar/Searchbar';

const Search = () => {
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    const [message, setMessage] = useState("");
    const query = useLocation().search;

    useEffect(() => {
        const getVideos = async () => {
            try {
                setIsLoading(true);
                setMessage("");
                const response = await axiosInstance.get(`/videos/search${query}`)
                setVideos(response.data);
                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);
                setMessage(err.response.data.message)
                console.log("Error searching videos: ", err)
            }
        };
        getVideos();
    }, [query]);

    const handleHover = (id, isHovered) => {
        setVideos(prevVideos =>
            prevVideos.map(video =>
                video._id === id ? { ...video, isHovered } : video
            )
        );
    };

    return (
        <>

            <div className="mobile-search-bar">
                <Searchbar />
            </div>
            {
                isLoading ?
                    <div className="loading-bar"></div>
                    :
                    <div className="searched-videos-container">
                        {
                            message &&
                            <h2>{message}</h2>
                        }
                        {
                            videos.map((video) => {
                                return <Card video={video} key={video._id} handleHover={handleHover} />
                            })
                        }
                    </div>
            }
        </>
    )
}

export default Search

import './sidebar.scss';
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import ImageIcon from '@mui/icons-material/Image';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import MovieIcon from '@mui/icons-material/Movie';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LaptopIcon from '@mui/icons-material/Laptop';
import DiamondIcon from '@mui/icons-material/Diamond';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../../utils/axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


const Sidebar = () => {
    const [channels, setChannels] = useState([]);
    const { currentUser } = useSelector(state => state.user);
    const subscribedUsers = currentUser?.subscribedUsers;

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await axiosInstance.post('/users/findMultipleUsers', {
                    ids: subscribedUsers
                },
                );
                setChannels(response.data);
            } catch (error) {
                console.log("Error fetching channels data:", error);
            }
        };
        fetchChannels();
    }, [subscribedUsers, currentUser]);

    return (
        <div className="sidebar" >
            <div className="container-home">
                <div className="flex-container">
                    <HomeIcon />
                    <Link to="/">Home</Link>
                </div>
                <div className="flex-container">
                    <ExploreIcon />
                    <Link to="/trends">Explore</Link>
                </div>

                <div className="flex-container">
                    <SubscriptionsIcon />
                    {
                        currentUser ?

                            <Link to="/feed/subscriptions">Subscriptions</Link>
                            :
                            <Link to="/subscriptions">Subscriptions</Link>
                    }
                </div>
            </div>
            <div className="container">
                <div className="flex-container">
                    <VideoLibraryIcon />
                    <Link to="/upload">Upload</Link>
                </div>
                <div className="flex-container">
                    <ImageIcon />
                    <Link to="/profile">Appearance</Link>
                </div>
                <div className="flex-container search-page">
                    <ImageIcon />
                    <Link to="/search">Search</Link>
                </div>
            </div>
            <div className="container">
                {
                    currentUser?.subscribedUsers.length > 0 &&
                    <h3>Subscriptions</h3>
                }
                {
                    channels?.length > 0 &&
                    <div className="channels">
                        {
                            channels.map((channel) => {
                                return <div key={channel._id} className="channel-info">
                                    <LazyLoadImage src={channel.img} alt={channel.name} width={30} height={30} effect="blur" />
                                    <h4>{channel.name}</h4>
                                </div>
                            }).slice(0, 5)
                        }
                        <Link className="channel-info link" to="/channels"> <SubscriptionsIcon /> All subscriptions</Link>
                    </div>
                }
            </div>
            {
                !currentUser &&
                <div className="sign-in">
                    <h3>Sign in to like videos, comment, and subscribe.</h3>
                    <Link className="link" to='/login'>Sign in</Link>
                </div>
            }
            <div className="container">
                <h3>Best of YouTube</h3>
                <div className="flex-container">
                    <LibraryMusicIcon />
                    <Link to="/music">Music</Link>
                </div>
                <div className="flex-container">
                    <SportsBaseballIcon />
                    <Link to="/sports">Sports</Link>
                </div>
                <div className="flex-container">
                    <PsychologyIcon />
                    <Link to="/science">Science</Link>
                </div>
                <div className="flex-container">
                    <MovieIcon />
                    <Link to="/movies">Movies</Link>
                </div>
                <div className="flex-container">
                    <LaptopIcon />
                    <Link to="/coding">Coding</Link>
                </div>
                <div className="flex-container">
                    <DiamondIcon />
                    <Link to="/fashion">Fashion</Link>
                </div>
            </div>
        </div>
    )
};

export default Sidebar;

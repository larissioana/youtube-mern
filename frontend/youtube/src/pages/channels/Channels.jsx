import './channels.scss';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { formatNumber } from '../../utils/formatNumber';
import avatar from '../../assets/avatar.jpg';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Channels = () => {
    const [channels, setChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();

    const subscribedUsers = currentUser?.subscribedUsers;

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                setIsLoading(true);

                const fetchChannelsPromise = axiosInstance.post('/users/findMultipleUsers', {
                    ids: subscribedUsers
                });

                const delayPromise = new Promise(resolve => setTimeout(resolve, 1000));

                const [response] = await Promise.all([fetchChannelsPromise, delayPromise]);

                setChannels(response.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.log("Error fetching channels data:", error);
            }
        };

        if (currentUser) {
            fetchChannels();
        } else {
            navigate("/subscriptions");
        }
    }, [subscribedUsers, currentUser, navigate]);
    return (

        <div className="channels-container" >
            {
                isLoading ? (
                    <div className="loading-bar"></div>
                ) : (
                    <div className="channel">
                        {
                            channels.length > 0 ? (
                                channels.map((channel) => {
                                    const { name, img, _id, email, subscribers } = channel;
                                    const userEmail = email.split("@")[0];
                                    return (
                                        <div key={_id} className="channel-wrapper">
                                            {img ? (
                                                <Link to={`/user/${_id}`}>
                                                    <LazyLoadImage src={img} alt={name} width={150} height={150} effect="blur" />
                                                </Link>
                                            ) : (
                                                <Link to={`/user/${_id}`}>
                                                    <LazyLoadImage src={avatar} alt={name} width={150} height={150} effect="blur" />
                                                </Link>
                                            )}
                                            <div className="channel-info">
                                                <h3>{name}</h3>
                                                <div className="more-details">
                                                    <p>@{userEmail}</p>
                                                    <span className="circle"></span>
                                                    <p>{formatNumber(subscribers)} {subscribers === 1 ? "subscriber" : "subscribers"}</p>

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <h1>You have no subscriptions to channels.</h1>
                            )}
                    </div>
                )}
        </div>
    )
}

export default Channels

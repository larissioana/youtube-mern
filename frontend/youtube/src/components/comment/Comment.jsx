import { useEffect, useState } from 'react'
import './comment.scss';
import { format } from "timeago.js";
import avatar from '../../assets/avatar.jpg';
import { axiosInstance } from '../../utils/axios';
import { useSelector } from 'react-redux';

const Comment = ({ comment }) => {
    const [channel, setChannel] = useState({});
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const fetchChannel = async () => {
            try {
                const response = await axiosInstance.get(`/users/find/${comment.userId}`);
                setChannel(response.data);
            } catch (error) {
                console.log("Error fetching channel data:", error);
            }
        };
        fetchChannel();
    }, [comment.userId]);

    return (
        <div className="comment-container">
            {
                channel &&

                <div className="comment-flex-container">
                    {
                        channel?.img ?
                            <img src={channel.img} alt={channel.name} />
                            :
                            <img src={avatar} alt={"avatar"} />
                    }
                    <div className="comment-desc">
                        <h4>{channel?.name}
                            <span>{format(comment.createdAt)}</span>
                        </h4>
                        <p>{comment.description}</p>
                    </div>
                </div>
            }
        </div>
    )
};

export default Comment;

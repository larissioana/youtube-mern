import { useEffect, useState } from 'react';
import './comments.scss';
import { useDispatch, useSelector } from 'react-redux';
import { addCommentSuccess, fetchCommentsSuccess } from '../../redux/commentsSlice';
import Comment from '../comment/Comment';
import avatar from '../../assets/avatar.jpg';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';

const Comments = ({ videoId, currentUser }) => {
    const [comment, setComment] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { comments } = useSelector(state => state.comment);

    useEffect(() => {
        const getComments = async () => {
            try {
                const commentsResponse = await axiosInstance.get(`/comments/${videoId}`, {
                    withCredentials: true
                });
                dispatch(fetchCommentsSuccess(commentsResponse.data));
            } catch (error) {
                console.log(error.response.data.message)
            }
        };
        getComments();
    }, [videoId, dispatch]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment) return;
        if (!currentUser) {
            return navigate('/login')
        }

        try {
            const response = await axiosInstance.post('/comments', {
                videoId, description: comment
            },
            );
            setComment(response.data)
            dispatch(addCommentSuccess(response.data));
            setComment("");

        } catch (error) {
            console.log("Error adding comment: ", error)
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        if (comment.trim() === "") {
            setIsFocused(false)
        }
    };

    return (
        <>
            {
                currentUser ?

                    <div className="comments-container">
                        {
                            comments.length === 0 &&
                            <h3 style={{ fontSize: "1.5rem" }}> {comments.length === 1 ? comments.length + " comment" : "No comments yet." + " Be the first one to comment!"}</h3>
                        }
                        <div className="comments-flex-container">
                            <form >
                                {
                                    currentUser?.img ?

                                        <img src={currentUser?.img} alt={currentUser?.name} width="3rem" height="3rem" />
                                        :
                                        <img src={avatar} alt="avatar" width="3rem" height="3rem" />
                                }
                                <input type="text" onFocus={handleFocus} onBlur={handleBlur} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." />
                                {isFocused &&
                                    <button onClick={handleSubmit}>Comment</button>
                                }
                            </form>
                        </div>
                    </div>
                    :
                    <h2 style={{
                        marginTop: "2rem",
                        marginBottom: "2rem"
                    }}>Sign in to write a comment</h2>
            }
            <div className="comments">
                {
                    comments?.map((comment) => {
                        return <Comment key={comment._id} comment={comment} />
                    })
                }
            </div>
        </>
    )
};

export default Comments;

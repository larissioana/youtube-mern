import { logout } from '../../redux/usersSlice';
import './userDetailsNav.scss';
import { useSelector, useDispatch } from 'react-redux';
import avatar from '../../assets/avatar.jpg';
import { axiosInstance } from '../../utils/axios';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ImageIcon from '@mui/icons-material/Image';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


const UserDetailsNav = ({ isUserDetailsVisible }) => {
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleLogout = async () => {

        try {
            await axiosInstance.post('/auth/signout', {});
            dispatch(logout());
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (!isUserDetailsVisible || !currentUser) {
        return null;
    }

    return (
        <>
            <div className="user-details-container">
                <div className="flex-container">
                    {
                        currentUser?.img ?
                            <LazyLoadImage src={currentUser?.img} alt={currentUser?.name} effect="blur" />
                            :
                            <LazyLoadImage src={avatar} alt={currentUser?.name} effect="blur" />
                    }
                    <div className="user-info">
                        <h4>{currentUser.name}</h4>
                        <h5>{currentUser.email}</h5>
                    </div>
                </div>
                <div className="line"></div>
                <Link to="/profile" className='appearance'>
                    <ImageIcon />
                    Appearance
                </Link>
                <p onClick={handleLogout} className="sign-out">
                    <ArrowRightAltIcon />
                    Sign out
                </p>
            </div >
        </>
    )
};

export default UserDetailsNav;

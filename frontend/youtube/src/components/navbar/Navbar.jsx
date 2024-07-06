import './navbar.scss';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import avatar from '../../assets/avatar.jpg';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import Searchbar from '../searchbar/Searchbar';
const UserDetailsNav = lazy(() => import('../userDetailsNav/UserDetailsNav'));
const Sidebar = lazy(() => import('../sidebar/Sidebar'));
const ShorterSidebar = lazy(() => import('../shorterSidebar/ShorterSidebar'));
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const [isUserDetailsVisible, setIsUserDetailsVisible] = useState(false);

    const { currentUser } = useSelector(state => state.user);
    const location = useLocation();
    const path = location.pathname;
    const userDetailsRef = useRef(null);

    const handleClickOutside = (event) => {
        if (userDetailsRef.current && !userDetailsRef.current.contains(event.target)) {
            setIsUserDetailsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <nav className="navigation">
                <div className="burger" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <div className="line"></div>
                    <div className="line"></div>
                    <div className="line"></div>
                </div>
                <div className="logo">
                    <img src={logo} alt="logo" width="30" height="30" />
                    <Link to="/">YouTube</Link>
                </div>
                <div className="center">
                    <Searchbar />
                </div>
                <div className="login">
                    <Link to="/upload">
                        <VideoCallIcon className="video-icon" width={10} height={10} />
                    </Link>
                    {
                        !currentUser ?
                            <>
                                <button>
                                    <PersonPinIcon className="user-icon" />
                                    <Link to="/login">Sign in</Link>
                                </button>
                            </>
                            :
                            <div className="user">
                                {
                                    currentUser?.img ?

                                        <LazyLoadImage onClick={() => setIsUserDetailsVisible(true)} src={currentUser?.img} alt={currentUser?.name} effect="blur" />
                                        :
                                        <LazyLoadImage src={avatar} onClick={() => setIsUserDetailsVisible(true)} alt={currentUser?.name} effect="blur" />
                                }
                            </div>
                    }
                    {
                        currentUser &&
                        <Suspense fallback={<div className="loading-bar"></div>}>
                            <div className="user-details" ref={userDetailsRef}>
                                <UserDetailsNav isUserDetailsVisible={isUserDetailsVisible} />
                            </div>
                        </Suspense>
                    }
                </div>
            </nav>
            {
                isSidebarOpen ? (
                    <Suspense fallback={<div className='loading-bar'></div>}>
                        <Sidebar />
                    </Suspense>
                ) : (
                    path === '/' && <Suspense fallback={<div className='loading-bar'></div>}>
                        <ShorterSidebar />
                    </Suspense>
                )
            }
        </>
    )
};

export default Navbar;

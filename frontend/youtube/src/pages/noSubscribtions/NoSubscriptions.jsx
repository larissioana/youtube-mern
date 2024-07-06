import './noSubscriptions.scss';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { Link } from 'react-router-dom';

const NoSubscriptions = ({ title, description }) => {
    return (
        <div className="no-subscriptions">
            <VideoLibraryIcon className="video-icon" />
            {
                title ?
                    <h4>{title}</h4>
                    :
                    <h4>{"Don't miss new videos"}</h4>
            }
            {
                description ?
                    <p>{description}</p>
                    :
                    <p>Sign in to see updates from your favorite Youtube channels</p>
            }
            <button>
                <PersonPinIcon className="user-icon" />
                <Link to="/login">Sign in</Link>
            </button>
        </div>
    )
};

export default NoSubscriptions;

import './shorterSidebar.scss';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ShorterSidebar = () => {
    const { currentUser } = useSelector(state => state.user);

    return (
        <div className="shorter-sidebar-container">
            <div className="flex-container-sidebar">
                <Link to="/"><HomeIcon />Home</Link>
            </div>
            <div className="flex-container-sidebar">
                <Link to="/trends"><ExploreIcon />Explore </Link>
            </div>
            <div className="flex-container-sidebar">
                {
                    currentUser ?
                        <Link to="/feed/subscriptions"><SubscriptionsIcon />Subscriptions</Link>
                        :
                        <Link to="/subscriptions"><SubscriptionsIcon />Subscriptions</Link>
                }
            </div>

        </div>
    )
};

export default ShorterSidebar;

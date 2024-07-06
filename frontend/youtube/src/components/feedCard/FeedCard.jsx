import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ReactPlayer from 'react-player';
import Channel from '../channel/Channel';

const FeedCard = ({ video, handleHover, showInfo }) => {
    const { _id, isHovered, videoUrl, imgUrl, title, userId, views, createdAt } = video;
    return (
        <div>
            <div className="wrapper"
                onMouseEnter={() => handleHover(_id, true)}
                onMouseLeave={() => handleHover(_id, false)}
            >
                {
                    isHovered ? (
                        <div className="react-player-container">
                            <ReactPlayer
                                controls
                                playing
                                width="100%"
                                height="100%"
                                muted
                                className="react-player"
                                url={videoUrl}

                            />
                        </div>
                    ) : (
                        <LazyLoadImage
                            effect="blur"
                            src={imgUrl.startsWith('https://firebasestorage') ? imgUrl : `https://img.youtube.com/vi/${imgUrl}/hqdefault.jpg`}
                            alt={title} className="youtube-img"
                        />
                    )}
            </div>
            <Channel id={userId} title={title} views={views} createdAt={createdAt} videoId={_id} showInfo={showInfo} />
        </div>
    )
};

export default FeedCard;

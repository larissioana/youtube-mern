import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    EmailShareButton,
    TwitterIcon,
    LinkedinIcon,
    EmailIcon,
    WhatsappIcon,
} from 'react-share';
import CloseIcon from '@mui/icons-material/Close';

const Share = ({ shareUrl, setIsShareOpen, handleCopy, copied }) => {
    return (
        <div className="share-container">
            <CloseIcon className="share-close" onClick={() => setIsShareOpen(false)} />
            <h2>Share</h2>
            <div className="share-buttons">
                <TwitterShareButton url={shareUrl} className="social-media">
                    <TwitterIcon size={62} round />
                    Twitter
                </TwitterShareButton>
                <WhatsappShareButton url={shareUrl} className="social-media">
                    <WhatsappIcon size={62} round />
                    <p>WhatsApp</p>
                </WhatsappShareButton>
                <LinkedinShareButton url={shareUrl} className="social-media">
                    <LinkedinIcon size={62} round />
                    Linkedin
                </LinkedinShareButton>
                <EmailShareButton url={shareUrl} className="social-media">
                    <EmailIcon round size={62} />
                    Email
                </EmailShareButton>
            </div>
            <div className="input-container">
                <input type="text" value={shareUrl} readOnly />
                <CopyToClipboard text={shareUrl} onCopy={handleCopy}>
                    <button className="copy-btn">{copied ? 'Copied!' : 'Copy'}</button>
                </CopyToClipboard>
            </div>
        </div>
    )
};

export default Share;

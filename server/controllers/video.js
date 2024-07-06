import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res, next) => {
    try {
        const newVideo = new Video({ userId: req.user.id, ...req.body })
        const video = await newVideo.save();
        res.status(200).json(video);
    } catch (err) {
        next(err)
    }
};

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found"))
        if (req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            })
            res.status(200).json(updatedVideo);
        } else {
            return next(createError(403, "You can update only your video"))
        }
    } catch (err) {
        next(err)
    }
};

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found!"))
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id);
            res.status(200).json("The video has been deleted!")
        } else {
            return next(createError(403, "You can delete only your video"))
        }
    } catch (err) {
        next(err)
    }
};

export const getVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id;

        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!updatedVideo) {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.status(200).json(updatedVideo);
    } catch (err) {
        next(err);
    }
};


export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        });
        res.status(200).json("The view has been increased")
    } catch (err) {
        next(err)
    }
};
export const randomVideo = async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size: 60 } }]);
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

/* export const randomVideo = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 9; // default to 10 videos per page if not provided

    try {
        const videos = await Video.aggregate([
            { $sample: { size: pageSize * page } }
        ]).limit(pageSize).skip((page - 1) * pageSize);

        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};
 */
export const trendVideo = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 });
        res.status(200).json(videos);
    } catch (err) {
        next(err)
    }
};

export const getMusicVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({ category: 'music' });
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const getScienceVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({ category: 'science' });
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const getSportsVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({ category: 'sports' });
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const getCodingVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({ category: 'coding' });
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const getMoviesVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({ category: 'movies' });
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const subscribedChannel = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(subscribedChannels.map((channelId) => {
            return Video.find({ userId: channelId })
        }));
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
        next(err)
    }
};

export const getByTag = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(200).json(videos);
    } catch (err) {
        next(err)
    }
};

export const searchedVideos = async (req, res, next) => {
    const { q: query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required." });
    }

    try {
        const videos = await Video.find({
            title: { $regex: query, $options: "i" }
        }).limit(80);

        if (videos.length === 0) {
            return res.status(404).json({ message: "No videos found matching the query." });
        }

        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const findSubscribedVideos = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const currentUser = await User.findById(userId).populate('subscribedVideos');
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const subscribedVideosDetails = await Video.find({ _id: { $in: currentUser.subscribedVideos } });

        res.status(200).json(subscribedVideosDetails);
    } catch (err) {
        console.error('Error fetching subscribed videos:', err);
        next(err);
    }
};

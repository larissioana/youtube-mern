import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const updateUser = async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(createError(401, "You are not authenticated!"));
    }

    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            res.status(200).json(updatedUser);
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, "You can update only your account!"));
    }
};

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("User has been deleted!")
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can delete only your account!"))
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        next(err)
    }
};

/* export const subscribe = async (req, res, next) => {
    const { videoId } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id, subscribedVideos: videoId }
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }

        }, { new: true })
        res.status(200).json("Subscription successfull")
    } catch (err) {
        next(err)
    }
};
 */
/* 
export const unsubscribe = async (req, res, next) => {
    const { videoId } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id, subscribedVideos: videoId }
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        })
        res.status(200).json("Unsubscription successfull")
    } catch (err) {
        next(err)
    }
}; */

export const subscribe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 },

        }, {
            new: true
        });
        res.status(200).json("Subscription successfull.")
    } catch (err) {
        next(err);
    }
};

export const unsubscribe = async (req, res, next) => {
    try {
        try {
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { subscribedUsers: req.params.id },
            });
            await User.findByIdAndUpdate(req.params.id, {
                $inc: { subscribers: -1 },
            }, {
                new: true
            });
            res.status(200).json("Unsubscription successfull.")
        } catch (err) {
            next(err);
        }
    } catch (err) {
        next(err);
    }
};

export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        }, {
            new: true
        })
        res.status(200).json("The video has been liked.")
    } catch (err) {
        next(err)
    }
};

export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        }, {
            new: true
        })
        res.status(200).json("The video has been disliked.")
    } catch (err) {
        next(err)
    }
};

export const subscribedUsers = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const currentUser = await User.findById(userId).populate('subscribedUsers', "name img"); // Populate subscribedUsers with username
        if (!currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const subscribedUserDetails = await User.find({ _id: { $in: currentUser.subscribedUsers } }, 'name img');

        res.status(200).json(subscribedUserDetails);
    } catch (err) {
        console.error('Error fetching subscribed users:', err);
        next(err);
    }
};

export const getUsersByIds = async (req, res, next) => {
    try {
        const { ids } = req.body;
        const users = await User.find({ _id: { $in: ids } }).select('name img email subscribers');
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

export const getUserId = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return next(createError(404, "User not found!"));
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

export const getUserVideos = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const videos = await Video.find({ userId: userId });
        if (!videos) return next(createError(404, "No videos found for this user!"));
        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

export const subscribeUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id }
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }

        }, { new: true })
        res.status(200).json("Subscription successfull")
    } catch (err) {
        next(err)
    }
};

export const unsubscribeUser = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id }
        })
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        })
        res.status(200).json("Unsubscription successfull")
    } catch (err) {
        next(err)
    }
};

export const getUserSubscribedVideos = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const subscribedUserIds = user.subscribedUsers;

        if (subscribedUserIds.length === 0) {
            return res.status(200).json([]);
        }

        const videos = await Video.find({ userId: { $in: subscribedUserIds } });

        res.status(200).json(videos);
    } catch (err) {
        next(err)
    }
}
import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "all"
    },
    imgUrl: {
        type: String,
    },
    videoUrl: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
    },
    dislikes: {
        type: [String],
        default: []
    },
    createdBy: {
        type: String
    },

}, {
    timestamps: true

});

export default mongoose.model("Video", VideoSchema)
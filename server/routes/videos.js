import express from "express";
import { addVideo, addView, deleteVideo, getCodingVideos, findSubscribedVideos, getByTag, getMoviesVideos, getMusicVideos, getScienceVideos, getSportsVideos, getVideo, randomVideo, searchedVideos, subscribedChannel, trendVideo, updateVideo } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.put("/view/:id", addView);
router.get("/trends", trendVideo);
router.get("/music", getMusicVideos);
router.get("/science", getScienceVideos);
router.get("/movies", getMoviesVideos);
router.get("/sports", getSportsVideos);
router.get("/coding", getCodingVideos);
router.get("/random", randomVideo);
router.get("/sub", verifyToken, subscribedChannel);
router.get("/tags", getByTag);
router.get("/search", searchedVideos);
router.get("/findSubscribedVideos", verifyToken, findSubscribedVideos);

export default router;
import express from "express";
import { deleteUser, dislike, getUserSubscribedVideos, getUser, getUsersByIds, getUserVideos, getUserId, like, subscribe, subscribedUsers, unsubscribe, updateUser } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/find/:id", getUser);
router.put("/subscribe/:id", verifyToken, subscribe);
router.get("/subscribed", verifyToken, subscribedUsers);
router.put("/unsubscribe/:id", verifyToken, unsubscribe);
router.put("/like/:videoId", verifyToken, like);
router.put("/dislike/:videoId", verifyToken, dislike);
router.post("/findMultipleUsers", getUsersByIds);
router.get("/:id", getUserId);
router.get("/:id/videos", getUserVideos);
router.get("/:userId/subscribedVideos", verifyToken, getUserSubscribedVideos);


export default router;
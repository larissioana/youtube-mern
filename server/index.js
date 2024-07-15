import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"

dotenv.config();
const app = express();

app.use(cors({
	origin: 'https://youtube-mern-git-main-larissioanas-projects.vercel.app',
	credentials: true
}));



const connect = async () => {
	try {
		await mongoose.connect(process.env.MONGO);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error(error);
	}
};

app.use(express.json());
app.use(cookieParser());
const frontendPath = path.join(__dirname, '../frontend/youtube/dist');
app.use(express.static(frontendPath));


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

app.get('*', (req, res) => {
	res.sendFile(path.join(frontendPath, 'index.html'));
});


app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || "Something went wrong!";
	return res.status(status).json({
		success: false,
		status,
		message
	})
});
const PORT = process.env.PORT || 3003;
app.listen(3003, async () => {
	await connect();
	console.log("Server is running on port 3003")
});

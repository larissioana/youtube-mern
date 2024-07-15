
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (password.length < 6) {
            return res.status(400).send("Password should be at least 6 characters long.")
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        res.status(200).send("User has been created!")
    } catch (err) {
        next(err)
    }
};

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name });
        if (!user) return next(createError(404, "User not found!"));

        const isPaswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPaswordCorrect) return next(createError(400, "Wrong credentials!"))

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password, ...otherDetails } = user._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            domain: "https://youtube-mern-git-main-larissioanas-projects.vercel.app"

        }).status(200).json(otherDetails);
    } catch (err) {
        next(err)
    }
};

export const signout = (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: false,
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Successfully logged out!' })
};
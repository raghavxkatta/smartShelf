import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        await newUser.save()

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server error" })
    }   
}


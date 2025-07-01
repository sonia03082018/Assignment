const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotEnv = require("dotenv")
dotEnv.config();
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        
        const decodedPassword = Buffer.from(password, 'base64').toString('utf-8')
        if(!username || !email || !password) {
            return res.status(400).json({message:"All fields are required"})
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already registered"})
        }
        const hashedPassword = await bcrypt.hash(decodedPassword, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        console.log('registeredUser', user)
        await user.save()
        res.status(200).json(user)
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: `server error` })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: `server error` })
    }
}

const loginUser = async(req, res) => {
    try{
        
    const {  email, password } = req.body    
    const decodedPassword = Buffer.from(password, 'base64').toString('utf-8')
        if( !email || !password) {
            return res.status(400).json({message:"All fields are required"})
        }
    console.log(req.body)
    const user = await User.findOne({email});
    console.log(user);
    if(!user){
        return res.status(400).json({message: `User not exists`})
    }
    const isMatch = await bcrypt.compare(decodedPassword, user.password);
    if(!isMatch) {
        return res.status(400).json({message:"Invalid password"})
    }
    const token = jwt.sign({userID:user._id}, process.env.JWT_SECRET,{
        expiresIn:'1d',

    });
    res.cookie("token", token,{
        httpOnly:true,
        secure:false,
        sameSite:"Lax",
        maxAge:1*24*60*60*1000
    })
    res.status(200).json({
        username: user.username,
        message: "Login Successfull",
        token
    })
    } catch (error) {
         console.log("error", error)
        res.status(500).json({ message: `server error` })
    }
    
}

const getUserDetails = async(req, res) => {
    try{
        const token = req.cookie.token;
        if(!token){
            return res.status(401).json({message:"Token missing"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id:decoded.userID})
        if(!user){
              return res.status(404).json({message:"user not found"})
        }
        res.status(200).json(user);
    }catch (error) {
         console.log("error", error)
        res.status(500).json({ message: `server error` })
    }
}

const logout = async(req, res) => {
    try{
        res.cookie("token","", {
            httpOnly: true,
            secure:false,
            sameSite: "Lax",
            expires: new Date(0) 
        })
        console.log(res)
         res.status(200).json({message: "Logout successful"});
    }catch (error) {
         console.log("error", error)
        res.status(500).json({ message: `server error` })
    }
}
module.exports = { createUser, getUsers, loginUser, getUserDetails, logout }
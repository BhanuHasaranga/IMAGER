import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                sucess: false, 
                message: "All fields are required"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.json({
            success: true,
            token,
            user: {name: user.name},
            message: "User registered successfully"
        })

    } catch (error) {
        console.error(error)
        res.json({success: false, message: error.message})
    }
}

const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        
        if (isMatch){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            return res.json({
                success: true,
                token,
                user: {name: user.name},
                message: "User logged in successfully"
            })
        }else{
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }
    } catch (error) {
        console.error(error)
        res.json({success: false, message: error.message}) 
    }
}

export {registerUser, loginUser}
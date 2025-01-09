import FormData from "form-data"
import userModel from "../models/userModel.js"
import axios from "axios"


export const generateImage = async (req, res) => {
    try {
        
        const {userId, prompt} = req.body
        const user = await userModel.findById(userId)

        if(!user || !prompt){
            return res.status(400).json({success: false, message: "Missing Details"})
        }

        if(user.creditBalance === 0 || user.creditBalance < 0){
            return res.status(400).json({
                success: false,
                message: "Insufficient Credit balance",
                creditBalance: user.creditBalance
            })
        }

        const formData = new FormData()
        formData.append("prompt", prompt)

        const { data } = await axios.post(
          "https://clipdrop-api.co/text-to-image/v1",
          formData,
          {
            headers: {
              "x-api-key": process.env.CLIPDROP_API,
            },
            responseType: "arraybuffer",
          }
        )

        const base64Image = Buffer.from(data, "binary").toString("base64")
        const resultImage = `data:image/png;base64,${base64Image}`
        await userModel.findByIdAndUpdate(user._id, {
            creditBalance: user.creditBalance - 1
        })
        res.json({
            success: true,
            creditBalance: user.creditBalance - 1,
            resultImage,
            message: "Image generated successfully"
        })

    } catch (error) {
        console.error(error)
        res.json({success: false, message: error.message}) 
    }
}
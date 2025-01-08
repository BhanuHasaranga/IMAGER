import jwt from 'jsonwebtoken'

const userAuth = async (req, res, next) => {
    const {token} = req.headers;

    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized token. Login Again."
        });
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecoded.id){
            req.body.userId = tokenDecoded.id;
        }else{
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Login Again."
            });
        }
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid Token. Login Again."
        });
    }
};

export default userAuth;
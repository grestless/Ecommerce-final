import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from './asyncHandler.js'

const authenticate  = asyncHandler (async (req,res, next) => {
    let token;
    //leer JWT de la 'jwt' cookie
    token = req.cookies.jwt

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select('-password');
            next();

        }catch (error){
            res.status(401)
            throw new Error("No autorizado, token fallado")
        }
    }else{
        res.status(401)
        throw new Error("No autorizado, no token") 
    }
});


//check for the admin
const authorizedAdmin = (req,res,next) => {
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401).send("No autorizado como administrador")
    }
};

export {authenticate,authorizedAdmin};
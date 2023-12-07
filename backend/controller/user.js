const express = require("express");
const path = require("path");
const router = express.Router();
const {upload} = require("../multer");
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

router.post("/create-user", upload.single("file"), async (req,res,next) => {
    const {name,email,password} = req.body;
    const userEmail = await User.findOne({email});

      try{  
        if(userEmail){
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`;
            console.log(filename);
            fs.unlink(filePath, (err) => { 
                if(err){
                    console.log(err);
                    res.status(500).json({message:"Error deleting file"});
                }else{
                    res.json({message: "File deleted successfully"});
                }
            });
            
            return next(new ErrorHandler("User already exists.", 400));
        }

        const filename = req.file.filename;
        const fileUrl = path.join(filename);
        
        const user = {
            name: name,
            email: email,
            password: password,
            avatar: fileUrl,
        };
        
        // create activation token
        const createActivationToken = (user) => {
            return jwt.sign(user, process.env.ACTIVATION_SECRET,{
            expiresIn: "5m",
            })
        }

        const activationToken = createActivationToken(user);

        const activationUrl = `http://localhost:3000/activation/${activationToken}`;

        try{
            await sendMail({
                email:user.email,
                subject:"Activate your account",
                message:`Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
            })
            res.status(201).json({
                success:true,
                message: `please check your email:- ${user.email} to activate your account!`,
            });
        } catch (error){
            return next(new ErrorHandler(error.message, 500))
        }
        const newUser = await User.create(user);
        res.status(201).json({
            success: true,
            newUser,
        });
        
    }catch (error){
        return next(new ErrorHandler(error.message),400);
    }

   
});


// activate user 
module.exports = router;
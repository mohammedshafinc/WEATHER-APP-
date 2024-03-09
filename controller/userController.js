const Mongoose = require("mongoose");
const User = require("../models/userRegistration");
const bcrypt = require("bcrypt");

module.exports = {
    // addig new user
    userRegistration: async (req, res) => {
        console.log(req.body);
        const { fullName, email, password } = req.body;
        try {
            const userExist = await User.findOne({ email });
            if (userExist) {
                return res.status(409).json({ message: "email already exist" });
            } else {
                const newUser = new User({
                    fullName,
                    email,
                    password,
                });
                await newUser.save();
                res.status(200).json({
                    message: "user added suucesfully",
                    newUser,
                });
            }
        } catch (error) {
            console.log("error in user registration", error);
        }
    },
    userLogin:async (req, res) => {
        console.log(req.body);
        const { email, password} = req.body
        try {

            const existingUser = await User.findOne({email})
            if(!existingUser){
                return res.status(404).json({message:'user does not exist '})
            }
            const passwordMatch = await bcrypt.compare(
                password, existingUser.password);
            if (!passwordMatch) {
              return res.status(401).json({message: 'password not match'});
            }

            res.status(200).json({message: 'user logged suucesfully' , existingUser})
            
        } catch (error) {
            console.log('error in user login' , error);
        }
    },
};

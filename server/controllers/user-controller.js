const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    try{
        auth.verify(req, res, async function () {
                const loggedInUser = await User.findOne({ _id: req.body.userId });
                console.log("lg in user : " + loggedInUser);
                if(!loggedInUser){
                    return res.status(200).json({
                        loggedIn: false,
                        user: null
                    }).send();
                }

                return res.status(200).json({
                    loggedIn: true,
                    user: {
                        firstName: loggedInUser.firstName,
                        lastName: loggedInUser.lastName,
                        email: loggedInUser.email
                    }
                }).send();
        })
    }catch(e){
        console.log("\nbruh\n")
        console.error(e);
        res.status(500).send();
    }
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, passwordVerify } = req.body;
        if (!firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        try{
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }
        }catch(e){
            console.error(e);
        }
        
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email, passwordHash
        });
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
            }
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(email);
        const loggedInUser = await User.findOne({ email: email });
        const verifyPassword = await bcrypt.compare(password, loggedInUser.passwordHash);

        console.log("password verify : " + verifyPassword);
        if(!verifyPassword){
            return res
                .status(400)
                .json({ errorMessage: "Incorrect Password." });
        }

        const token = auth.signToken(loggedInUser);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200)
            .json({
                success: true,
                user: {
                    email:email
                }
            }).send();

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser
}
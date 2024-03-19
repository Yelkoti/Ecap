import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js';

//@desc     Auth user and get token
//@route    Post /users/login
//@access   Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))) {
        //add cookie
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else {
        res.status(404);
        throw new Error('Invalid email or password');
    }
});

//@desc     Register a user
//@route    Post /users
//@access   Public
const userRegisteration = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body;
    const userExit = await User.findOne({email});
    if(userExit) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({
        name,
        email,
        password
    });
    if(user) {
        //add cookie
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

//@desc     logout the user and also clears the cookies
//@route    Post /users/logout
//@access   Public
const logoutUser = asyncHandler(async(req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({message: 'Logged out successfully'});
});

//@desc     Get user profile
//@route    Get /users/profile
//@access   Public
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});

//@desc     update user profile
//@route    Put /users/profile
//@access   Public
const updateUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    }
    else {
        res.status(404);
        throw new Error('Can not able to update');
    }
});

//@desc     Get users
//@route    Get /users
//@access   Public
const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find({});
    if(users) {
        res.status(200).json(users);
    }
    else {
        res.status(404);
        throw new Error('Users not found');
    }
});

//@desc     Get user by id
//@route    Get /users/:id
//@access   Public
const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if(user) {
        res.status(200).json(user);
    }
    else {
        res.status(404)
        throw new Error('user not found');
    }
});

//@desc     update user by admin
//@route    Put /users/:id
//@access   Public
const updateUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});

//@desc     delete user
//@route    Delete /users/:id
//@access   Public
const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        if(user.isAdmin) {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await User.deleteOne({_id: user._id});
        res.status(200).json({message: "user deleted successfully"});
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});

export {
    authUser,
    userRegisteration,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
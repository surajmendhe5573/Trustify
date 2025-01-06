const User= require('../models/user.model');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

const signUp= async(req, res)=>{
    try {
        const {name, email, password, age, role}= req.body;

        if(!name || !email || !password || !age){
            return res.status(400).json({message: 'All fields are required'});
        }

        const userExist= await User.findOne({email});
        if(userExist){
            return res.status(409).json({message: 'User already exist'});
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const newUser= new User({
            name, 
            email,
            password: hashedPassword,
            age,
            role
        });

        await newUser.save();
        res.status(201).json({message: 'User created successfully', user:{name, email, age, role}});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const login= async(req, res)=>{
    try {
        const {email, password}= req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Email and Password are required'});
        }

        const userExist= await User.findOne({email});
        if(!userExist){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const isMatch= await bcrypt.compare(password, userExist.password);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token= jwt.sign({id: userExist._id, role: userExist.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({message: 'Logged in successfully', token});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const getAllUsers= async(req, res)=>{
    try {

        // Only allow admins to view all users 
        if(req.user.role !== 'Admin'){
            return res.status(403).json({message: 'Access Denied '});
        }

        const users= await User.find({}, '-password');
        res.status(200).json({message: 'Users fetched successfully', data: users});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const updateUser= async(req, res)=>{
    try {
        const {name, email, password, age, role}= req.body;
        const {id}= req.params;

        // Allow users to update their own details or allow admins to update any user
        if (req.user.role !== 'Admin' && req.user._id.toString() !== id) {
            return res.status(403).json({ message: 'You are not authorized to update this user' });
        }

        const updates= {};

        if(name) updates.name= name;
        if(age) updates.age= age;
        if(role) updates.role= role;

        if(email){
            const userExist= await User.findOne({email});
            if(userExist && userExist._id.toString() !== id){
                return res.status(409).json({message: 'Email is already taken by another user'});
            }
            updates.email= email;
        }

        if(password){
            const hashedPassword= await bcrypt.hash(password, 10);
            updates.password= hashedPassword;
        }

        const updateUser= await User.findByIdAndUpdate(id, updates, {new:true});
        if(!updateUser){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User updated successfully', user:updateUser});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const deleteUser= async(req, res)=>{
    try {

        const {id}= req.params;

        if(req.user.role  !== 'Admin' && req.user._id.toString() !== id){
            return res.status(403).json({message: 'You are not authorized to delete this user'});
        }

        const deleteUser= await User.findByIdAndDelete(id);
        if(!deleteUser){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User deleted successfully'});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports= {signUp, login, getAllUsers, updateUser, deleteUser};
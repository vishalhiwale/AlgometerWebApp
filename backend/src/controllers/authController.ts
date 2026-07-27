import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from '../models/User';
import { request } from "node:http";

export const signup = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser) {
            res.status(400).json({
                message: "User already exists"
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET!,
            {expiresIn: "7d"}
        );

        res.status(201).json({
            token,
            user
        });
    } catch (error) {
        
        console.error("Signup Error:", error);

        res.status(500).json({
            message: error instanceof Error ? error.message : "Server Error"
        });
    }
};

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            res.status(400).json({
                message: "Invalid Credentials"
            });
            return;
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){
            res.status(400).json({
                message: "Invalid Credentials"
            });
            return;
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET!,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            user,
        });

    } catch (error) {

        console.error("Signup Error:", error);

        res.status(500).json({
            message: error instanceof Error ? error.message : "Server Error"
        });
    }
};
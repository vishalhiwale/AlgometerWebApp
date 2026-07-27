import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { decode } from "node:punycode";

export interface AuthRequest extends Request{
    user?: {
        id: string;
    };
}

export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        res.status(401).json({
            message: "Not Authorized"
        });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as {id: string};

        req.user = decoded;

        next();
    }catch (error){
        res.status(401).json({
            message: "Invalid token"
        });
    }
};
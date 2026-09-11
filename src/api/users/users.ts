import { createUser, updateUser } from "../../db/queries/users.js";
import { Request, Response } from "express";
import { BadRequest } from "../errors.js";
import { hashPassword } from "../../auth/auth.js";
import { getBearerToken, validateJWT } from "../../auth/auth.js";
import { Unauthorized } from "../errors.js";
import { config } from "../../config.js";


export async function handlerCreateUser(req: Request, res: Response) {
    if (!req.body.email) {
        throw new BadRequest ("Missing email");
    }
    if (!req.body.password) {
        throw new BadRequest ("Missing password");
    }

    const user = {
        email: req.body.email,
        hashedPassword: await hashPassword(req.body.password),
    }

    const result = await createUser(user);
    return res.status(201).json({ 
        id: result.id,
        email: result.email,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        isChirpyRed: result.isChirpyRed,
    });

}

export async function handlerUpdateUser(req: Request, res: Response) {
    const token = getBearerToken(req);

    if (!token || req.body.password === undefined || req.body.email === undefined) {
        throw new Unauthorized("Invalid request");
    }
    
    validateJWT(token, config.apiConfig.secret);

    const hashedPassword = await hashPassword(req.body.password);
    const result = await updateUser(req.body.email, hashedPassword);
    return res.status(200).json({
        id: result.id,
        email: result.email,
        updatedAt: result.updatedAt,
        isChirpyRed: result.isChirpyRed,
    });
}

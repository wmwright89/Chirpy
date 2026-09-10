import { createUser } from "../../db/queries/users.js";
import { Request, Response } from "express";
import { BadRequest } from "../errors.js";

export async function handlerCreateUser(req: Request, res: Response) {
    if (!req.body.email) {
        throw new BadRequest ("Missing user's email address");
    }

    const user = {
        email: req.body.email,
    }

    const result = await createUser(user);
    return res.status(201).json({ 
        id: result.id,
        email: result.email,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
    });

}

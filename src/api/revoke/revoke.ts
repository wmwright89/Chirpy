import { Request, Response } from "express";
import { Unauthorized } from "../errors.js";
import { getBearerToken } from "../../auth/auth.js";
import { revokeToken } from "../../db/queries/tokens.js";

export async function handlerRevokeToken(req: Request, res: Response) {
    const token = getBearerToken(req);
    
    if (!token) {
        throw new Unauthorized("401");
    }
    await revokeToken(token);
    res.status(204).send();
}

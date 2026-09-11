import { Request, Response } from "express";
import { Unauthorized } from "../errors.js";
import { getBearerToken, makeJWT } from "../../auth/auth.js";
import { getRefreshToken } from "../../db/queries/tokens.js";
import { config } from "../../config.js";

export async function handlerRefreshToken(req: Request, res: Response) {
    const token = getBearerToken(req);
    
    const result = await getRefreshToken(token);

    if (result === undefined || result.revokedAt !== null) {
        throw new Unauthorized("401");
    }
    if (!result || !result.userId) {
        throw new Unauthorized("401");
    } else {
        const newToken = makeJWT(result.userId, 3600, config.apiConfig.secret) 
        res.header("Content-Type", "application/json");
        res.status(200).json({
        token: newToken,
        });
    }
}


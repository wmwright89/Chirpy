import { Request, Response } from "express";
import { checkPasswordHash } from "../../auth/auth.js";
import { getUser } from "../../db/queries/users.js";
import { Unauthorized } from "../errors.js";
import { makeJWT, makeRefreshToken } from "../../auth/auth.js";
import { config } from "../../config.js";
import { createRefreshToken } from "../../db/queries/tokens.js";

export async function handlerLogin(req: Request, res: Response) {
    const user = await getUser(req.body.email);
    if (user === undefined) {
        throw new Unauthorized("401 Unauthorized");
    }
    if (user.hashedPassword !== undefined) {
        console.log(user);
        const pwCheck = await checkPasswordHash(req.body.password, user.hashedPassword);
        if (pwCheck === false) {
            throw new Unauthorized("401 Unauthorized");
        } 

    } else {
        throw new Unauthorized("401 Unauthorized");
    }
    const refreshToken = makeRefreshToken();

    const safeUser = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token: makeJWT(user.id, 3600, config.apiConfig.secret),
        refreshToken: refreshToken,
        isChirpyRed: user.isChirpyRed,
    }

    await createRefreshToken(safeUser.id, refreshToken);

    res.header("Content-Type", "application/json");
    res.status(200).send(safeUser);
}

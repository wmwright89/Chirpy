import { Request, Response } from "express";
import { upgradeUser } from "../../../db/queries/users.js";
import { NotFound, Unauthorized } from "../../errors.js";
import { getAPIKey } from "../../../auth/auth.js";
import { config } from "../../../config.js";

export async function handlerUpgrade(req: Request, res: Response) {
    const apiKey = getAPIKey(req);
    if (!apiKey || apiKey !== config.apiConfig.polkaKey) {
        throw new Unauthorized("Incorrect Key");
    }
    if (req.body.event !== "user.upgraded") {
        return res.status(204).send();
    }
    if (req.body.event === "user.upgraded") {
        const foundUser = await upgradeUser(req.body.data.userId);
        if (foundUser === null) {
            throw new NotFound("User not found");
        }
        return res.status(204).send();
    }
}

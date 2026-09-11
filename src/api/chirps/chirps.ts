import { Request, Response } from "express";
import { BadRequest, NotFound, Forbidden } from "../errors.js";
import { createChirp, getChirps, deleteChirp, getSingleChirp } from "../../db/queries/chirps.js";
import { getRefreshToken } from"../../db/queries/tokens.js";
import { getBearerToken, validateJWT } from "../../auth/auth.js";
import { config } from "../../config.js";

export async function handlerValidate(req: Request, res: Response) {
   const token = getBearerToken(req);
   const validated = validateJWT(token, config.apiConfig.secret);
   const body = req.body; 

   if (body.body.length > 140) {
        throw new BadRequest("Chirp is too long. Max length is 140")
        } else {
        const words: string[] = body.body.split(/\s+/);
        for (let i in words) {
            const lower = words[i].toLowerCase();
            if (lower === "kerfuffle" || lower === "sharbert" || lower === "fornax"){
                words[i] = "****";
            }
        }
        const sentence: string = words.join(" ");

        const result = await createChirp(sentence, validated);

        res.header("Content-Type", "application/json");
        res.status(201).send(result);
   }
}

export async function handlerGetChirps(req: Request, res: Response) {
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    if (typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
        const result = await getChirps(authorId);
        if (!result) {
            throw new NotFound("404");
        }
        if (req.query.sort === "desc") {
            result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        res.header("Content-Type", "application/json");
        res.status(200).send(result);
    } else {
        const result = await getChirps();
        if (!result) {
            throw new NotFound("404");
        }
        if (req.query.sort === "desc") {
            result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        res.header("Content-Type", "application/json");
        res.status(200).send(result);
    }
}

export async function handlerDeleteChirp(req: Request, res: Response) {
    
    const token = getBearerToken(req);
    const validatedUser = validateJWT(token, config.apiConfig.secret);
 
    const chirpCheck = await getSingleChirp(req.params.chirpId as string);
    
    
    if (!chirpCheck) {
        throw new NotFound("Chirp not found");
    }
    if (Array.isArray(chirpCheck)) {
        throw new BadRequest("Invalid chirp ID");
    }
    if (validatedUser !== chirpCheck.userId) {
        throw new Forbidden("Not the user who created the chirp");
    }
    
    await deleteChirp(chirpCheck.id, validatedUser);
    res.status(204).send();
}

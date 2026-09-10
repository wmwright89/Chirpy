import { Request, Response } from "express";
import { BadRequest } from "../errors.js";

export async function handlerValidate(req: Request, res: Response) {
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

        res.header("Content-Type", "application/json");
        const result = JSON.stringify({ cleanedBody: sentence });
        res.status(200).send(result);
   }
}

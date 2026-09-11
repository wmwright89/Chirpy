import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { NotFound, Forbidden, Unauthorized, BadRequest } from "./errors.js";

export function middlewareLogResponses(
    req: Request, 
    res: Response, 
    next: NextFunction): void {
        res.on("finish", () => {
            if (res.statusCode > 299) {
                console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
            }
        });
        next();
}

export function middlewareMetricsInc(
    req: Request, 
    res: Response, 
    next: NextFunction): void {
        config.apiConfig.fileserverHits += 1;
        next();
}


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof NotFound) {
        return res.status(404).json({ error: err.message });
    }
    if (err instanceof Forbidden) {
        return res.status(403).json({ error: err.message });
    }
    if (err instanceof Unauthorized) {
        return res.status(401).json({ error: err.message });
    }
    if (err instanceof BadRequest) {
        return res.status(400).json({ error: err.message });
    }
    else {
        return res.status(500).json({ error: "Something went wrong on our end" });
    }
}

export function wrapAsync(handler: (req: Request, res: Response) => Promise<any> ) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try{
            await handler(req, res);
        } catch (err) {
            next(err);
        }
    };
}

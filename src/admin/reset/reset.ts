import { Request, Response } from "express";
import { config } from "../../config.js";
import { deleteUsers } from "../../db/queries/users.js";
import { Forbidden } from "../../api/errors.js";

export async function handlerResetMetrics(req: Request, res: Response): Promise<void> {
    if (config.apiConfig.platform !== "dev") { 
        throw new Forbidden("403 Forbidden");
    }
    await deleteUsers();
    res.set({
        'Content-Type': 'text/plain; charset=utf-8'
        });
    config.apiConfig.fileserverHits = 0;
    res.send();
}


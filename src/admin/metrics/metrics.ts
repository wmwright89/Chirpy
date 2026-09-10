import { Request, Response } from "express";
import { config } from "../../config.js";

export async function handlerMetrics(req: Request, res: Response): Promise<void> {
    res.set({
        'Content-Type': 'text/html; charset=utf-8'
        });
    const html = `
      <html>
         <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${config.apiConfig.fileserverHits} times!</p>
        </body>
        </html>  
    `;
    res.send(html);
}


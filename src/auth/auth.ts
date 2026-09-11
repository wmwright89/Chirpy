import argon2 from "argon2"; 
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { randomBytes } from "crypto";
import { Unauthorized } from "../api/errors.js";

export async function hashPassword(password: string): Promise<string> {
    const hashedPassword = await argon2.hash(password)
    return hashedPassword;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    const isPasswordCorrect = await argon2.verify(hash, password);
    return isPasswordCorrect;
}


export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

    const issuedAt = Math.floor(Date.now()/1000);
    const claims: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: issuedAt,
        exp: issuedAt + expiresIn
    }

    return jwt.sign(claims, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const decoded = jwt.verify(tokenString, secret);
        if (typeof decoded === "string" || !decoded.sub) {
            throw new Unauthorized("Invalid token");
        }
        return decoded.sub as string;
    } catch {
        throw new Unauthorized("Invalid token");
    }
}

export function getBearerToken(req: Request): string {
    const header = req.get("Authorization");
    if (!header) {
        throw new Unauthorized("Authorization error");
    }
    const token = header.replace("Bearer", "").trim();
    return token;
}

export function makeRefreshToken() {
    const token = randomBytes(32).toString('hex');
    return token;
}

export function getAPIKey(req: Request) {
    const header = req.get("Authorization");
    if (!header) {
        throw new Unauthorized("Authorization error");
    }
    const apiKey = header.replace("ApiKey", "").trim();
    return apiKey;
}

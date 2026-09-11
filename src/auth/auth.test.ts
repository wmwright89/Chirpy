import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash, getBearerToken, getAPIKey } from "./auth.js";
import { Request } from "express";

describe("Password Hasing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it("should return true for the correct password", async () => {
        const result = await checkPasswordHash(password1, hash1);
        expect(result).toBe(true);
    });
});

describe("JWT Authentication", () => {
    it("should create and validate a valid JWT", () => {
        const secret = "supersecret";
        const userID = "user-123";

        const token = makeJWT(userID, 300, secret);
        const result = validateJWT(token, secret);

        expect(result).toBe(userID);
    });

    it("should reject a token signed with the wrong secret", () => {
        const secret1 = "supersecret";
        const secret2 = "wrongsecret";
        const userID = "user-123";

        const token = makeJWT(userID, 300, secret1);

        expect(() => {
            validateJWT(token, secret2);
        }).toThrow();
    });

    it("should reject an expired token", () => {
        const secret = "superserect";
        const userID = "user-123";

        const token = makeJWT(userID, -300, secret);

        expect(() => {
            validateJWT(token, secret);
        }).toThrow();
    });
});

describe("Bearer Token", () => {
    it("Should return a token", () => {
        const req = {
            get: (name: string) => {
                if (name === "Authorization") {
                    return "Bearer example-token";
                }
                return undefined;
            },
        } as unknown as Request;

        const result = getBearerToken(req);
        expect(result).toBe("example-token");
    });
});

describe("API Key", () => {
    it("Should return API Key", () => {
        const req = {
            get: (name: string) => {
                if (name === "Authorization") {
                    return" ApiKey example-key";
                }
                return undefined;
            },
        } as unknown as Request;

        const result = getAPIKey(req);
        expect(result).toBe("example-key");
    });
});

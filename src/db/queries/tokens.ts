import { db } from "../index.js";
import { and, eq, isNull, gt, sql } from "drizzle-orm";
import { NewToken, refreshTokens } from "../schema.js";


export async function createRefreshToken(user: string, token: string) {
    await db
        .insert(refreshTokens)
        .values({
            token: token,
            userId: user,
            expiresAt: sql`now() + interval '60 days'`,
        });
}

export async function getRefreshToken(token: string) {
    const[result] = await db
        .select()
        .from(refreshTokens)
        .where(
            and(
                eq(refreshTokens.token, token),
                isNull(refreshTokens.revokedAt),
                gt(refreshTokens.expiresAt, sql`now()`)
            )
        );
    return result;
}

export async function revokeToken(token: string) {
    await db
        .update(refreshTokens)
        .set({
            revokedAt: sql`now()`,
            updatedAt: sql`now()`,
        })
        .where(eq(refreshTokens.token, token));
}

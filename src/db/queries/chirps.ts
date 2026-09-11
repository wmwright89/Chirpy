import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { asc, eq, and } from "drizzle-orm";

export async function createChirp(body: string, user: string) {
  const [result] = await db
    .insert(chirps)
    .values({
        body: body, 
        userId: user,
    })
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirps(authorId?: string) {
    if (authorId === undefined) {
        const result = await db
            .select()
            .from(chirps);
        return result;
    }
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, authorId));

    return result;
}

export async function getSingleChirp(chirpId: string) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    return result;
}

export async function deleteChirp(chirpId: string, validatedUser: string) {
    await db 
        .delete(chirps)
        .where(and(
            eq(chirps.id, chirpId),
            eq(chirps.userId, validatedUser)
        ));
}

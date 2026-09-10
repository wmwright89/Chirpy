import type { MigrationConfig } from "drizzle-orm/migrator";


process.loadEnvFile();

function envOrThrow(key: string): string {
    if (key in process.env) {
        return process.env[key] as string;
    }
    throw new Error(`Missing enivornment variable ${key}`);
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
    dbURL: string;
    migration: MigrationConfig;
};

type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
};

type CombinedConfig = {
    apiConfig: APIConfig;
    dbConfig: DBConfig
}

export const config: CombinedConfig = {
    apiConfig: {
        fileserverHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"),
    },
    dbConfig: {
        dbURL: envOrThrow("DB_URL"),
        migration: migrationConfig,
    }
}

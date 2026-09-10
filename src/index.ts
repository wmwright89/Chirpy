import express, { type Express, type Request, type Response } from 'express';
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc, errorHandler } from "./api/middleware.js";
import { handlerMetrics }  from "./admin/metrics/metrics.js";
import { handlerResetMetrics } from "./admin/reset/reset.js";
import { handlerValidate } from "./api/validate_chirp/validate.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateUser } from "./api/users/users.js";

const migrationClient = postgres(config.dbConfig.dbURL, {max:1});
await migrate(drizzle(migrationClient), config.dbConfig.migration);

const app: Express = express();
const port = 8080;

app.use("/app", middlewareMetricsInc);
app.use(middlewareLogResponses);
app.use("/app", express.static("./src/app"));
app.use(express.json());

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerResetMetrics);
app.post("/api/users", handlerCreateUser);

app.post("/api/validate_chirp", async (req, res) => {
    await handlerValidate(req, res);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

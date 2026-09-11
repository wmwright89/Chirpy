import express, { type Express, type Request, type Response } from 'express';
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc, errorHandler, wrapAsync } from "./api/middleware.js";
import { handlerMetrics }  from "./admin/metrics/metrics.js";
import { handlerResetMetrics } from "./admin/reset/reset.js";
import { handlerValidate, handlerGetChirps, handlerDeleteChirp } from "./api/chirps/chirps.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateUser, handlerUpdateUser } from "./api/users/users.js";
import { handlerLogin } from "./api/login/login.js";
import { handlerRefreshToken } from "./api/refresh/refresh.js";
import { handlerRevokeToken } from "./api/revoke/revoke.js";
import { handlerUpgrade } from "./api/polka/webhooks/webhooks.js";

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
app.post("/api/login", handlerLogin);
app.post("/api/refresh", handlerRefreshToken);
app.post("/api/revoke", handlerRevokeToken);
app.post("/api/polka/webhooks/", handlerUpgrade);

app.post("/api/chirps", wrapAsync(handlerValidate));
app.get("/api/chirps/", handlerGetChirps);
app.get("/api/chirps/:chirpId", handlerGetChirps);
app.delete("/api/chirps/:chirpId", wrapAsync(handlerDeleteChirp));

app.put("/api/users", wrapAsync(handlerUpdateUser));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

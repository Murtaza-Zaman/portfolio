import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

try {
  await connectDatabase();
  console.log("Connected to MongoDB database successfully.");
} catch (err) {
  console.warn(`[MongoDB Warning] Could not connect to database (${err.message}).`);
}

app.listen(env.port, () => {
  console.log(`Portfolio API listening on http://localhost:${env.port}`);
});



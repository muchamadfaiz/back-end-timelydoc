import express from "express";
import router from "./routes/api";

const app = express();

const PORT = 3000;

// Middleware
app.use("/api", router);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import prisma from "./utils/prisma";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

const PORT = 3000;

// middleware(body-parser)
app.use(bodyParser.json());

// middleware (router)
app.use("/api", router);

app.use(errorMiddleware.serverRoute());
app.use(errorMiddleware.serverError());

async function init() {
  try {
    await prisma.$connect();
    console.log("connected to database");

    app.listen(3000, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database", error);
    process.exit(1);
  }
}

init();

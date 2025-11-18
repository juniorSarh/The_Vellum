import express, {Request, Response} from "express";
import {testConnection} from "../Backend/src/config/db";

const app = express();
const PORT = process.env.PORT || 4040;

app.get("/", (req :Request, res: Response) => {
  res.send("Hello World!");
});

const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Server is listening on port http://localhost:${PORT}`);
  });
};
 startServer();

import express, {Request, Response} from "express";
<<<<<<< HEAD
import {testConnection} from "../Backend/src/config/db";
=======
import dotenv from "dotenv";
dotenv.config();

import {neon} from "@neondatabase/serverless";

// Initialize Neon client
export const sql = neon(process.env.DATABASE_URL!); 

>>>>>>> dev

const app = express();
const PORT = process.env.PORT || 4040;

app.get("/", async (req, res) => {
   try {
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id serial PRIMARY KEY,
        name text,
        email text,
        lastname text
      );
    `;
    const customers = await sql`SELECT * FROM customers;`;
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error" );
  }
  res.send("Hello, The Vellum!");
});
<<<<<<< HEAD

const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`Server is listening on port http://localhost:${PORT}`);
  });
};
 startServer();
=======
app.listen(port, () => {
  console.log(`The Vellum app listening on port ${port}`);
});
>>>>>>> dev

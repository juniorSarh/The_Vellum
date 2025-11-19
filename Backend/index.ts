import express, {Request, Response} from "express";
import dotenv from "dotenv";
dotenv.config();

import {neon} from "@neondatabase/serverless";

// Initialize Neon client
export const sql = neon(process.env.DATABASE_URL!); 


const app = express();
const port = 3000;

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
app.listen(port, () => {
  console.log(`The Vellum app listening on port ${port}`);
});

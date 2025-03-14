import { Client } from "https://deno.land/x/mysql/mod.ts";

export async function queryAll() {
  try {
    const client = await new Client().connect({
      hostname: "localhost",
      username: "root",
      db: "bookshelf",
      password: "root",
    });
    await client.execute(`USE bookshelf`);
    const results = await client.query("SELECT * FROM books");
    console.log(results);
    return results;
  } catch (error) {
    console.error(error);
  }
}

export async function queryById(id:string) {
  try {
    const client = await new Client().connect({
      hostname: "localhost",
      username: "root",
      db: "bookshelf",
      password: "root",
    });
    await client.execute(`USE bookshelf`);
    const results = await client.query(`SELECT * FROM books WHERE id = ${id}`);
    return results;
  } catch (error) {
    console.error(error);
  }
}

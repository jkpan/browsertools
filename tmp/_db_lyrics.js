const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./mydatabase.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the mydatabase.db SQlite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )`, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Created users table.');
});
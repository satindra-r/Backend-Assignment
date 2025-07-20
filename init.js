const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();

const mysql = require("mysql2/promise");
const user = process.env.DB_USERNAME;
const passwd = process.env.DB_PASSWORD;

async function load() {
	try {
		console.log("Connecting to MySQL...");
		const connection = await mysql.createConnection({
			host: "db",
			user: user,
			password: passwd,
			database: 'ChefDB',
			multipleStatements: true,
		});

		console.log("Connected. Loading backup.sql...");
		const sql = fs.readFileSync('backup.sql', 'utf8');
		await connection.query(sql);
		console.log("SQL loaded successfully.");
		await connection.end();
	} catch (err) {
		console.error("Failed to load SQL:", err);
		process.exit(1); // make container crash on failure
	}
}

load();

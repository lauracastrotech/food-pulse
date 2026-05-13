require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || "foodtracker",
  connectionLimit: 10, // Limit number of simultaneous connections
});

module.exports = async function db(query, params = []) {
  const results = { data: [], error: null };
  
  // Use a promise to handle asynchronous query
  try {
    const [rows] = await executeQuery(query, params);
    
    // Check if rows were returned
    if (rows.length === 0) {
      results.error = "No rows returned";
    } else {
      results.data = rows;
    }

  } catch (err) {
    results.error = err.message;
    console.error('Database query error:', err);
  }

  return results;
};

// Function to execute queries with parameters
function executeQuery(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve([result]);
      }
    });
  });
}


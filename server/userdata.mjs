import crypto from 'crypto';
import db from './Database/database.mjs'; // Adjust the import path as necessary

// Function to hash the password with a given salt
function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 16, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
}

// Function to register a user with a username and password
async function registerUser(username, password) {
  const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
  const hashedPassword = await hashPassword(password, salt); // Hash the password with the salt

  const insertQuery = 'INSERT INTO Users (username, password, salt) VALUES (?, ?, ?)'; // SQL query to insert user
  db.run(insertQuery, [username, hashedPassword, salt], function (err) {
    if (err) {
      console.error('Error registering user:', err);
    } else {
      console.log('User registered successfully');
    }
  });
}

// Example usage: register a user with username 'testuser' and password 'testpassword'
registerUser('testuser', 'testpassword');
registerUser('Elena', 'Password1');
registerUser('test', 'WebApplication');


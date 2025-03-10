
import db from '../Database/database.mjs';
import crypto from 'crypto';

export default class UserLogin {
  constructor() {
    // Bind methods to this
    this.hashPassword = this.hashPassword.bind(this);
    this.getIsUserAuthenticated = this.getIsUserAuthenticated.bind(this);
    this.getUserByCredentials = this.getUserByCredentials.bind(this);
    this.getUserByUsername = this.getUserByUsername.bind(this);
  }

  hashPassword(password, salt) {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 16, (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
  }

  
  async getIsUserAuthenticated(username, password) {
    const userQuery = 'SELECT * FROM Users WHERE username = ?';
    const user = await new Promise((resolve, reject) => {
      db.get(userQuery, [username], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (!user) {
      return false;
    }

    const hashedPassword = await this.hashPassword(password, user.salt);
    return hashedPassword === user.password;
  }

  getUserByCredentials(username, password) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Users WHERE username=?';
      db.get(sql, [username], (err, row) => {
        if (err) {
          reject(err);
        } else if (row === undefined) {
          resolve(false);
        } else {
          const user = { user_id: row.user_id, username: row.username };
          crypto.scrypt(password, row.salt, 16, (err, hashedPassword) => {
            if (err) {
              reject(err);
            } else if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword)) {
              resolve(false);
            } else {
              resolve(user);
            }
          });
        }
      });
    });
  }

  getUserByUsername(username) {
    const query = 'SELECT * FROM Users WHERE username=?';
    return new Promise((resolve, reject) => {
      db.get(query, [username], (err, row) => {
        if (err) {
          reject(err);
        }
        if (row === undefined) {
          resolve({ error: 'User not found.' });
        } else {
          resolve(row);
        }
      });
    });
  }
}

import db from "../Database/database.mjs"


export default function GameDao() {

  this.getRandomImage=()=> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT meme_id, image AS url
        FROM Memes
        ORDER BY RANDOM()
        LIMIT 1
      `;
      db.get(query, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve({ memeId: row.meme_id, url: row.url });
        }
      });
    });
  }

  this.getImageCaptions=(imageId)=> {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT Captions.caption_id, Captions.text, Meme_Captions.is_best_match
        FROM Meme_Captions
        JOIN Captions ON Meme_Captions.caption_id = Captions.caption_id
        WHERE Meme_Captions.meme_id = ?
      `;
      db.all(query, [imageId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const captions = rows.map(row => ({
            captionId: row.caption_id,
            text: row.text,
            isCorrect: row.is_best_match === 1,
          }));
          resolve(captions);
        }
      });
    });
}


this.getUserTotalScore = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT SUM(total_score) AS total_user_score
      FROM Games
      WHERE user_id = ?
    `;
    
    db.get(query, [userId], (err, row) => {
      if (err) {
        reject('Failed to fetch total user score');
      } else {
        // Ensure total_user_score is 0 if no games found
        resolve(row.total_user_score || 0);
      }
    });
  });
};


this.getBestCaptions = (imageId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT Captions.caption_id, Captions.text
      FROM Meme_Captions
      JOIN Captions ON Meme_Captions.caption_id = Captions.caption_id
      WHERE Meme_Captions.meme_id = ? AND Meme_Captions.is_best_match = 1
    `;
    db.all(query, [imageId], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        
        const bestCaptions = rows.map(row => ({
          text: row.text
        }));
        
        const bc = bestCaptions.map(a=>a.text);
        resolve(bc);
      }
    });
  });
};

this.validateCaption = (memeId, captionId)=>{
  return new Promise((resolve, reject) => {
    // Example query to validate caption
    const query = `
      SELECT is_best_match
      FROM Meme_Captions
      WHERE meme_id = ? AND caption_id = ?
    `;
    db.get(query, [memeId, captionId], (err, results) => {
      // console.log("in valid caption what is results ", results);
      if (err) {
        reject(err);
      } else {
        if(results === undefined){
          resolve(false);
        }
        else if (results.is_best_match === 0) {
          resolve(false); // Caption not found
        } else {
          resolve(true); // Resolve true for correct, false for incorrect
        }
      }
    });
  });
}

this.saveGame = (user_id, totalScore) => {
  // console.log("in save game ", totalScore);
  return new Promise((resolve, reject) => {
    const gameData = {
      user_id: user_id,
      total_score: totalScore,
      created_at: new Date()
    };

    db.run(`INSERT INTO Games (user_id, total_score, created_at) VALUES (?, ?, ?)`,
      [gameData.user_id, gameData.total_score, gameData.created_at], function (err) {
        if (err) {
          reject('Failed to save game data');
          return;
        }

        const gameId = this.lastID;
        // console.log("what us game id ", gameId);
        resolve(gameId);
      });
  });
};


this.getGameHistory = (userId) => {
  
  return new Promise((resolve, reject) => {
    
    const query = `SELECT g.game_id, g.total_score, g.created_at, r.round_id, r.meme_id, r.selected_caption_id, r.score, r.is_correct, m.image as meme_image, c.text as caption_text
            FROM Games g
            JOIN Rounds r ON g.game_id = r.game_id
            JOIN Memes m ON r.meme_id = m.meme_id
            JOIN Captions c ON r.selected_caption_id = c.caption_id
            WHERE g.user_id = ?
            ORDER BY g.created_at DESC, r.round_id ASC`;
      db.all(query, [userId],
      (err, rows) => {
        
        if (err) {
  
          reject('Failed to fetch game history');
          return;
        }

        const games = {};
        rows.forEach(row => {
          if (!games[row.game_id]) {
            games[row.game_id] = {
              game_id: row.game_id,
              total_score: row.total_score,
              created_at: row.created_at,
              rounds: []
            };
          }
          games[row.game_id].rounds.push({
            round_id: row.round_id,
            meme_id: row.meme_id,
            meme_image: row.meme_image,
            selected_caption_id: row.selected_caption_id,
            caption_text: row.caption_text,
            score: row.score,
            is_correct: row.is_correct
          });
        });

        resolve(Object.values(games));
      });
  });
};


this.saveRound = (roundData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO Rounds (game_id, meme_id, selected_caption_id, is_correct, score, completed_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      roundData.gameId,
      roundData.memeId,
      roundData.selectedCaptionId,
      roundData.isCorrect,
      roundData.score,
      roundData.completedAt,
    ];

    db.run(query, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
};



this.startNewGame = (userId) => {

  return new Promise((resolve, reject) => {
    // Query to get the current maximum game ID
    const query = `SELECT MAX(game_id) as maxGameId FROM Games`;

    db.get(query, (err, row) => {
      if (err) {
        reject(err);
      } else {
        // Increment the max game ID by 1 to get a unique ID
        const nextGameId = (row.maxGameId || 0) + 1;
        // Return a placeholder object with the unique game ID
        resolve(nextGameId);
      }
    });
  });
};



}







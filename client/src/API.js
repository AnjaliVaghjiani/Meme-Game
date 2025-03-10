

const SERVER_URL = 'http://localhost:3001/api';





async function getRandomImage() {
    try {
        const response = await fetch(`${SERVER_URL}/random-image`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching random image:', error);
        throw error; // Propagate the error to the caller
    }
  }


  async function getImageCaptions(imageId) {
    return fetch(`${SERVER_URL}/image-captions/${imageId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching image captions:', error);
        throw error; // Propagate the error to the caller
      });
  }

  async  function validateCaption(memeId, selectedCaptionId){
    return fetch(`${SERVER_URL}/validate-caption`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        memeId: memeId,
        captionId: selectedCaptionId,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error validating caption:', error);
        throw error; // Re-throw the error for the caller to handle
      });
  }

  async function getBestCaptions(memeId) {
    return fetch(`${SERVER_URL}/best-captions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memeId }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching best captions:', error);
            throw error; // Re-throw the error for the caller to handle
        });
}
async function getUserTotalScore(userId) {
  try {
    const url = `${SERVER_URL}/user/${userId}/total-score`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorMessage = `HTTP error! Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.totalUserScore;
  } catch (error) {
    console.error('Error fetching total user score:', error);
    throw error;
  }
}
async function login(username, password) {
  return fetch(`${SERVER_URL}/login`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      // username :'include',
      // password :'include',
      body: JSON.stringify({ username: username, password: password }),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .catch(error => {
          console.error('Error logging in:', error);
          throw error; // Re-throw the error for the caller to handle
      });
}



async function getGameHistory(userId) {
  return fetch(`${SERVER_URL}/game-history/${userId}`, {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error fetching game history:', error);
      throw error;
    });
}

async function saveGame(gameData) {
  return fetch(`${SERVER_URL}/save-game`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error saving game:', error);
      throw error;
    });
}

async function logout() {
  return fetch(`${SERVER_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error logging out:', error);
      throw error;
    });
}

async function saveRound(roundData) {
  return fetch(`${SERVER_URL}/save-round`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roundData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error saving round data:', error);
      throw error;
    });
}


async function startNewGame(userId) {
  return fetch(`${SERVER_URL}/start-game`, {
      method: 'GET',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      },
      // body: JSON.stringify( {userId} ),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .catch(error => {
      console.error('Error starting new game:', error);
      throw error;
  });
}





const API = {getUserTotalScore,  login, saveRound, startNewGame, logout, getGameHistory, saveGame, getRandomImage, getBestCaptions, getImageCaptions, validateCaption}
export default API;


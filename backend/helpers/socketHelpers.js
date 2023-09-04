const playerQueries = require('../db/queries/players');

// Compares the name in the database to the name in the form. If they are different, update the database with the new name.
const compareName = (databaseName, formName, cookie_uuid, socketFunction) => {
  if(databaseName !== formName) {
    console.log('name changed');
    playerQueries.updatePlayerName(cookie_uuid, formName)
      .then(data => {
        socketFunction(data.rows[0].name);
      })
      .catch(err => {
        console.log('err: ', err);
      });
  } else {
    socketFunction(databaseName);
  }
}

// Creates a new player in the database with name and cookie_uuid
const createNewPlayer = (cookie_uuid, name, socketFunction) => {
  playerQueries.addPlayer(cookie_uuid, name)
    .then(data => {
      socketFunction(data.rows[0].name);
    })
    .catch(err => {
      console.log('err: ', err);
    });
}







module.exports = { compareName, createNewPlayer };

const playerQueries = require('../db/queries/players');

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

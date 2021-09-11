const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server
// sequelize will establish the connection with the db
// .sync() will take the models and connect them to our tables in the SQL db
// force: false is optional, if force: true then it drops and recreates all of the db on startup
sequelize.sync({ force: false }).then(() => {
    // starts up the server 
    app.listen(PORT, () => console.log('Now live! d(^^)b'));
});

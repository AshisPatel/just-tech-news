const express = require('express');
const exhbs = require('express-handlebars');
const hbs = exhbs.create({});
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Static call has to go before routes, why?
// get files in public dir
app.use(express.static(path.join(__dirname, 'public'))); 
// turn on routes
app.use(routes);

// Set Handlebars.js as app's template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars'); 



// turn on connection to db and server
// sequelize will establish the connection with the db
// .sync() will take the models and connect them to our tables in the SQL db
// force: false is optional, if force: true then it drops and recreates all of the db on startup
sequelize.sync({ force: false }).then(() => {
    // starts up the server 
    app.listen(PORT, () => console.log(`Now live on ${PORT}! d(^^)b`));
});

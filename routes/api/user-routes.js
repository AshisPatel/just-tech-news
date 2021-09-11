const router = require('express').Router();
const { User } = require('../../models');

// In this file, the router is /api/user/

router.get('/', (req, res) => {
    //  Access our User model and run .findAll() method
    // .findAll() is a method from the Models class in sequelize, it queries all information from our table 'user' similair to SELECT * FROM users;
    User.findAll({
        attributes: { exclude: ['password']}
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err); 
    });
});

router.get('/:id', (req,res) => {
    // findOne is like findAll, but it allows us to place a restriction on the data that we want. We select just the row that contains user id = params.id, similair to SELECT * FROM users WHERE id = ?
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.post('/', (req,res) => {
    // To insert data, we need to pass in an object with key: value pairs, where the keys are the columns that we created in the table object this is similair to 'INSERT INTO users (username, email, password) VALUES (? , ? , ?)
    User.create({
        username: req.body.username, 
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.put('/:id', (req,res) => {
    // if req.body has the exact key: value pairs that are neccesary, then you can just pass in req.body to the method instead of an object like in the .create().
    // The update combines the create and look up command methods together, the first arguement is a create and the second arguement is the search so:
    // UPDATE users SET username = ? , email = ?, password = ? WHERE id = ?
    User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return; 
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.delete('/:id', (req,res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router; 
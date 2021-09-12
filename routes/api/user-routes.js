const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

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
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
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

router.post('/login', (req,res) => {
    // first query to see if the email input is tied to a user in the db
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }

        // NOTE: dbUserData is considered an instance of the User class! This means that is has access to the same methods that the User class does.

        if(!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        res.json( {user: dbUserData , message: 'You are now logged in!'});
    })
});

router.put('/:id', (req,res) => {
    // if req.body has the exact key: value pairs that are neccesary, then you can just pass in req.body to the method instead of an object like in the .create().
    // The update combines the create and look up command methods together, the first arguement is a create and the second arguement is the search so:
    // UPDATE users SET username = ? , email = ?, password = ? WHERE id = ?
    User.update(req.body, {
        individualHooks: true, 
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
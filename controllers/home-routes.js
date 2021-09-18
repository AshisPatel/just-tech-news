const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');


router.get('/', (req, res) => {
    console.log(req.session);
    // perform findAll from sequelize to grab all the data
    // Need to pass in the loggedIn variable in the res.render so the main file has access to it to check for conditional display of log-in/logout
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            // pass a single object into the homepage template
            // serialize the data using the .get({ plain: true }) (.get() method) since we are not using res.json() to serialize the Sequelize object
            const posts = dbPostData.map(post => post.get({ plain:true }));
            // we pass in an object, instead of just the posts array because thie object method allows us to pass in multiple things, we are currently passing in an object with one key 'posts' whose values are the array of post data
            res.render('homepage', { 
                posts,
                loggedIn: req.session.loggedIn 
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

router.get('/login', (req,res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return; 
    }
    res.render('login');
});

router.get('/post/:id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        }, 
        attributes: [
            'id',
            'post_url',
            'title', 
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment, 
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'], 
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return; 
            }

            // serialize the data
            const post = dbPostData.get({ plain:true });

            // pass data to template
            res.render('single-post', { 
                post,
                loggedIn: req.session.loggedIn
             });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err); 
        });
});



module.exports = router;


const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');


router.get('/', (req, res) => {
    // perform findAll from sequelize to grab all the data

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
            res.render('homepage', { posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

module.exports = router;


const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');


router.get('/', (req, res) => {
    Post.findAll({
        // attributes are the columns we want to see from the post table/model
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'] ],
        order: [['created_at', 'DESC']],
        // include performs a JOIN
        include: [
            {
                model:User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id:  req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at',[sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']], 
        include: [
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
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err); 
    });
});

router.post('/', (req,res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err); 
    });
});

// This put route has to go before the :id route, otherwise it will think '/upvote' is an id
router.put('/upvote', (req, res) => {
//    Custom static method creadte in models/Post.js
    Post.upvote(req.body, { Vote })
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err => {
        if(err) {
            console.log(err);
            res.status(400).json(err); 
        }
    });
});

router.put('/:id', (req,res) => {
    Post.update( 
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json( {message: 'No post found with this id'} );
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err); 
    });
});

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return; 
        }
        res.json(dbPostData); 
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err); 
    });
});





module.exports = router; 

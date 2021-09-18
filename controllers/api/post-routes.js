const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');


router.get('/', (req, res) => {
    Post.findAll({
        // attributes are the columns we want to see from the post table/model
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'] ],
        order: [['created_at', 'DESC']],
        // include performs a JOIN
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
    // Make sure the session exists, as in the user is signed in
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        // upvote is a custom method for the post model 
        Post.upvote({...req.body, user_id: req.session.user_id}, { Vote, Comment, User })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            if(err) {
                console.log(err);
                res.status(500).json(err); 
            }
        });
    }
  
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

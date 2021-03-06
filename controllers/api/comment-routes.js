const router = require('express').Router();
const { Comment, User, Post }  = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Comment.findAll({
        attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model:User,
                attributes: ['username']
            },
            {
                model: Post,
                attributes: ['title']
            }
        ]
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err); 
    });
});

router.post('/', withAuth, (req, res) => {
    // check the session (user is signed in) to grab user_id
    if(req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            // user_id is from session, other two are submitted via the fetch request on the front-end.
            user_id: req.session.user_id,
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err); 
        });
    }

});

router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id.' });
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err); 
    });
});

module.exports = router; 
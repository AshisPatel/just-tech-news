const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api',apiRoutes);

// This will return an error 404 for a request made to any router that doesn't exist like .../api/spaghetti
router.use((req,res) => {
    res.status(404).end();
});

module.exports = router; 
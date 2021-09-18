const router = require('express').Router();
const homeRoutes = require('./home-routes.js'); 
const dashboardRoutes = require('./dashboard-routes.js');
const apiRoutes = require('./api');

router.use('/api',apiRoutes);
router.use('/', homeRoutes); 
router.use('/dashboard', dashboardRoutes);
// This will return an error 404 for a request made to any router that doesn't exist like .../api/spaghetti
router.use((req,res) => {
    res.status(404).end();
});

module.exports = router; 
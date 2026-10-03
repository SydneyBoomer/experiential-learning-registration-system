const express = require('express');
const cors = require('cors');

const db = require('./database');

const applicationRoutes = require('./routes/applications');
const opportunityRoutes = require('./routes/opportunities');
const capstoneRoutes = require('./routes/capstones');

const app = express();

const PORT = 3000;


/*
 * MIDDLEWARE
 */

app.use(cors());
app.use(express.json());


/*
 * TEST ROUTE
 */

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend is working!'
    });
});


/*
 * API ROUTES
 */

app.use(
    '/api/applications',
    applicationRoutes
);

app.use(
    '/api/opportunities',
    opportunityRoutes
);

app.use(
    '/api/capstones',
    capstoneRoutes
);


/*
 * START SERVER
 */

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});
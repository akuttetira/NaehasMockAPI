const { Pool } = require('pg');

exports.pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
});

exports.PostgreSQL = (req, res, next) => {
    req.pool = exports.pool;
    next();
}
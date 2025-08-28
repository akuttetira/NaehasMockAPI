require('dotenv').config();
const express = require('express');
const productDirectoryRouter = require('./routers/productDirectory');
const app = express();
app.use(express.json());

const { PostgreSQL } = require('./database/db.js');

app.use(PostgreSQL);
app.use('/api', productDirectoryRouter);

const PORT = process.env.PORT || 3000;

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})

app.use((err, req, res, next) => {
  console.error(`Error on ${req.method} ${req.originalUrl}:`, err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message, // hide this in production later
  });
});
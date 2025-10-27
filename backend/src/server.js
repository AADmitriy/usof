const app = require('./app');
require('dotenv').config();
const port = process.env.APP_PORT;
const host = process.env.APP_HOST;

app.get('/', (req, res) => {
    res.send('Hello from Node.js Backend!');
});

app.listen(port, () => {
    console.log(`Server listening at http://${host}:${port}`);
});
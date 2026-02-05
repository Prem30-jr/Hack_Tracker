const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/teams', require('./routes/team'));
app.use('/api/tasks', require('./routes/task'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/github', require('./routes/github'));

module.exports = app;
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Devtool Conference Backend is running!');
});

app.get('/api/error/400', (req, res) => {
    res.status(400).json({ error: 'Bad Request', message: 'This is a simulated 400 error.' });
});

app.get('/api/error/404', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'This is a simulated 404 error.' });
});

app.get('/api/error/500', (req, res) => {
    res.status(500).json({ error: 'Internal Server Error', message: 'This is a simulated 500 error.' });
});

app.get('/api/secret-data', (req, res) => {
    res.json({
        "status": "LOCKED",
        "message": "存取被拒絕。你需要 Override 這個回應來解鎖系統。",
        "hint": "將 'status' 改為 'unlocked'，並在此處加入 'SECRET_CODE_FRAGMENT' !"
    });
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const orgRoutes = require('./routes/org');
const testRoutes = require('./routes/test');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/org', orgRoutes);
app.use('/test', testRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Quizilla API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

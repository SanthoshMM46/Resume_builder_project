const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key_here'; // In a real app, use environment variables

app.use(cors());
app.use(express.json());

// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdmin = username.toLowerCase() === 'admin' ? 1 : 0;
        db.run('INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, isAdmin], function(err) {
            if (err) {
                return res.status(400).json({ error: 'User already exists or invalid data' });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isAdmin = user.is_admin === 1;
        const token = jwt.sign({ id: user.id, username: user.username, isAdmin }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, username: user.username, isAdmin });
    });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Get user's resume data
app.get('/api/resume', authenticateToken, (req, res) => {
    db.get('SELECT data FROM resumes WHERE user_id = ?', [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (row) {
            res.json({ data: JSON.parse(row.data) });
        } else {
            res.json({ data: null }); // No resume found
        }
    });
});

// Save user's resume data
app.post('/api/resume', authenticateToken, (req, res) => {
    const resumeData = JSON.stringify(req.body.data);
    db.get('SELECT id FROM resumes WHERE user_id = ?', [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        if (row) {
            // Update existing
            db.run('UPDATE resumes SET data = ? WHERE user_id = ?', [resumeData, req.user.id], (updateErr) => {
                if (updateErr) return res.status(500).json({ error: 'Failed to update resume' });
                res.json({ message: 'Resume updated successfully' });
            });
        } else {
            // Insert new
            db.run('INSERT INTO resumes (user_id, data) VALUES (?, ?)', [req.user.id, resumeData], (insertErr) => {
                if (insertErr) return res.status(500).json({ error: 'Failed to save resume' });
                res.json({ message: 'Resume saved successfully' });
            });
        }
    });
});

// Middleware to authenticate Admin
function authenticateAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) return res.sendStatus(403);
    next();
}

// Admin Endpoint: Get all users and resume status
app.get('/api/admin/users', authenticateToken, authenticateAdmin, (req, res) => {
    db.all(`
        SELECT u.id, u.username, u.email, u.is_admin,
               CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END as has_resume
        FROM users u
        LEFT JOIN resumes r ON u.id = r.user_id
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

// Seed default admin user
const seedAdmin = async () => {
    db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, row) => {
        if (!err && !row) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            db.run('INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, ?)', 
                ['admin', 'admin@admin.com', hashedPassword, 1], 
                (insertErr) => {
                    if (!insertErr) console.log('Default admin user created (Email: admin@admin.com / Password: admin123)');
                }
            );
        }
    });
};

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    seedAdmin();
});

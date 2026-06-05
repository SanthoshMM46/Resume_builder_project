const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const email = process.argv[2];

if (!email) {
    console.error('Usage: node make_admin.js <user_email>');
    process.exit(1);
}

const dbPath = path.resolve(__dirname, 'resume_builder.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        process.exit(1);
    }
});

// Check if the is_admin column exists, if not, wait for the server to be restarted at least once to create it, or add it here
db.run(`ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0`, (err) => {
    // Ignore error if column already exists
    db.run('UPDATE users SET is_admin = 1 WHERE email = ?', [email], function(err) {
        if (err) {
            console.error('Error updating user:', err.message);
        } else if (this.changes === 0) {
            console.log(`User with email '${email}' not found.`);
        } else {
            console.log(`Successfully made '${email}' an administrator.`);
        }
        db.close();
    });
});

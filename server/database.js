const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(
    __dirname,
    '..',
    'database',
    'research.db'
);

const db = new sqlite3.Database(dbPath);

db.serialize(() => {

    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL
                CHECK (role IN ('STUDENT', 'TEACHER', 'ADVISOR'))
        )
    `);

    // Create opportunities table
    db.run(`
        CREATE TABLE IF NOT EXISTS opportunities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,

        type TEXT NOT NULL
            CHECK (type IN ('RESEARCH', 'TA', 'CAPSTONE')),

        field TEXT,
        subfield TEXT,
        professor_id INTEGER,
        department TEXT,
        requirements TEXT,
        capacity INTEGER NOT NULL,

        semester TEXT,
        active INTEGER NOT NULL DEFAULT 1,

        FOREIGN KEY (professor_id)
            REFERENCES users(id)
    )
    `);

    // Create applications table
    db.run(`
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            opportunity_id INTEGER NOT NULL,

            status TEXT NOT NULL DEFAULT 'APPLIED'
                CHECK (
                    status IN (
                        'APPLIED',
                        'PROFESSOR_APPROVED',
                        'ADVISOR_APPROVED',
                        'REGISTERED',
                        'REJECTED',
                        'WITHDRAWN'
                    )
                ),

            applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            professor_approved_at TEXT,
            advisor_approved_at TEXT,

            FOREIGN KEY (student_id)
                REFERENCES users(id),

            FOREIGN KEY (opportunity_id)
                REFERENCES opportunities(id),

            UNIQUE(student_id, opportunity_id)
        )
    `);


    // --------------------------------
    // TEST USERS
    // --------------------------------

    db.run(`
        INSERT OR IGNORE INTO users
        (id, name, email, role)
        VALUES
        (1, 'Dr. Smith', 'smith@nku.edu', 'TEACHER')
    `);

    db.run(`
        INSERT OR IGNORE INTO users
        (id, name, email, role)
        VALUES
        (2, 'Sydney Boomer', 'sydney@nku.edu', 'STUDENT')
    `);

    db.run(`
        INSERT OR IGNORE INTO users
        (id, name, email, role)
        VALUES
        (3, 'Dr. Advisor', 'advisor@nku.edu', 'ADVISOR')
    `);

});

db.run(`
    CREATE TABLE IF NOT EXISTS capstone_mentors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        description TEXT NOT NULL,
        active INTEGER DEFAULT 1
    )
`);

db.run(`
    INSERT OR IGNORE INTO capstone_mentors
    (id, name, department, description, active)
    VALUES
    (
        1,
        'Dr. Smith',
        'Computer Science',
        'Interested in cybersecurity, network security, and security automation.',
        1
    )
`);

db.run(`
    INSERT OR IGNORE INTO capstone_mentors
    (id, name, department, description, active)
    VALUES
    (
        2,
        'Dr. Johnson',
        'Computer Science',
        'Interested in artificial intelligence, machine learning, and intelligent systems.',
        1
    )
`);

db.run(`
    INSERT OR IGNORE INTO capstone_mentors
    (id, name, department, description, active)
    VALUES
    (
        3,
        'Dr. Williams',
        'Information Systems',
        'Interested in database systems, business analytics, and information technology.',
        1
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS capstones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        mentor_id INTEGER NOT NULL,
        research_idea TEXT NOT NULL,
        specifics TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'SUBMITTED',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id),
        FOREIGN KEY (mentor_id) REFERENCES capstone_mentors(id)
    )
`);

module.exports = db;
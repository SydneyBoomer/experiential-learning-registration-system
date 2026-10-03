const express = require('express');
const router = express.Router();
const db = require('../database');


/*
 * GET ALL CAPSTONE DEPARTMENTS
 */
router.get('/departments', (req, res) => {

    const sql = `
        SELECT DISTINCT department
        FROM capstone_mentors
        WHERE active = 1
        ORDER BY department
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(
            rows.map(row => row.department)
        );
    });
});


/*
 * GET CAPSTONE MENTORS FOR A DEPARTMENT
 */
router.get('/mentors', (req, res) => {

    const { department } = req.query;

    if (!department) {
        return res.status(400).json({
            error: 'Department is required'
        });
    }

    const sql = `
        SELECT
            id,
            name,
            department,
            description,
            active
        FROM capstone_mentors
        WHERE department = ?
        AND active = 1
        ORDER BY name
    `;

    db.all(sql, [department], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

/*
 * GET A STUDENT'S CAPSTONES
 */
router.get('/student/:studentId', (req, res) => {

    const sql = `
        SELECT
            capstones.id,
            capstones.student_id,
            capstones.mentor_id,
            capstones.research_idea,
            capstones.specifics,
            capstones.status,
            capstones.created_at,
            capstones.submitted_at,
            capstone_mentors.name AS mentor_name,
            capstone_mentors.department
        FROM capstones
        JOIN capstone_mentors
            ON capstones.mentor_id = capstone_mentors.id
        WHERE capstones.student_id = ?
        ORDER BY capstones.id DESC
    `;

    db.all(
        sql,
        [req.params.studentId],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(
                rows.map(row => ({
                    id: row.id,
                    studentId: row.student_id,
                    mentorId: row.mentor_id,
                    mentorName: row.mentor_name,
                    department: row.department,
                    researchIdea: row.research_idea,
                    specifics: row.specifics,
                    status: row.status,
                    createdAt: row.created_at,
                    submittedAt: row.submitted_at
                }))
            );
        }
    );
});

/*
 * GET CAPSTONE REQUESTS FOR A FACULTY MEMBER
 */
router.get('/faculty/:facultyId', (req, res) => {

    const sql = `
        SELECT
            capstones.id,
            capstones.student_id AS studentId,
            users.name AS student,
            capstones.mentor_id AS mentorId,
            capstones.research_idea AS researchIdea,
            capstones.specifics,
            capstones.status,
            capstones.created_at AS createdAt,
            capstones.submitted_at AS submittedAt,
            capstone_mentors.name AS mentorName,
            capstone_mentors.department
        FROM capstones

        JOIN users
            ON capstones.student_id = users.id

        JOIN capstone_mentors
            ON capstones.mentor_id = capstone_mentors.id

        WHERE capstone_mentors.name = (
            SELECT name
            FROM users
            WHERE id = ?
        )

        AND (
            capstones.status = 'SUBMITTED'
            OR capstones.status = 'APPROVED'
        )

        ORDER BY capstones.created_at DESC
    `;

    db.all(
        sql,
        [req.params.facultyId],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(rows);
        }
    );
});

/* APPROVE A CAPSTONE REQUEST */
router.put('/:id/approve', (req, res) => {
    const sql = `
        UPDATE capstones
        SET status = 'APPROVED'
        WHERE id = ?
        AND status = 'SUBMITTED'
    `;

    db.run(sql, [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(400).json({
                error: 'Capstone request cannot be approved.'
            });
        }

        res.json({
            message: 'Capstone request approved.'
        });
    });
});


/* DENY A CAPSTONE REQUEST */
router.put('/:id/deny', (req, res) => {
    const sql = `
        UPDATE capstones
        SET status = 'DENIED'
        WHERE id = ?
        AND status = 'SUBMITTED'
    `;

    db.run(sql, [req.params.id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(400).json({
                error: 'Capstone request cannot be denied.'
            });
        }

        res.json({
            message: 'Capstone request denied.'
        });
    });
});

/*
 * CREATE A CAPSTONE PROPOSAL
 */
router.post('/', (req, res) => {

    const {
        studentId,
        mentorId,
        researchIdea,
        specifics
    } = req.body;

    if (
        !studentId ||
        !mentorId ||
        !researchIdea ||
        !specifics
    ) {
        return res.status(400).json({
            error: 'Student, mentor, research idea, and specifics are required'
        });
    }

    const insertSql = `
        INSERT INTO capstones (
            student_id,
            mentor_id,
            research_idea,
            specifics,
            status
        )
        VALUES (?, ?, ?, ?, 'SUBMITTED')
    `;

    db.run(
        insertSql,
        [
            studentId,
            mentorId,
            researchIdea,
            specifics
        ],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                id: this.lastID,
                message: 'Capstone proposal submitted successfully'
            });
        }
    );
});


module.exports = router;
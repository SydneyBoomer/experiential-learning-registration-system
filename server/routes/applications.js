const express = require('express');
const router = express.Router();
const db = require('../database');


/*
 * APPLY FOR AN OPPORTUNITY
 */
router.post('/', (req, res) => {

    const {
        studentId,
        opportunityId
    } = req.body;

    const sql = `
        INSERT INTO applications (
            student_id,
            opportunity_id,
            status
        )

        VALUES (?, ?, 'APPLIED')
    `;

    db.run(
        sql,
        [studentId, opportunityId],
        function(err) {

            if (err) {

                if (err.message.includes('UNIQUE')) {

                    return res.status(409).json({
                        error:
                            'You have already applied to this opportunity.'
                    });

                }

                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                id: this.lastID,
                message:
                    'Application submitted successfully'
            });
        }
    );
});


/*
 * GET A STUDENT'S APPLICATIONS
 */
router.get('/student/:studentId', (req, res) => {

    const sql = `
        SELECT
            applications.*,

            opportunities.title,
            opportunities.description,
            opportunities.field,
            opportunities.subfield,
            opportunities.department,

            users.name AS professor

        FROM applications

        JOIN opportunities
            ON applications.opportunity_id = opportunities.id

        JOIN users
            ON opportunities.professor_id = users.id

        WHERE applications.student_id = ?

        ORDER BY applications.applied_at DESC
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

            res.json(rows);
        }
    );
});

router.get('/professor/:professorId', (req, res) => {

    const sql = `
        SELECT
            applications.id,
            applications.student_id AS studentId,
            applications.opportunity_id AS opportunityId,
            applications.status,
            applications.applied_at AS appliedAt,
            opportunities.title,
            opportunities.type,
            users.name AS student
        FROM applications

        JOIN opportunities
            ON applications.opportunity_id = opportunities.id

        JOIN users
            ON applications.student_id = users.id

        WHERE opportunities.professor_id = ?

        ORDER BY applications.applied_at DESC
    `;

    db.all(
        sql,
        [req.params.professorId],
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

/* GET APPLICATIONS WAITING FOR ADVISOR APPROVAL */
router.get('/advisor/pending', (req, res) => {

    const sql = `
        SELECT
            applications.id,
            applications.student_id AS studentId,
            applications.opportunity_id AS opportunityId,
            applications.status,
            applications.applied_at AS appliedAt,
            applications.professor_approved_at AS professorApprovedAt,
            
            students.name AS student,

            opportunities.title,
            opportunities.type,
            opportunities.description,
            opportunities.field,
            opportunities.subfield,
            opportunities.department,

            professors.name AS professor

        FROM applications

        JOIN opportunities
            ON applications.opportunity_id = opportunities.id

        JOIN users AS students
            ON applications.student_id = students.id

        JOIN users AS professors
            ON opportunities.professor_id = professors.id

        WHERE applications.status = 'PROFESSOR_APPROVED'

        ORDER BY applications.professor_approved_at DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

/* GET REGISTERED APPLICATIONS */
router.get('/advisor/registered', (req, res) => {

    const sql = `
        SELECT
            applications.id,
            applications.student_id AS studentId,
            applications.opportunity_id AS opportunityId,
            applications.status,
            applications.applied_at AS appliedAt,
            applications.professor_approved_at AS professorApprovedAt,
            applications.advisor_approved_at AS advisorApprovedAt,

            students.name AS student,

            opportunities.title,
            opportunities.type,
            opportunities.description,
            opportunities.field,
            opportunities.subfield,
            opportunities.department,

            professors.name AS professor

        FROM applications

        JOIN opportunities
            ON applications.opportunity_id = opportunities.id

        JOIN users AS students
            ON applications.student_id = students.id

        JOIN users AS professors
            ON opportunities.professor_id = professors.id

        WHERE applications.status = 'REGISTERED'

        ORDER BY applications.advisor_approved_at DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(rows);
    });
});

/*
 * REMOVE AN APPLICATION
 *
 * Only applications with APPLIED status
 * can be removed.
 */
router.delete('/:id', (req, res) => {

    const sql = `
        DELETE FROM applications

        WHERE id = ?
        AND status = 'APPLIED'
    `;

    db.run(
        sql,
        [req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {

                return res.status(400).json({
                    error:
                        'This application cannot be removed.'
                });
            }

            res.json({
                message:
                    'Application removed successfully'
            });
        }
    );
});


/*
 * PROFESSOR APPROVES APPLICATION
 */
router.put('/:id/professor-approve', (req, res) => {

    const sql = `
        UPDATE applications

        SET
            status = 'PROFESSOR_APPROVED',
            professor_approved_at = CURRENT_TIMESTAMP

        WHERE id = ?
        AND status = 'APPLIED'
    `;

    db.run(
        sql,
        [req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(400).json({
                    error:
                        'Application cannot be approved.'
                });
            }

            res.json({
                message:
                    'Professor approval recorded.'
            });
        }
    );
});


/*
 * ADVISOR APPROVES APPLICATION
 */
router.put('/:id/advisor-approve', (req, res) => {

    const sql = `
        UPDATE applications

        SET
            status = 'REGISTERED',
            advisor_approved_at = CURRENT_TIMESTAMP

        WHERE id = ?
        AND status = 'PROFESSOR_APPROVED'
    `;

    db.run(
        sql,
        [req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(400).json({
                    error:
                        'Application must have professor approval first.'
                });
            }

            res.json({
                message:
                    'Advisor approval recorded. Student is now registered.'
            });
        }
    );
});


/*
 * PROFESSOR DENIES APPLICATION
 */
router.put('/:id/professor-deny', (req, res) => {

    const sql = `
        UPDATE applications

        SET status = 'REJECTED'

        WHERE id = ?
        AND status = 'APPLIED'
    `;

    db.run(
        sql,
        [req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(400).json({
                    error:
                        'Application cannot be denied.'
                });
            }

            res.json({
                message:
                    'Application denied.'
            });
        }
    );
});


/*
 * ADVISOR DENIES APPLICATION
 *
 * Only applications the professor has
 * already approved can be denied here.
 */
router.put('/:id/advisor-deny', (req, res) => {

    const sql = `
        UPDATE applications

        SET status = 'REJECTED'

        WHERE id = ?
        AND status = 'PROFESSOR_APPROVED'
    `;

    db.run(
        sql,
        [req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(400).json({
                    error:
                        'Application cannot be denied.'
                });
            }

            res.json({
                message:
                    'Application denied by advisor.'
            });
        }
    );
});


module.exports = router;
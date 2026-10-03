const express = require('express');

const router = express.Router();

const db = require('../database');


/*
 * CREATE AN OPPORTUNITY
 */
router.post('/', (req, res) => {

    const {
        title,
        description,
        type,
        field,
        subfield,
        professorId,
        department,
        requirements,
        capacity,
        acceptsCapstoneStudents,
        semester,
        format,
        datesOffered,
        timeBlock
    } = req.body;


    const opportunityType =
        type === 'TA' ? 'TA' : 'RESEARCH';


    const sql = `
        INSERT INTO opportunities (
            title,
            description,
            type,
            field,
            subfield,
            professor_id,
            department,
            requirements,
            capacity,
            accepts_capstone_students,
            semester,
            format,
            dates_offered,
            time_block
        )
        VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    `;


    db.run(sql, [
        title,
        description,
        opportunityType,
        field,
        subfield,
        professorId,
        department,
        requirements,
        capacity,
        acceptsCapstoneStudents ? 1 : 0,
        semester,
        format,
        datesOffered,
        timeBlock
    ], function(err) {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }


        res.status(201).json({
            id: this.lastID,
            message: 'Opportunity created successfully'
        });

    });

});


/*
 * GET ALL ACTIVE OPPORTUNITIES
 */
router.get('/', (req, res) => {

    const sql = `
        SELECT
            opportunities.id,
            opportunities.title,
            opportunities.description,
            opportunities.type,
            opportunities.field,
            opportunities.subfield,
            users.name AS professor,
            opportunities.department,
            opportunities.requirements,
            opportunities.capacity,
            opportunities.semester,
            opportunities.format,
            opportunities.dates_offered,
            opportunities.time_block,
            SUM(
                CASE
                    WHEN applications.status = 'APPLIED'
                    THEN 1
                    ELSE 0
                END
            ) AS applicantCount,

            SUM(
                CASE
                    WHEN applications.status = 'PROFESSOR_APPROVED'
                        OR applications.status = 'REGISTERED'
                    THEN 1
                    ELSE 0
                END
            ) AS acceptedCount
        FROM opportunities
        LEFT JOIN users
            ON opportunities.professor_id = users.id
        LEFT JOIN applications
            ON opportunities.id = applications.opportunity_id
        WHERE opportunities.active = 1
        GROUP BY opportunities.id
        ORDER BY opportunities.id
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
 * GET ONE OPPORTUNITY
 */
router.get('/:id', (req, res) => {

    const sql = `
        SELECT
            opportunities.*,
            users.name AS professor

        FROM opportunities

        LEFT JOIN users
            ON opportunities.professor_id = users.id

        WHERE opportunities.id = ?
    `;

    db.get(
        sql,
        [req.params.id],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: 'Opportunity not found'
                });
            }

            res.json(row);
        }
    );

});


module.exports = router;
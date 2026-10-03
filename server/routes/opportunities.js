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

    // Basic validation so bad forms get a clear message.
    const capacityNumber = Number(capacity);

    if (
        !title || !title.trim() ||
        !description || !description.trim() ||
        !department || !department.trim() ||
        !professorId
    ) {
        return res.status(400).json({
            error:
                'Title, description, department and professor are required.'
        });
    }

    if (!Number.isInteger(capacityNumber) || capacityNumber < 1) {
        return res.status(400).json({
            error: 'Capacity must be a whole number of at least 1.'
        });
    }

    if (opportunityType === 'RESEARCH' && !(field && field.trim())) {
        return res.status(400).json({
            error: 'Research opportunities need a field.'
        });
    }


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
        title.trim(),
        description.trim(),
        opportunityType,
        field ? field.trim() : null,
        subfield ? subfield.trim() : null,
        professorId,
        department.trim(),
        requirements ? requirements.trim() : null,
        capacityNumber,
        acceptsCapstoneStudents ? 1 : 0,
        semester ? semester.trim() : null,
        format ? format.trim() : null,
        datesOffered ? datesOffered.trim() : null,
        timeBlock ? timeBlock.trim() : null
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
                        OR applications.status = 'ADVISOR_APPROVED'
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
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/research.db');


/*
 * Research opportunities to add
 */

const researchOpportunities = [
    {
        title: 'Network Security Research',
        description: 'Research network security techniques, vulnerabilities, and methods for protecting computer networks.',
        field: 'Computer Science',
        subfield: 'Cybersecurity',
        professor: 'Dr. Smith',
        department: 'Computer Science',
        requirements: 'Completed Computer Networks',
        capacity: 3,
        semester: 'Fall 2026'
    },

    {
        title: 'Malware Analysis Research',
        description: 'Study malware behavior, analysis techniques, and methods for detecting malicious software.',
        field: 'Computer Science',
        subfield: 'Cybersecurity',
        professor: 'Dr. Anderson',
        department: 'Cybersecurity',
        requirements: 'Completed Introduction to Cybersecurity',
        capacity: 2,
        semester: 'Fall 2026'
    },

    {
        title: 'Machine Learning Applications',
        description: 'Explore machine learning algorithms and their applications to real-world problems.',
        field: 'Computer Science',
        subfield: 'Artificial Intelligence',
        professor: 'Dr. Williams',
        department: 'Computer Science',
        requirements: 'Completed Data Structures and Statistics',
        capacity: 3,
        semester: 'Fall 2026'
    },

    {
        title: 'Natural Language Processing Research',
        description: 'Investigate techniques for processing, analyzing, and understanding human language using computers.',
        field: 'Computer Science',
        subfield: 'Artificial Intelligence',
        professor: 'Dr. Johnson',
        department: 'Computer Science',
        requirements: 'Programming experience and interest in AI',
        capacity: 2,
        semester: 'Fall 2026'
    },

    {
        title: 'Software Testing Research',
        description: 'Research software testing techniques, automated testing, and methods for improving software quality.',
        field: 'Computer Science',
        subfield: 'Software Engineering',
        professor: 'Dr. Miller',
        department: 'Computer Science',
        requirements: 'Completed Software Engineering',
        capacity: 3,
        semester: 'Fall 2026'
    },

    {
        title: 'Data Visualization Research',
        description: 'Explore methods for presenting complex datasets through effective visualizations and interactive tools.',
        field: 'Computer Science',
        subfield: 'Data Science',
        professor: 'Dr. Davis',
        department: 'Computer Science',
        requirements: 'Completed Statistics or Data Science',
        capacity: 3,
        semester: 'Fall 2026'
    },

    {
        title: 'Human-Computer Interaction Study',
        description: 'Study how people interact with software and investigate ways to improve usability and user experience.',
        field: 'Computer Science',
        subfield: 'Human-Computer Interaction',
        professor: 'Dr. Wilson',
        department: 'Computer Science',
        requirements: 'Interest in user experience and software design',
        capacity: 2,
        semester: 'Fall 2026'
    },

    {
        title: 'Applied Statistics Research',
        description: 'Apply statistical methods to real-world datasets and investigate techniques for interpreting research results.',
        field: 'Mathematics',
        subfield: 'Statistics',
        professor: 'Dr. Brown',
        department: 'Mathematics',
        requirements: 'Completed Statistics',
        capacity: 3,
        semester: 'Fall 2026'
    }
];


/*
 * Capstone mentors to add
 */

const capstoneMentors = [
    {
        name: 'Dr. Johnson',
        department: 'Computer Science',
        description: 'Mentors projects involving software engineering, application development, and software design.'
    },

    {
        name: 'Dr. Williams',
        department: 'Computer Science',
        description: 'Mentors projects involving artificial intelligence, machine learning, and intelligent applications.'
    },

    {
        name: 'Dr. Brown',
        department: 'Cybersecurity',
        description: 'Mentors projects involving network security, security monitoring, and vulnerability assessment.'
    },

    {
        name: 'Dr. Davis',
        department: 'Cybersecurity',
        description: 'Mentors projects involving digital forensics, incident response, and cybersecurity investigations.'
    },

    {
        name: 'Dr. Wilson',
        department: 'Mathematics',
        description: 'Mentors projects involving statistics, data analysis, mathematical modeling, and quantitative research.'
    },

    {
        name: 'Dr. Miller',
        department: 'Computer Science',
        description: 'Mentors projects involving web development, user interfaces, and full-stack applications.'
    },

    {
        name: 'Dr. Anderson',
        department: 'Computer Science',
        description: 'Mentors projects involving databases, data management, and information systems.'
    }
];


db.serialize(() => {

    /*
     * Get professor IDs from the database.
     */

    const professorIds = {};

    db.all(
        `
            SELECT id, name
            FROM users
            WHERE role = 'TEACHER'
        `,
        [],
        (err, professors) => {

            if (err) {
                console.error(
                    'Error loading professors:',
                    err.message
                );

                db.close();
                return;
            }


            professors.forEach(professor => {
                professorIds[professor.name] =
                    professor.id;
            });


            /*
             * Check that all research professors exist.
             */

            const missingResearchProfessors =
                researchOpportunities
                    .map(opportunity => opportunity.professor)
                    .filter(
                        professor =>
                            !professorIds[professor]
                    )
                    .filter(
                        (professor, index, array) =>
                            array.indexOf(professor) === index
                    );


            if (missingResearchProfessors.length > 0) {

                console.error(
                    'Missing research professors:',
                    missingResearchProfessors.join(', ')
                );

                db.close();
                return;
            }


            /*
             * Check that all Capstone mentors exist.
             */

            const missingMentors =
                capstoneMentors
                    .map(mentor => mentor.name)
                    .filter(
                        name =>
                            !professorIds[name]
                    )
                    .filter(
                        (name, index, array) =>
                            array.indexOf(name) === index
                    );


            if (missingMentors.length > 0) {

                console.error(
                    'Missing Capstone mentors:',
                    missingMentors.join(', ')
                );

                db.close();
                return;
            }


            /*
             * Add research opportunities.
             */

            const insertResearch =
                db.prepare(`
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
                        semester
                    )
                    VALUES (
                        ?, ?,
                        'RESEARCH',
                        ?, ?, ?, ?, ?, ?, 0, ?
                    )
                `);


            researchOpportunities.forEach(
                opportunity => {

                    const professorId =
                        professorIds[
                            opportunity.professor
                        ];


                    insertResearch.run(
                        [
                            opportunity.title,
                            opportunity.description,
                            opportunity.field,
                            opportunity.subfield,
                            professorId,
                            opportunity.department,
                            opportunity.requirements,
                            opportunity.capacity,
                            opportunity.semester
                        ],
                        function(err) {

                            if (err) {

                                console.error(
                                    `Error adding ${opportunity.title}:`,
                                    err.message
                                );

                                return;
                            }


                            console.log(
                                `Added Research: ${opportunity.title} (ID ${this.lastID})`
                            );

                        }
                    );

                }
            );


            insertResearch.finalize(() => {

                console.log(
                    'All research opportunities have been added.'
                );


                /*
                 * Add Capstone mentors.
                 */

                const insertMentor =
                    db.prepare(`
                        INSERT INTO capstone_mentors (
                            name,
                            department,
                            description,
                            active
                        )
                        VALUES (?, ?, ?, 1)
                    `);


                capstoneMentors.forEach(
                    mentor => {

                        insertMentor.run(
                            [
                                mentor.name,
                                mentor.department,
                                mentor.description
                            ],
                            function(err) {

                                if (err) {

                                    console.error(
                                        `Error adding Capstone mentor ${mentor.name}:`,
                                        err.message
                                    );

                                    return;
                                }


                                console.log(
                                    `Added Capstone Mentor: ${mentor.name} (ID ${this.lastID})`
                                );

                            }
                        );

                    }
                );


                insertMentor.finalize(() => {

                    console.log(
                        'All Capstone mentors have been added.'
                    );

                    console.log(
                        'Research and Capstone data population complete.'
                    );

                    db.close();

                });

            });

        }
    );

});
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/research.db');


const professors = [
    ['Dr. Johnson', 'dr.johnson@nku.edu', 'TEACHER'],
    ['Dr. Williams', 'dr.williams@nku.edu', 'TEACHER'],
    ['Dr. Brown', 'dr.brown@nku.edu', 'TEACHER'],
    ['Dr. Davis', 'dr.davis@nku.edu', 'TEACHER'],
    ['Dr. Wilson', 'dr.wilson@nku.edu', 'TEACHER'],
    ['Dr. Miller', 'dr.miller@nku.edu', 'TEACHER'],
    ['Dr. Anderson', 'dr.anderson@nku.edu', 'TEACHER']
];


const opportunities = [
    {
        title: 'Data Structures TA',
        description: 'Assist students with data structures, algorithms, and programming assignments.',
        field: 'Computer Science',
        professor: 'Dr. Smith',
        department: 'Computer Science',
        requirements: 'Completed CSC 360 or equivalent',
        capacity: 3,
        format: 'In Person',
        datesOffered: 'Monday and Wednesday',
        timeBlock: '9:00 AM - 11:00 AM'
    },

    {
        title: 'Database Systems TA',
        description: 'Help students understand relational databases, SQL, and database design.',
        field: 'Computer Science',
        professor: 'Dr. Johnson',
        department: 'Computer Science',
        requirements: 'Completed Database Systems',
        capacity: 2,
        format: 'Online',
        datesOffered: 'Tuesday and Thursday',
        timeBlock: '1:00 PM - 3:00 PM'
    },

    {
        title: 'Web Development TA',
        description: 'Assist students with HTML, CSS, JavaScript, and web development projects.',
        field: 'Computer Science',
        professor: 'Dr. Williams',
        department: 'Computer Science',
        requirements: 'Completed Web Development',
        capacity: 3,
        format: 'In Person',
        datesOffered: 'Monday and Friday',
        timeBlock: '2:00 PM - 4:00 PM'
    },

    {
        title: 'Calculus I TA',
        description: 'Help students with derivatives, integrals, limits, and calculus homework.',
        field: 'Mathematics',
        professor: 'Dr. Brown',
        department: 'Mathematics',
        requirements: 'Completed Calculus II',
        capacity: 4,
        format: 'In Person',
        datesOffered: 'Tuesday and Thursday',
        timeBlock: '10:00 AM - 12:00 PM'
    },

    {
        title: 'Statistics TA',
        description: 'Assist students with probability, statistics, data analysis, and statistical software.',
        field: 'Mathematics',
        professor: 'Dr. Davis',
        department: 'Mathematics',
        requirements: 'Completed Statistics',
        capacity: 3,
        format: 'Online',
        datesOffered: 'Wednesday and Friday',
        timeBlock: '11:00 AM - 1:00 PM'
    },

    {
        title: 'Technical Writing TA',
        description: 'Help students improve technical writing, documentation, and communication skills.',
        field: 'English',
        professor: 'Dr. Wilson',
        department: 'English',
        requirements: 'Strong writing skills',
        capacity: 2,
        format: 'Online',
        datesOffered: 'Monday and Wednesday',
        timeBlock: '3:00 PM - 5:00 PM'
    },

    {
        title: 'Introduction to Psychology TA',
        description: 'Assist students with introductory psychology coursework and assignments.',
        field: 'Psychology',
        professor: 'Dr. Miller',
        department: 'Psychology',
        requirements: 'Completed Introduction to Psychology',
        capacity: 3,
        format: 'In Person',
        datesOffered: 'Tuesday and Thursday',
        timeBlock: '9:00 AM - 11:00 AM'
    },

    {
        title: 'Cybersecurity Fundamentals TA',
        description: 'Help students understand basic cybersecurity concepts, threats, and security practices.',
        field: 'Cybersecurity',
        professor: 'Dr. Anderson',
        department: 'Cybersecurity',
        requirements: 'Completed Introduction to Cybersecurity',
        capacity: 3,
        format: 'In Person',
        datesOffered: 'Wednesday and Friday',
        timeBlock: '1:00 PM - 3:00 PM'
    }
];


db.serialize(() => {

    const professorIds = {
        'Dr. Smith': 1
    };


    /*
     * Add professors one at a time.
     */

    const addProfessor = (index) => {

        if (index >= professors.length) {
            addOpportunities();
            return;
        }

        const [name, email, role] = professors[index];

        db.run(
            `
                INSERT INTO users (
                    name,
                    email,
                    role
                )
                VALUES (?, ?, ?)
            `,
            [name, email, role],
            function(err) {

                if (err) {
                    console.error(
                        `Error adding ${name}:`,
                        err.message
                    );

                    return;
                }

                professorIds[name] = this.lastID;

                console.log(
                    `Added ${name} with ID ${this.lastID}`
                );

                addProfessor(index + 1);
            }
        );
    };


    /*
     * Add all TA opportunities after
     * the professors exist.
     */

    const addOpportunities = () => {

        const insertOpportunity = db.prepare(`
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
                ?, ?, 'TA', ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?
            )
        `);


        opportunities.forEach(opportunity => {

            const professorId =
                professorIds[opportunity.professor];


            insertOpportunity.run(
                [
                    opportunity.title,
                    opportunity.description,
                    opportunity.field,
                    '',
                    professorId,
                    opportunity.department,
                    opportunity.requirements,
                    opportunity.capacity,
                    'Fall 2026',
                    opportunity.format,
                    opportunity.datesOffered,
                    opportunity.timeBlock
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
                        `Added TA: ${opportunity.title} (ID ${this.lastID})`
                    );

                }
            );

        });


        insertOpportunity.finalize(() => {

            console.log(
                'All TA opportunities have been added.'
            );

            db.close();
        });
    };


    addProfessor(0);

});
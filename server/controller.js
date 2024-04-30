const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize(process.env.CONNECTION_STRING);

module.exports = {
    seed: (req, res) => {
        sequelize.query(`
            DROP TABLE IF EXISTS tasks;
            DROP TABLE IF EXISTS completed_tasks;
            DROP TABLE IF EXISTS users; 
            CREATE TABLE tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100),
                description VARCHAR(255),
                duedate DATE,
                priority VARCHAR(40),
                taskCode VARCHAR(40),
                status VARCHAR(20) DEFAULT 'Start'
            );

            CREATE TABLE completed_tasks (
                comp_task_id SERIAL PRIMARY KEY,
                title VARCHAR(100),
                description VARCHAR(255),
                duedate DATE,
                priority VARCHAR(30),
                taskCode VARCHAR(40),
                status VARCHAR(20) DEFAULT 'Completed',
                task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE
            );

            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE,
                email VARCHAR(100),
                password VARCHAR(100)
            );

            INSERT INTO tasks (title, description, duedate, priority, taskCode, status)
        VALUES
            ('Design landing page', 'Create wireframes and mockups for the landing page', '2024-04-25', 'High', 'TC001', 'Start'),
            ('Develop backend API', 'Implement RESTful API endpoints for backend services', '2024-04-26', 'Medium', 'TC002', 'Start'),
            ('Write project proposal', 'Draft a detailed project proposal for client review', '2024-04-27', 'Low', 'TC003', 'Start'),
            ('Test user authentication', 'Perform testing on user authentication module', '2024-04-28', 'High', 'TC004', 'Start'),
            ('Create database schema', 'Design and implement database schema for the project', '2024-04-29', 'Medium', 'TC005', 'Start'),
            ('Design marketing campaign', 'Create visuals and content for the upcoming marketing campaign', '2024-05-02', 'High', 'TC006', 'Start'),
            ('Optimize database queries', 'Identify and optimize slow-performing queries in the database', '2024-05-03', 'Medium', 'TC007', 'Start');
        `)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.error('Error seeding DB:', err);
            res.status(500).send('Error seeding DB');
        });
    },

    createTask: (req, res) => {
        const { title, description, duedate, priority, taskCode} = req.body;

        sequelize.query(
            `INSERT INTO tasks (title, description, duedate, priority, taskCode) VALUES ('${title}', '${description}', '${duedate}', '${priority}', '${taskCode}');`
        )
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {
            console.error('Error creating task:', err);
            res.status(500).send('Error creating task');
        });
    },

    deleteTask: (req, res) => {
        const { taskId } = req.params;
        sequelize.query(`DELETE FROM tasks WHERE id = ${taskId}`)
            .then(dbRes => {
                sequelize.query(`SELECT * FROM tasks`)
                    .then(tasks => res.status(200).send(tasks[0]))
                    .catch(err => {
                        console.error('Error fetching tasks after deletion:', err);
                        res.status(500).send('Error fetching tasks after deletion');
                    });
            })
            .catch(err => {
                console.error('Error deleting task:', err);
                res.status(500).send('Error deleting task');
            });
    },

    updateTask: (req, res) =>  {
        const { taskId } = req.params;
        const { status } = req.body;
        sequelize.query(`SELECT * FROM tasks WHERE id = ${taskId}`)
            .then(([task]) => {
                if (!task) {
                    return res.status(404).send("Task not found.");
                }
                return sequelize.query(`
                    UPDATE tasks 
                    SET status = '${status}'
                    WHERE id = ${taskId}
                    RETURNING *;
                `);
            })
            .then(([updatedTask]) => {
                if (status === "Completed") {
                    return sequelize.query(`
                        INSERT INTO completed_tasks (title, description, duedate, priority, taskCode, task_id)
                        SELECT title, description, duedate, priority, taskCode, id FROM tasks WHERE id = ${taskId};
                    `);
                }
            })
            .then(() => res.status(200).send("Task status updated successfully."))
            .catch(err => {
                console.error("Error updating task status:", err);
                res.status(500).send("Error updating task status");
            });
    },
    
    signup: (req, res) => {
        const { username, email, password } = req.body;
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                res.status(500).json({ error: 'Internal server error' });
            } else {
                sequelize.query(`
                    INSERT INTO users (username, email, password) 
                    VALUES ('${username}', '${email}', '${hashedPassword}');
                `)
                .then(() => {
                    res.status(200).json({ message: 'Signup successful' });
                })
                .catch(err => {
                    console.error('Error during signup:', err);
                    res.status(500).json({ error: 'Internal server error' });
                });
            }
        });
    },

    login: (req, res) => {
        const { username, password } = req.body;
        sequelize.query(`
            SELECT * FROM users WHERE username = '${username}';
        `)
        .then(dbRes => {
            if (dbRes[0].length === 0) {
                res.status(401).json({ error: 'Invalid username or password' });
            } else {
                const user = dbRes[0][0];
                bcrypt.compare(password, user.password)
                .then(isValidPassword => {
                    if (isValidPassword) {
                        res.status(200).json({ message: 'Login successful', user });
                    } else {
                        res.status(401).json({ error: 'Invalid username or password' });
                    }
                });
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
    },

    search: (req, res) => {
        const { title } = req.query;
        const searchQuery = `%${title}%`; 
        // Query to search tasks by title
        sequelize.query(
            "SELECT * FROM tasks WHERE title ILIKE :title",
            {
                replacements: { title: searchQuery },
                type: QueryTypes.SELECT
            }
        ).then(searchResults => {
            res.json(searchResults);
        }).catch(error => {
            console.error("Error searching tasks:", error);
            res.status(500).json({ error: "Internal server error" });
        });
    },

    getTasks: (req, res) => {
        let query = "SELECT * FROM tasks";
        const { title } = req.query;

        if (title) {
            const searchQuery = `%${title}%`; 
            query += " WHERE title ILIKE :title";
            sequelize.query(query, {
                replacements: { title: searchQuery },
                type: QueryTypes.SELECT
            }).then(tasks => {
                res.json(tasks);
            }).catch(error => {
                console.error("Error fetching tasks:", error);
                res.status(500).json({ error: "Internal server error" });
            });
        } else {
            sequelize.query(query, {
                type: QueryTypes.SELECT
            }).then(tasks => {
                res.json(tasks);
            }).catch(error => {
                console.error("Error fetching tasks:", error);
                res.status(500).json({ error: "Internal server error" });
            });
        }
    }
};

# Tasks Manager App

## Overview
The Tasks Manager App is a web application designed to help users efficiently manage their tasks. It provides an interactive platform for creating, organizing, tracking, starting, and completing tasks effectively, aiming to streamline the task management process and enhance productivity.

## MVP Features
- Task Creation
- Task Completion
- Task List
- Task Deletion
- User Search
- Profile Update

## Wireframes
Wireframes were created for various views including user login, sign up, task creation, task list, and task complete.

## To-Do List for Coding
Outlined steps for coding including setting up files, creating server, building HTML structure, writing JavaScript functions, styling views, implementing endpoints, utilizing Sequelize, and connecting front end to server.

## Pass off Plan
Reviewed the plan with a staff member for feedback and adjustments.

## GitHub Repo Setup
Created a folder, initialized a remote repository on GitHub, connected the local folder to the remote repo, and uploaded planning documentation.

## Installation Instructions
1. Clone the repository: `git clone https://github.com/Zentalm-Genet/Foundations-Capstone-Project.git>`
2. Install dependencies: `npm install`
3. Set up environment variables: Create a `.env` file and add necessary variables.
4. Set up database: Ensure PostgreSQL is installed and running, then run Sequelize migrations to set up the database schema.
5. Start the server: Run `npm start` to start the backend server.
6. Access the application: Open your browser and navigate to the specified URL.

## Data Model
### Tasks Table
- ID (Primary Key)
- Title
- Description
- Due Date
- Priority (Low, Medium, High)
- Status (Pending, In Progress, Completed)

### Completed_tasks Table
- ID (Primary Key)
- Title
- Description
- Due date
- Priority
- Status
- Com_id (reference to tasks(id))

### Users Table
- ID (Primary Key)
- Username
- Email Address
- Password

## Database
- Project includes a seed file or function to populate initial task data.
- App uses 3 tables for tasks, completed_tasks, and Users.
- App uses a foreign key to link tasks with completed_tasks.
- App uses a foreign key to link tasks with users.

## Coding
- Follow the outlined workflow for coding, starting with setting up HTML, CSS, and JS files.
- Build and test each feature incrementally, ensuring functionality and styling.
- Continuously update and refine the codebase based on testing and feedback.

## Dependencies
- "axios": "^1.6.8"
- "bcrypt": "^5.1.1"
- "body-parser": "^1.20.2"
- "cors": "^2.8.5"
- "dotenv": "^16.4.5"
- "express": "^4.19.2"
- "express-session": "^1.18.0"
- "jsonwebtoken": "^9.0.2"
- "multer": "^1.4.5-lts.1"
- "pg": "^8.11.5"
- "pg-hstore": "^2.3.4"

## Presentation
When presenting the project, focus on its purpose and demonstrate the MVP features. Avoid discussing broken or unimplemented features and aim for a recording between 2-3 minutes.

This project provides a structured approach for developing the Tasks Manager App, including database design and data model, ensuring adherence to the project requirements, and facilitating effective execution throughout the development process.

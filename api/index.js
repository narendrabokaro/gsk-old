const Joi = require('joi');
const express = require('express');
const cors = require('cors');
const app = express();

// Validate the Project form data as per requirement document
function validateProjects(project) {
    const projectSchema = {
        name: Joi.string().alphanum().min(10).max(80).required(),
        description: Joi.string().min(50).max(300).required(),
        startDate: Joi.date().required(),
        employees: Joi.array()
    };

    return Joi.validate(project, projectSchema);
};

// User list
const users = [
    {employeeID: 'gsk101', name: 'narendra singh'},
    {employeeID: 'gsk102', name: 'Gautam GopalKrishnan'},
    {employeeID: 'gsk104', name: 'Kavya'},
    {employeeID: 'gsk105', name: 'Subbu'},
    {employeeID: 'gsk106', name: 'Nitin Kapoor'},
    {employeeID: 'gsk107', name: 'Vaishali Malhotra'},
];

// Project list
const projects = [
    {id: 101, name: 'CentrumMedicineBuyingExperienceProj2020', description: 'User buying experience to show the market trend for Centrum medicine', startDate: '2020-05-05', employees: ['gsk101', 'gsk102']},
    {id: 102, name: 'TherafluMedicineSalesHistoryDeal2021', description: 'Medicine sales history to show sales performance of the Theraflu medicine', startDate: '2021-04-03', employees: ['gsk104', 'gsk105']},
    {id: 103, name: 'VentolinMedicineBuyingExperience2022', description: 'User buying experience to show the market trend for Ventolin medicine', startDate: '2022-09-03', employees: ['gsk106', 'gsk107']}
];

// Required middlewares
app.use(express.json());
app.use(cors());

// Get all users
app.get('/api/users', (req, res) => {
    res.send(users);
});

// Create a new user
app.post('/api/users', (req, res) => {
    const requestBody = req.body;
    // Validate the user formm data
    const userSchema = {
        employeeID: Joi.string().alphanum().length(6).required(),
        name: Joi.string().min(3).max(50).required()
    };
    const { error } = Joi.validate(req.body, userSchema);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // New project creation
    const newUser = {
        employeeID: requestBody.employeeID,
        name: requestBody.name
    };

    // Add the user to user list
    users.push(newUser);
    // Send the user as response
    res.send(newUser);
});

// PROJECTS API
// ------------

// Get all projects
app.get('/api/projects', (req, res) => {
    res.send(projects);
});

// Get a project
app.get('/api/projects/:id', (req, res) => {
    // Look up for the particular project
    const project = projects.find(p => p.id === parseInt(req.params.id));
    // If not found then send the response code with message
    if (!project) res.status(404).send('The project with given ID not found');
    // Send the project as response
    res.send(project);
});

// Create a new project
app.post('/api/projects', (req, res) => {
    const requestBody = req.body;
    // Validate the request
    const { error } = validateProjects(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // New project creation
    const newProject = {
        id: 100 + (projects.length + 1),
        name: requestBody.name,
        description: requestBody.description,
        startDate: requestBody.startDate,
        employees: requestBody.employees
    };
    // Add the new project to project list
    projects.push(newProject);
    // Send the project as response
    res.send(newProject);
});

// Update a project
app.put('/api/projects/:id', (req, res) => {
    const requestBody = req.body;
    // Look up for the project
    const project = projects.find(p => p.id === parseInt(req.params.id));

    // When project not found
    if (!project) {
        res.status(400).send('The project with given ID not found');
    }

    // Validate the request
    const { error } = validateProjects(req.body);
    if (error) {
        // Error found and send the response code with message
        res.status(400).send(error.details[0].message);
        return;
    }

    // update project
    project.name = requestBody.name;
    project.description = requestBody.description;
    project.startDate = requestBody.startDate;
    project.employees = requestBody.employees;

    // Send the project as response
    res.send(project);
});

app.listen(5000, () => console.log(`Example app listening on port :5000`))

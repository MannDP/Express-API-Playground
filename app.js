const express = require('express');
const Joi = require('@hapi/joi');

const app = express();
app.use(express.json());

const courses = [
    {id: 1, name: 'Course 1'},
    {id: 2, name: 'Course 2'},
    {id: 3, name: 'Course 3'},
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) res.status(404).send("Course not found.");
    res.send(course)
});

app.post('/api/courses', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required(),
    };
    
    const result = validateCourse(req);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) res.status(404).send("Course not found.");

    const result = validateCourse(req);
    
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);
});

function validateCourse(obj) {
    const schema = {
        name: Joi.string().min(3).required(),
    };
    return Joi.validate(obj.body, schema);
}

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}`));
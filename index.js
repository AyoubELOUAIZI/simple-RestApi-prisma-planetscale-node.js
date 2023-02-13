const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
//--------------------------------------------------------------------//

app.use(express.json());
app.get("/", async (req,res)=>{
res.send("hello world api is working nice ...");
});
//--------------------------------------------------------------------//

app.post('/person/add', async (req, res) => {
    const { fullName, age } = req.body;
    const newPerson = await prisma.person.create({
        data: {
            fullName,
            age,
        },
    });
    res.json(newPerson);
});
//--------------------------------------------------------------------//
//endpoint for the API that handles POST requests to create multiple person records at once
app.post('/person/multiple', async (req, res) => {
    console.log(req.body);
    // Extract the array of persons to create from the request body
    const { persons } = req.body;

    // Use the Prisma client to create all person records in the database
    const newPersons = await prisma.person.createMany({
        data: persons
    });

    // Send the newly created person records as a JSON response
    res.json(newPersons);
});

//--------------------------------------------------------------------//
app.get('/person', async (req, res) => {
    // Use the Prisma client to retrieve all person records from the database
    const persons = await prisma.person.findMany();

    // Send the retrieved records as a JSON response
    res.json(persons);
});
//--------------------------------------------------------------------//
// This code is an endpoint for the API that handles GET
// requests for a specific person record
app.get('/person/:id', async (req, res) => {
    const { id } = req.params;
    const person = await prisma.person.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    if (!person) {
        res.status(404).send('Person not found');
        return;
    }
    res.json(person);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


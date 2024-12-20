const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const DATA_FILE = './users.json';

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));


app.get('/', (req, res) => {
  res.send('Welcome to the REST API!');
});

app.get('/employees', (req, res) => {
  const data = readData();
  res.json(data.employees);
});

app.post('/employees', (req, res) => {
  const data = readData();
  if (data.employees.length >= 10) {
    return res.status(400).json({ error: 'Cannot add more than 10 employees.' });
  }

  const newEmployee = {
    id: data.employees.length + 1,
    name: req.body.name,
    position: req.body.position
  };
  data.employees.push(newEmployee);
  writeData(data);
  res.status(201).json(newEmployee);
});

app.get('/employees/:id', (req, res) => {
    const data = readData();
    const employee = data.employees.find((emp) => emp.id === parseInt(req.params.id));
    if (employee) {
      res.json({
        companyName: data.company.name,
        employee
      });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  });
  

app.delete('/employees/:id', (req, res) => {
  const data = readData();
  const employeeIndex = data.employees.findIndex((emp) => emp.id === parseInt(req.params.id));
  if (employeeIndex === -1) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  data.employees.splice(employeeIndex, 1);
  writeData(data);
  res.json({ message: 'Employee deleted successfully' });
});

app.get('/company', (req, res) => {
  const data = readData();
  res.json(data.company);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

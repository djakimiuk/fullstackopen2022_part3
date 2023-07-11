const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const id = Math.round(Math.random() * (10000000 - 1) + 1);
  if (persons.find((person) => person.id === id)) {
    return id + Date.now();
  } else {
    return id;
  }
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
    morgan.token("type", function (req, res) {
      return req.headers["content-type"];
    });
  } else {
    res.status(404).send(`not found`);
  }
});

app.get("/info", (req, res) => {
  const responseData = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`;
  res.send(responseData);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = +req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body || !body.name || !body.number) {
    return res.status(400).json({ error: "name and number must be filled in" });
  }
  if (persons.find((person) => person.name === body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);
  res.json(person);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

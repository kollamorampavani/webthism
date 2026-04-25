const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
let todos = [];
let currentId = 1;

// Routes

// 1. Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// 2. Add a new todo
app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newTodo = {
    id: currentId++,
    title,
    completed: false, // optional field depending on if we add a checkbox, let's keep it simple
    createdAt: new Date()
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// 3. Delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = todos.length;
  
  todos = todos.filter(todo => todo.id !== parseInt(id));
  
  if (todos.length < initialLength) {
    res.json({ message: 'Todo deleted successfully' });
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

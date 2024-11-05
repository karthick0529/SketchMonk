const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

let columns = [
  {
    id: '1',
    title: "To do",
    tasks: [],
  },
  {
    id: '2',
    title: "In Progress",
    tasks: [
      {
        id: '1',
        title: "Add buttons",
        assignee: {
          name: "John Doe",
          avatar: "https://i.pravatar.cc/40?img=1",
        },
        date: "Yesterday",
        tag: "Programming",
      },
      {
        id: '2',
        title: "Logo revision",
        assignee: {
          name: "Jane Smith",
          avatar: "https://i.pravatar.cc/40?img=2",
        },
        date: "Tomorrow",
        tag: "Design",
      },
    ],
  },
  {
    id: '3',
    title: "Done",
    tasks: [
      {
        id: '3',
        title: "UI-Kit",
        assignee: {
          name: "Alice Brown",
          avatar: "https://i.pravatar.cc/40?img=3",
        },
        date: "Tomorrow",
        tag: "Design",
      },
      {
        id: '4',
        title: "Managing",
        assignee: {
          name: "Bob Wilson",
          avatar: "https://i.pravatar.cc/40?img=4",
        },
        date: "Today",
        tag: "Design",
      },
    ],
  },
];

// Endpoint to get all columns
app.get('/api/columns', (req, res) => {
  res.json(columns);
});

// Endpoint to add a new column
app.post('/api/columns', (req, res) => {
  const newColumn = { id: Date.now().toString(), title: req.body.title, tasks: [] };
  columns.push(newColumn);
  res.json(newColumn);
});

// Endpoint to delete a column
app.delete('/api/columns/:columnId', (req, res) => {
  const { columnId } = req.params;
  columns = columns.filter((column) => column.id !== columnId);
  res.sendStatus(204);
});

// Endpoint to add a new task to a specific column
app.post('/api/tasks', (req, res) => {
  const { columnId, title, assignee, date, tag } = req.body;
  const column = columns.find((col) => col.id === columnId);

  if (column) {
    const newTask = { id: Date.now().toString(), title, assignee, date, tag };
    column.tasks.push(newTask);
    res.json(newTask);
  } else {
    res.status(404).json({ error: 'Column not found' });
  }
});

// Endpoint to delete a task from a specific column
app.delete('/api/tasks/:taskId/:columnId', (req, res) => {
  const { taskId, columnId } = req.params;
  const column = columns.find((col) => col.id === columnId);

  if (column) {
    column.tasks = column.tasks.filter((task) => task.id !== taskId);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Column not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

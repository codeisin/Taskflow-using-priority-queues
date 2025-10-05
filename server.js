import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import PriorityQueue from 'priorityqueuejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(express.static(__dirname));

// 🧠 In-memory Priority Queue
const taskQueue = new PriorityQueue((a, b) => b.priority - a.priority);

// API to add a task
app.post('/api/tasks', (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).json({ error: 'Task name required' });

  const priority = name.toLowerCase().includes('urgent') ? 100 : name.length;
  taskQueue.enq({ name, priority });
  res.json({ message: 'Task added', name, priority });
});

// API to get tasks
app.get('/api/tasks', (req, res) => {
  const temp = [];
  const backup = [];

  while (!taskQueue.isEmpty()) {
    const task = taskQueue.deq();
    temp.push(task);
    backup.push(task);
  }

  backup.forEach(task => taskQueue.enq(task)); // Restore state
  res.json(temp);
});

const PORT =3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


async function addTask() {
  const task = document.getElementById('taskInput').value.trim();

  if (!task) {
    alert("Please enter a task.");
    return;
  }

  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: task })
  });

  if (response.ok) {
    document.getElementById('taskInput').value = '';
    loadTasks();
  } else {
    alert("Failed to add task.");
  }
}

async function loadTasks() {
  const response = await fetch('/api/tasks');
  const tasks = await response.json();
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = `${task.name} (Priority: ${task.priority})`;
    list.appendChild(li);
  });
}

window.onload = loadTasks;

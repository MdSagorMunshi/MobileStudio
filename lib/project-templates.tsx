import { fileSystem } from "./file-system"

export interface Template {
  id: string
  name: string
  description: string
  files: {
    name: string
    content: string
    path: string
  }[]
}

export const projectTemplates: Template[] = [
  {
    id: "blank",
    name: "Blank Project",
    description: "Start with a clean slate",
    files: [
      {
        name: "index.html",
        path: "src/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
      },
    ],
  },
  {
    id: "landing",
    name: "Landing Page",
    description: "Modern landing page template",
    files: [
      {
        name: "index.html",
        path: "src/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <nav>
      <div class="logo">Brand</div>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <section class="hero">
      <h1>Welcome to Our Product</h1>
      <p>The best solution for your needs</p>
      <button>Get Started</button>
    </section>
  </main>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        path: "src/style.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}

header {
  background: #1a1a1a;
  color: white;
  padding: 1rem 2rem;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
}

nav a {
  color: white;
  text-decoration: none;
}

.hero {
  text-align: center;
  padding: 5rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}`,
      },
      {
        name: "script.js",
        path: "src/script.js",
        content: `console.log('Landing page loaded');

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('button');
  button.addEventListener('click', () => {
    alert('Getting started!');
  });
});`,
      },
    ],
  },
  {
    id: "todo",
    name: "Todo App",
    description: "Simple todo list application",
    files: [
      {
        name: "index.html",
        path: "src/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Todo List</h1>
    <div class="input-group">
      <input type="text" id="todoInput" placeholder="Add a new task...">
      <button id="addBtn">Add</button>
    </div>
    <ul id="todoList"></ul>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        path: "src/style.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  background: #f5f5f5;
  padding: 2rem;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

#todoList {
  list-style: none;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}`,
      },
      {
        name: "script.js",
        path: "src/script.js",
        content: `const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

let todos = [];

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  todos.push({ id: Date.now(), text });
  todoInput.value = '';
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = \`
      <span>\${todo.text}</span>
      <button onclick="deleteTodo(\${todo.id})">Delete</button>
    \`;
    todoList.appendChild(li);
  });
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});`,
      },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Personal portfolio website",
    files: [
      {
        name: "index.html",
        path: "src/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>John Doe</h1>
    <p>Web Developer</p>
  </header>
  <main>
    <section id="about">
      <h2>About Me</h2>
      <p>I'm a passionate web developer with expertise in modern web technologies.</p>
    </section>
    <section id="projects">
      <h2>Projects</h2>
      <div class="project-grid">
        <div class="project">
          <h3>Project 1</h3>
          <p>Description of project 1</p>
        </div>
        <div class="project">
          <h3>Project 2</h3>
          <p>Description of project 2</p>
        </div>
      </div>
    </section>
  </main>
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "style.css",
        path: "src/style.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, sans-serif;
  line-height: 1.6;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 4rem 2rem;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

section {
  margin-bottom: 3rem;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.project {
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 10px;
}`,
      },
      {
        name: "script.js",
        path: "src/script.js",
        content: `console.log('Portfolio loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialized');
});`,
      },
    ],
  },
]

export async function createProjectFromTemplate(templateId: string) {
  const template = projectTemplates.find((t) => t.id === templateId)
  if (!template) {
    throw new Error("Template not found")
  }

  // Clear existing files
  const allFiles = await fileSystem.getAllFiles()
  for (const file of allFiles) {
    await fileSystem.deleteFile(file.id)
  }

  // Create root folder
  const root = await fileSystem.createFolder("project", null)

  // Create src folder
  const srcFolder = await fileSystem.createFolder("src", root.id)

  // Create files from template
  for (const file of template.files) {
    await fileSystem.createFile(file.name, srcFolder.id, file.content)
  }
}

import { fileSystem } from "./file-system"

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  files: {
    name: string
    content: string
  }[]
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "blank",
    name: "Blank Project",
    description: "Start with an empty project",
    icon: "📄",
    files: [
      {
        name: "index.html",
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
    description: "Modern landing page with hero section",
    icon: "🚀",
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav class="navbar">
    <div class="container">
      <div class="logo">MyApp</div>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <h1>Build Something Amazing</h1>
      <p>The best platform to bring your ideas to life</p>
      <button class="cta-button">Get Started</button>
    </div>
  </section>

  <section id="features" class="features">
    <div class="container">
      <h2>Features</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h3>⚡ Fast</h3>
          <p>Lightning-fast performance</p>
        </div>
        <div class="feature-card">
          <h3>🔒 Secure</h3>
          <p>Enterprise-grade security</p>
        </div>
        <div class="feature-card">
          <h3>📱 Responsive</h3>
          <p>Works on all devices</p>
        </div>
      </div>
    </div>
  </section>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "styles.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #667eea;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8rem 0;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  background: white;
  color: #667eea;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.3s;
}

.cta-button:hover {
  transform: scale(1.05);
}

.features {
  padding: 4rem 0;
}

.features h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  border-radius: 10px;
  background: #f8f9fa;
  text-align: center;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}`,
      },
      {
        name: "script.js",
        content: `document.querySelector('.cta-button').addEventListener('click', () => {
  alert('Welcome! Let\\'s get started.');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});`,
      },
    ],
  },
  {
    id: "todo",
    name: "Todo App",
    description: "Simple todo list application",
    icon: "✅",
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>My Todo List</h1>
    <div class="input-container">
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
        name: "styles.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

h1 {
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5rem;
}

#todoInput {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

#todoInput:focus {
  border-color: #667eea;
}

#addBtn {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

#addBtn:hover {
  background: #5568d3;
}

#todoList {
  list-style: none;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s;
}

.todo-item:hover {
  background: #e9ecef;
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-item.completed span {
  text-decoration: line-through;
}

.todo-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todo-item span {
  flex: 1;
  color: #333;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #c82333;
}`,
      },
      {
        name: "script.js",
        content: `let todos = JSON.parse(localStorage.getItem('todos')) || [];

const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    
    li.innerHTML = \`
      <input type="checkbox" \${todo.completed ? 'checked' : ''} onchange="toggleTodo(\${index})">
      <span>\${todo.text}</span>
      <button class="delete-btn" onclick="deleteTodo(\${index})">Delete</button>
    \`;
    
    todoList.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (text) {
    todos.push({ text, completed: false });
    todoInput.value = '';
    saveTodos();
    renderTodos();
  }
}

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

renderTodos();`,
      },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Personal portfolio website",
    icon: "💼",
    files: [
      {
        name: "index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Portfolio</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav>
      <div class="logo">John Doe</div>
      <ul class="nav-menu">
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <section class="hero">
    <h1>Hi, I'm John Doe</h1>
    <p>Full Stack Developer & Designer</p>
  </section>

  <section id="about" class="about">
    <div class="container">
      <h2>About Me</h2>
      <p>I'm a passionate developer with experience in web technologies. I love creating beautiful and functional websites.</p>
    </div>
  </section>

  <section id="projects" class="projects">
    <div class="container">
      <h2>My Projects</h2>
      <div class="project-grid">
        <div class="project-card">
          <h3>Project 1</h3>
          <p>Description of project 1</p>
        </div>
        <div class="project-card">
          <h3>Project 2</h3>
          <p>Description of project 2</p>
        </div>
        <div class="project-card">
          <h3>Project 3</h3>
          <p>Description of project 3</p>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="container">
      <h2>Get In Touch</h2>
      <p>Email: john@example.com</p>
    </div>
  </section>

  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        name: "styles.css",
        content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

header {
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover {
  color: #667eea;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 8rem 2rem;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.5rem;
  opacity: 0.9;
}

section {
  padding: 4rem 0;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.about {
  background: #f8f9fa;
}

.about p {
  text-align: center;
  font-size: 1.125rem;
  max-width: 600px;
  margin: 0 auto;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-card h3 {
  margin-bottom: 1rem;
  color: #667eea;
}

.contact {
  background: #f8f9fa;
  text-align: center;
}

.contact p {
  font-size: 1.125rem;
}`,
      },
      {
        name: "script.js",
        content: `document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

console.log('Portfolio loaded successfully!');`,
      },
    ],
  },
]

export async function createProjectFromTemplate(templateId: string): Promise<void> {
  const template = projectTemplates.find((t) => t.id === templateId)
  if (!template) {
    throw new Error("Template not found")
  }

  await fileSystem.clearAll()

  for (const file of template.files) {
    await fileSystem.createFile(file.name, null, file.content)
  }
}

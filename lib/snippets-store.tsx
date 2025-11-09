"use client"

export interface Snippet {
  id: string
  name: string
  description: string
  code: string
  language: string
  category: string
}

const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: "react-component",
    name: "React Component",
    description: "Basic React functional component",
    language: "typescript",
    category: "React",
    code: `export default function Component() {
  return (
    <div>
      <h1>Component</h1>
    </div>
  )
}`,
  },
  {
    id: "react-usestate",
    name: "useState Hook",
    description: "React useState hook example",
    language: "typescript",
    category: "React",
    code: `const [state, setState] = useState(initialValue)`,
  },
  {
    id: "react-useeffect",
    name: "useEffect Hook",
    description: "React useEffect hook example",
    language: "typescript",
    category: "React",
    code: `useEffect(() => {
  // Effect code here
  
  return () => {
    // Cleanup code here
  }
}, [dependencies])`,
  },
  {
    id: "html-template",
    name: "HTML Template",
    description: "Basic HTML5 template",
    language: "html",
    category: "HTML",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`,
  },
  {
    id: "css-flexbox",
    name: "Flexbox Container",
    description: "CSS Flexbox container",
    language: "css",
    category: "CSS",
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}`,
  },
  {
    id: "css-grid",
    name: "Grid Container",
    description: "CSS Grid container",
    language: "css",
    category: "CSS",
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}`,
  },
  {
    id: "js-fetch",
    name: "Fetch API",
    description: "Fetch API example",
    language: "javascript",
    category: "JavaScript",
    code: `fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))`,
  },
  {
    id: "js-async",
    name: "Async Function",
    description: "Async/await function",
    language: "javascript",
    category: "JavaScript",
    code: `async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}`,
  },
  {
    id: "ts-interface",
    name: "TypeScript Interface",
    description: "TypeScript interface definition",
    language: "typescript",
    category: "TypeScript",
    code: `interface User {
  id: number
  name: string
  email: string
  isActive: boolean
}`,
  },
  {
    id: "ts-type",
    name: "TypeScript Type",
    description: "TypeScript type alias",
    language: "typescript",
    category: "TypeScript",
    code: `type Status = 'pending' | 'active' | 'completed'`,
  },
]

class SnippetsStore {
  private snippets: Snippet[] = []

  async init() {
    const stored = localStorage.getItem("mobilestudio-snippets")
    if (stored) {
      this.snippets = JSON.parse(stored)
    } else {
      this.snippets = DEFAULT_SNIPPETS
      this.save()
    }
  }

  getSnippets(): Snippet[] {
    return [...this.snippets]
  }

  getSnippetsByCategory(category: string): Snippet[] {
    return this.snippets.filter((s) => s.category === category)
  }

  getCategories(): string[] {
    const categories = new Set(this.snippets.map((s) => s.category))
    return Array.from(categories)
  }

  addSnippet(snippet: Omit<Snippet, "id">): Snippet {
    const newSnippet: Snippet = {
      ...snippet,
      id: Date.now().toString(),
    }
    this.snippets.push(newSnippet)
    this.save()
    return newSnippet
  }

  updateSnippet(id: string, updates: Partial<Omit<Snippet, "id">>) {
    const index = this.snippets.findIndex((s) => s.id === id)
    if (index !== -1) {
      this.snippets[index] = { ...this.snippets[index], ...updates }
      this.save()
    }
  }

  deleteSnippet(id: string) {
    this.snippets = this.snippets.filter((s) => s.id !== id)
    this.save()
  }

  private save() {
    localStorage.setItem("mobilestudio-snippets", JSON.stringify(this.snippets))
  }
}

export const snippetsStore = new SnippetsStore()

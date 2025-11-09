"use client"

export interface Snippet {
  id: string
  title: string
  description: string
  language: string
  code: string
  category: string
}

const SNIPPETS_KEY = "mobilestudio_snippets"

export const DEFAULT_SNIPPETS: Snippet[] = [
  {
    id: "react-component",
    title: "React Component",
    description: "Basic React functional component",
    language: "typescript",
    category: "React",
    code: `export default function ComponentName() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}`,
  },
  {
    id: "react-useState",
    title: "React useState Hook",
    description: "Component with useState hook",
    language: "typescript",
    category: "React",
    code: `import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}`,
  },
  {
    id: "react-useEffect",
    title: "React useEffect Hook",
    description: "Component with useEffect hook",
    language: "typescript",
    category: "React",
    code: `import { useEffect, useState } from 'react'

export default function DataFetcher() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    // Fetch data or setup subscription
    return () => {
      // Cleanup
    }
  }, [])
  
  return <div>{data}</div>
}`,
  },
  {
    id: "html-boilerplate",
    title: "HTML5 Boilerplate",
    description: "Basic HTML5 document structure",
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
    title: "CSS Flexbox Container",
    description: "Flex container with common properties",
    language: "css",
    category: "CSS",
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}`,
  },
  {
    id: "css-grid",
    title: "CSS Grid Layout",
    description: "Grid container with responsive columns",
    language: "css",
    category: "CSS",
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}`,
  },
  {
    id: "js-async",
    title: "Async Function",
    description: "Async/await function template",
    language: "javascript",
    category: "JavaScript",
    code: `async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}`,
  },
  {
    id: "js-array-methods",
    title: "Array Methods",
    description: "Common array manipulation methods",
    language: "javascript",
    category: "JavaScript",
    code: `const items = [1, 2, 3, 4, 5]

// Map
const doubled = items.map(x => x * 2)

// Filter
const evens = items.filter(x => x % 2 === 0)

// Reduce
const sum = items.reduce((acc, x) => acc + x, 0)

// Find
const found = items.find(x => x > 3)`,
  },
  {
    id: "ts-interface",
    title: "TypeScript Interface",
    description: "Define a TypeScript interface",
    language: "typescript",
    category: "TypeScript",
    code: `interface User {
  id: string
  name: string
  email: string
  age?: number
  roles: string[]
}`,
  },
  {
    id: "ts-type",
    title: "TypeScript Type Alias",
    description: "Define a TypeScript type",
    language: "typescript",
    category: "TypeScript",
    code: `type Status = 'pending' | 'active' | 'completed'

type Result<T> = {
  data: T
  error?: string
}`,
  },
]

class SnippetsStore {
  private snippets: Snippet[] = []

  async init() {
    const stored = localStorage.getItem(SNIPPETS_KEY)
    if (stored) {
      this.snippets = JSON.parse(stored)
    } else {
      this.snippets = DEFAULT_SNIPPETS
      this.save()
    }
  }

  private save() {
    localStorage.setItem(SNIPPETS_KEY, JSON.stringify(this.snippets))
  }

  getAll(): Snippet[] {
    return this.snippets
  }

  getByCategory(category: string): Snippet[] {
    return this.snippets.filter((s) => s.category === category)
  }

  getCategories(): string[] {
    const categories = new Set(this.snippets.map((s) => s.category))
    return Array.from(categories)
  }

  search(query: string): Snippet[] {
    const lowerQuery = query.toLowerCase()
    return this.snippets.filter(
      (s) =>
        s.title.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.code.toLowerCase().includes(lowerQuery),
    )
  }

  add(snippet: Omit<Snippet, "id">): Snippet {
    const newSnippet = {
      ...snippet,
      id: Date.now().toString(),
    }
    this.snippets.push(newSnippet)
    this.save()
    return newSnippet
  }

  update(id: string, updates: Partial<Snippet>) {
    const index = this.snippets.findIndex((s) => s.id === id)
    if (index !== -1) {
      this.snippets[index] = { ...this.snippets[index], ...updates }
      this.save()
    }
  }

  delete(id: string) {
    this.snippets = this.snippets.filter((s) => s.id !== id)
    this.save()
  }
}

export const snippetsStore = new SnippetsStore()

// Detect programming language from file extension

export function detectLanguage(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase()

  const languageMap: Record<string, string> = {
    // Web
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    json: "json",
    xml: "xml",
    svg: "xml",

    // Backend
    py: "python",
    rb: "ruby",
    php: "php",
    java: "java",
    kt: "kotlin",
    go: "go",
    rs: "rust",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    swift: "swift",

    // Shell & Config
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    yml: "yaml",
    yaml: "yaml",
    toml: "toml",
    ini: "ini",
    env: "shell",

    // Markup & Data
    md: "markdown",
    mdx: "markdown",
    txt: "plaintext",
    sql: "sql",
    graphql: "graphql",
    gql: "graphql",

    // Other
    dockerfile: "dockerfile",
    gitignore: "plaintext",
  }

  return languageMap[extension || ""] || "plaintext"
}

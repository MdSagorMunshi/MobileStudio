import prettier from "prettier/standalone"
import parserBabel from "prettier/parser-babel"
import parserTypescript from "prettier/parser-typescript"
import parserHtml from "prettier/parser-html"
import parserCss from "prettier/parser-postcss"
import parserMarkdown from "prettier/parser-markdown"

export async function formatCode(code: string, language: string): Promise<string> {
  try {
    let parser: string
    let plugins: any[]

    switch (language.toLowerCase()) {
      case "javascript":
      case "jsx":
        parser = "babel"
        plugins = [parserBabel]
        break
      case "typescript":
      case "tsx":
        parser = "typescript"
        plugins = [parserTypescript]
        break
      case "html":
        parser = "html"
        plugins = [parserHtml]
        break
      case "css":
      case "scss":
      case "less":
        parser = "css"
        plugins = [parserCss]
        break
      case "json":
        parser = "json"
        plugins = [parserBabel]
        break
      case "markdown":
      case "md":
        parser = "markdown"
        plugins = [parserMarkdown]
        break
      default:
        return code
    }

    const formatted = await prettier.format(code, {
      parser,
      plugins,
      semi: false,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "es5",
      printWidth: 100,
      arrowParens: "always",
    })

    return formatted
  } catch (error) {
    console.error("[v0] Formatting error:", error)
    throw new Error("Failed to format code")
  }
}

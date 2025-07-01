// src/lib/languageDetector.ts
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import sql    from 'highlight.js/lib/languages/sql'
import rlang  from 'highlight.js/lib/languages/r'
import sas    from 'highlight.js/lib/languages/sas'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import java from 'highlight.js/lib/languages/java'
import csharp from 'highlight.js/lib/languages/csharp'
import cpp from 'highlight.js/lib/languages/cpp'
import c from 'highlight.js/lib/languages/c'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import swift from 'highlight.js/lib/languages/swift'
import kotlin from 'highlight.js/lib/languages/kotlin'
import scala from 'highlight.js/lib/languages/scala'
import perl from 'highlight.js/lib/languages/perl'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'

// Register all languages for detection
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql',    sql)
hljs.registerLanguage('r',      rlang)
hljs.registerLanguage('sas',    sas)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('java', java)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c', c)
hljs.registerLanguage('php', php)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('go', go)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('swift', swift)
hljs.registerLanguage('kotlin', kotlin)
hljs.registerLanguage('scala', scala)
hljs.registerLanguage('perl', perl)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('markdown', markdown)

// Languages supported for conversion
const SUPPORTED_FOR_CONVERSION = new Set(['python','sql','r','sas'])

/**
 * Uses highlight.js to auto-detect language from a wider set of languages.
 * Returns the detected language name or empty string if not detected.
 */
export function detectLanguage(code: string): string {
  const txt = code.trim()
  if (!txt) return ''

  // Auto-detect from all registered languages
  const { language } = hljs.highlightAuto(txt)
  return language || ''
}

/**
 * Check if a language is supported for conversion
 */
export function isLanguageSupportedForConversion(language: string): boolean {
  return SUPPORTED_FOR_CONVERSION.has(language)
}

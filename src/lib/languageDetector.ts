// src/lib/languageDetector.ts
import hljs from 'highlight.js/lib/core'
import python from 'highlight.js/lib/languages/python'
import sql    from 'highlight.js/lib/languages/sql'
import rlang  from 'highlight.js/lib/languages/r'
import sas    from 'highlight.js/lib/languages/sas'

// register just these four
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql',    sql)
hljs.registerLanguage('r',      rlang)
hljs.registerLanguage('sas',    sas)

const SUPPORTED = new Set(['python','sql','r','sas'])

/**
 * Uses highlight.js to auto-detect.  You can even pass
 * your SUPPORTED array as a hint so it only considers those.
 * Returns one of 'python'|'sql'|'r'|'sas', or '' otherwise.
 */
export function detectLanguage(code: string): string {
  const txt = code.trim()
  if (!txt) return ''

  // pass SUPPORTED to limit detection scope
  const { language } = hljs.highlightAuto(txt, Array.from(SUPPORTED))  // :contentReference[oaicite:0]{index=0}
  return SUPPORTED.has(language) ? language : ''
}

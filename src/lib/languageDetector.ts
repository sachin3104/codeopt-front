// src/utils/languageDetector.ts

// Only these four get labels
const SUPPORTED = new Set(['python','sql','r','sas'])

/**
 * Pure-regex detector for Python, SQL, R, SAS.
 * Returns one of 'python'|'sql'|'r'|'sas', or '' otherwise.
 */
export function detectLanguage(code: string): string {
  const txt = code.trim()
  if (!txt) return ''

  // 1) SAS: DATA step or PROC step (must end with semicolon)
  //    e.g. "data foo;" or "proc print data=foo;"
  if (/^\s*(?:data\s+\w+\s*;|proc\s+\w+\b[\s\S]*?;)/i.test(txt)) {
    return 'sas'
  }

  // 2) SQL: starts with a DML/DDL keyword + semicolon
  //    e.g. "SELECT * FROM tbl;" or "CREATE TABLE x (...);"
  if (/^\s*(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|WITH)\b[\s\S]*?;/i.test(txt)) {
    return 'sql'
  }

  // 3) R: assignment "<-" or library()/require()/paste0()
  //    e.g. "x <- 1", "foo <- function(a)...", "library(ggplot2)"
  if (
    /^\s*[\w.]+\s*<-\s*.+/m.test(txt) ||
    /\b(?:library|require|paste0)\s*\(/i.test(txt)
  ) {
    return 'r'
  }

  // 4) Python: def/class/import/from/print or a function/statement line ending in ":"
  //    e.g. "def foo():", "class Bar:", "import os", "from sys import argv"
  if (
    /^\s*(?:def|class|import|from|print)\b/.test(txt) ||
    /^\s*[\w_]+\s*\(.*\)\s*:$/.test(txt.split('\n', 1)[0])
  ) {
    return 'python'
  }

  // else: unsupported
  return ''
}

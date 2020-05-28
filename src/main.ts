import fs from 'fs'
import path from 'path'
import clipboardy from 'clipboardy'

const cookies: string[] = fs
  .readFileSync(path.join(__dirname, 'cookie.txt'), 'utf8')
  .trim()
  .replace(/^-H 'cookie: /, '')
  .replace(/' \\$/, '')
  .split('; ')
  .filter(Boolean)

const cookieObj: Record<string, string> = {}

for (const cookie of cookies) {
  // In case there is an `=` in the value, we'll join it back together
  const [name, ...value] = cookie.split('=')
  cookieObj[name] = value.join('')
}

if (process.env.DELETE) {
  for (const deleteCookie of process.env.DELETE.split(',')) {
    delete cookieObj[deleteCookie]
  }
}

const newCookies = []
for (const name in cookieObj) {
  newCookies.push(`${name}=${cookieObj[name]}`)
}

clipboardy.writeSync(`-H 'cookie: ${newCookies.join('; ')}' \\`)

console.log('Remaining Cookies:\n\n', Object.keys(cookieObj).join('\n'))

console.log('\nNew cookie value copied to clipboard!')

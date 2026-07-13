import { execSync }             from 'node:child_process'
import { rmSync, existsSync }   from 'node:fs'
import { resolve }              from 'node:path'
import { fileURLToPath }        from 'node:url'

const root = resolve(fileURLToPath(import.meta.url), '../..')
const dist = resolve(root, 'dist')
const repo = 'https://github.com/JCarlosJimenezC/JUEGO-DE-SERPIENTES---UCR.git'

const run = (cmd, cwd = root) =>
  execSync(cmd, { stdio: 'inherit', cwd })

// 1. Build
console.log('\n📦 Building...')
run('npx vite build')

// 2. Limpiar .git anterior dentro de dist si existe
const distGit = resolve(dist, '.git')
if (existsSync(distGit)) rmSync(distGit, { recursive: true, force: true })

// 3. Push dist a rama gh-pages
console.log('\n🚀 Deploying to gh-pages...')
run('git init -b gh-pages',                 dist)
run('git add -A',                           dist)
run('git commit -m "deploy"',               dist)
run(`git push -f ${repo} gh-pages`,         dist)

// 4. Limpiar .git de dist para no ensuciar el repo principal
rmSync(distGit, { recursive: true, force: true })

console.log('\n✅ Listo! Sitio en:')
console.log('   https://jcarlosjimenezc.github.io/JUEGO-DE-SERPIENTES---UCR/\n')

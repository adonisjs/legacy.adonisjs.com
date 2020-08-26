const execa = require('execa')
const kleur = require('kleur')
const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000 * 10))

async function runCommand(command, args) {
  console.log(kleur.green(command), kleur.yellow(args.join(' ')))
  const { stdout, stderr, exitCode } = await execa(command, args)
  if (stderr) {
    console.error(stderr)
  }

  if (stdout) {
    console.log(stdout)
  }

  if (exitCode !== 0) {
    console.error(kleur.red(`Exited with code ${exitCode}`))
  } else {
    console.log(kleur.green(`Exited with code 0`))
  }
}

function chdir(dir) {
  console.log(kleur.gray(`cd ${dir}`))
  process.chdir(dir)
}

async function run () {
  await runCommand('rm', ['-rf', 'prod'])

  chdir('docs')
  await runCommand('npm', ['install'])

  console.log(kleur.green('npm'), kleur.yellow('run serve &'))
  const subProcess = execa('npm', ['run', 'serve'], { stdout: 'pipe' })
  subProcess.stdout.pipe(process.stdout)
  subProcess.stderr.pipe(process.stderr)

  await sleep()

  chdir('../frontend')
  await runCommand('npm', ['install'])
  await runCommand('npm', ['run', 'build'])

  chdir('../')
  await runCommand('mkdir', ['prod'])
  await runCommand('mv', ['frontend/dist', 'prod/public'])

  subProcess.cancel()
}

run().catch(() => process.exit(1)).then(() => process.exit(0))

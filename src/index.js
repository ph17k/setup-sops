import * as core from '@actions/core'
import { installSops, installAge } from './tools.js'
import { addKeys } from './keys.js'

try {
  const sopsVersion = core.getInput('sops-version')
  const ageVersion = core.getInput('age-version')
  const ageKey = core.getInput('age-key')

  await installSops(sopsVersion)
  await installAge(ageVersion)

  addKeys({ age: ageKey })

  core.info('Setup completed successfully')
} catch (error) {
  core.setFailed(error.message)
}

import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

function addAgeKey(key) {
  core.info('Setting up AGE key for SOPS...')

  // Create the .config/sops/age directory if it doesn't exist
  const homeDir = os.homedir()
  const sopsAgeDir = path.join(homeDir, '.config', 'sops', 'age')

  if (!fs.existsSync(sopsAgeDir)) {
    fs.mkdirSync(sopsAgeDir, { recursive: true })
  }

  // Write the AGE key to the keys.txt file
  const keysFilePath = path.join(sopsAgeDir, 'keys.txt')
  fs.writeFileSync(keysFilePath, key + '\n')

  // Set proper permissions (600 = rw-------)
  fs.chmodSync(keysFilePath, 0o600)

  // Set the SOPS_AGE_KEY_FILE environment variable for the current action
  core.exportVariable('SOPS_AGE_KEY_FILE', keysFilePath)

  core.info('AGE key has been configured for SOPS successfully!')
  core.info(`SOPS_AGE_KEY_FILE is set to: ${keysFilePath}`)
}

function addKeys({ age }) {
  if (age && age.length > 0) {
    addAgeKey(age)
  }
}

export { addKeys }

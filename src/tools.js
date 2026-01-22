import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as path from 'path'
import * as fs from 'fs'

function getArch() {
  const platform = process.platform

  if (platform !== 'linux') {
    throw new Error(`Unsupported platform: ${platform}. Only Linux is supported.`)
  }

  let arch
  switch (process.arch) {
    case 'x64':
      arch = 'amd64'
      break
    case 'arm64':
      arch = 'arm64'
      break
    default:
      throw new Error(`Unsupported architecture: ${process.arch}. Only amd64 and arm64 are supported.`)
  }
  return { arch, platform }
}

async function installSops(version) {
  core.info(`Installing SOPS version: ${version}`)

  const { arch } = getArch()
  const toolName = 'sops'
  const fileName = 'sops'
  const downloadUrl = `https://github.com/getsops/sops/releases/download/v${version}/sops-v${version}.linux.${arch}`

  core.info(`Downloading SOPS ${version} from ${downloadUrl}`)

  // Check if tool is already cached
  let toolDir = tc.find(toolName, version)

  if (!toolDir) {
    // Download the binary
    const downloadPath = await tc.downloadTool(downloadUrl)

    // Create tool directory
    const extractDir = await tc.cacheFile(downloadPath, fileName, toolName, version)
    toolDir = extractDir

    // Make executable
    const toolPath = path.join(toolDir, fileName)
    fs.chmodSync(toolPath, '755')
  }

  // Add to PATH
  core.addPath(toolDir)
  core.info(`SOPS ${version} installed and added to PATH`)
}

async function installAge(version) {
  core.info(`Installing age version: ${version}`)

  const { arch } = getArch()
  const toolName = 'age'
  const archiveName = `age-v${version}-linux-${arch}.tar.gz`
  const downloadUrl = `https://github.com/FiloSottile/age/releases/download/v${version}/${archiveName}`

  core.info(`Downloading age ${version} from ${downloadUrl}`)

  // Check if tool is already cached
  let toolDir = tc.find(toolName, version)

  if (!toolDir) {
    // Download the archive
    const downloadPath = await tc.downloadTool(downloadUrl)

    // Extract the tar.gz archive
    const extractDir = await tc.extractTar(downloadPath)

    const extractedFolderName = 'age'
    const extractedFolderPath = path.join(extractDir, extractedFolderName)

    // Cache the tool
    toolDir = await tc.cacheDir(extractedFolderPath, toolName, version)

    // Make executables
    const agePath = path.join(toolDir, 'age')
    fs.chmodSync(agePath, '755')
  }

  // Add to PATH
  core.addPath(toolDir)
  core.info(`age ${version} installed and added to PATH`)
}

export { installSops, installAge }

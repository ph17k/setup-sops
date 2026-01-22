# Setup SOPS GitHub Action
A GitHub Action to setup [SOPS](https://github.com/getsops/sops) and [age](https://github.com/FiloSottile/age) for decrypting secrets in your CI/CD workflows.

## Usage

### Basic Setup

Set up SOPS and age with default versions:

```yaml
steps:
  - name: Setup SOPS
    uses: ph17k/setup-sops@v1
```

### Specify Versions

Use specific versions of SOPS and age:

```yaml
steps:
  - name: Setup SOPS
    uses: ph17k/setup-sops@v1
    with:
      sops-version: '3.11.0'
      age-version: '1.1.1'
```

### With Age Private Key

Configure an age private key for decryption:

```yaml
steps:
  - name: Setup SOPS
    uses: ph17k/setup-sops@v1
    with:
      age-key: ${{ secrets.AGE_PRIVATE_KEY }}

  - name: Decrypt secrets
    run: sops -d secrets.enc.yaml > secrets.yaml
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `sops-version` | The version of SOPS to use | No | `3.11.0` |
| `age-version` | The version of age to use | No | `1.1.1` |
| `age-key` | The age private key to add to the environment | No | - |

## Requirements

- **Operating System**: Linux (amd64 or arm64)
- **Runner**: GitHub-hosted or self-hosted runners on Linux

## Related Resources

- [SOPS Documentation](https://github.com/getsops/sops)
- [age Documentation](https://github.com/FiloSottile/age)

## License

See [LICENSE](LICENSE) file.

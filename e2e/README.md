# Maestro smoke flows

Three flows cover GitHub issue #37: **authentication** (`smoke_auth.yaml`), **finance shell** (`smoke_finance.yaml`), and **multi-pet customer create** (`smoke_customer_multipet.yaml`).

## Prerequisites

1. Install the [Maestro CLI](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli) (Java 17+). The installer puts binaries in `~/.maestro/bin` — add that folder to your **user** PATH, and if you use **Git Bash** (Yarn often does on Windows), also add `export PATH="$PATH:$HOME/.maestro/bin"` to `~/.bashrc`.
2. Run a **development build** of the app on a connected Android device or emulator (`com.brewswain.karindogapp`) or the matching iOS bundle.
3. Backend/API reachable from the device for flows that submit forms.

## Run

From the repository root:

```bash
yarn test:e2e
```

To run a single flow:

```bash
maestro test e2e/smoke_auth.yaml
```

## CI

GitHub Actions workflow `.github/workflows/e2e-smoke.yml` is **workflow_dispatch** (and optional weekly schedule). Stock GitHub-hosted runners do not ship with a device; use a self-hosted runner with an emulator/USB device, or run Maestro locally before release. The workflow installs the CLI and verifies the three smoke YAML files are present so the pipeline entry stays green.

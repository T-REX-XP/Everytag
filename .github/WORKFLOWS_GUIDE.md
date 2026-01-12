# GitHub Actions Workflows Setup Guide

This document provides a comprehensive guide to the GitHub Actions workflows set up for the Everytag project.

## Quick Start

1. Push code to `main` or `develop` branch
2. Go to **Actions** tab on GitHub
3. View build progress and download artifacts

## Workflows Overview

### 1. Build Firmware for NRF Devices (`build-firmware.yml`)

**Purpose:** Main workflow for building firmware for all supported NRF devices

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual trigger (workflow_dispatch)

**What it does:**
- Builds 14 different device/configuration combinations
- Creates firmware artifacts (.hex and .bin files)
- Publishes to GitHub Releases on tag push
- Retains artifacts for 30 days

**Output:**
- Individual firmware artifacts for each device/config
- Automatic release creation on version tags

### 2. Nightly Build and Analysis (`nightly-build.yml`)

**Purpose:** Comprehensive nightly builds with detailed analysis

**Triggers:**
- Scheduled daily at 2:00 AM UTC
- Manual trigger (workflow_dispatch)

**What it does:**
- Builds all device/configuration combinations
- Generates detailed build reports
- Captures build logs for failed builds
- Provides size information for each firmware
- Creates a comprehensive summary

**Output:**
- Nightly firmware artifacts
- Build logs (only for failures)
- Nightly build summary with statistics

**Customization:** Edit the cron schedule in the workflow file:
```yaml
cron: '0 2 * * *'  # Change time here (UTC)
```

### 3. Firmware Validation (`validate-firmware.yml`)

**Purpose:** Validates integrity of built firmware files

**Triggers:**
- Automatically after successful build-firmware workflow

**What it does:**
- Validates HEX file format
- Calculates SHA256 checksums
- Generates CRC32 checksums for binary files
- Creates validation report

**Output:**
- Firmware validation report
- Checksum documentation

## Device Build Matrix

The workflows build the following configurations:

| Device | MCU | Flash | Configs | Notes |
|--------|-----|-------|---------|-------|
| hcbb22e | nRF52832 | 512KB | Debug, Low-Power | With MCUmgr |
| kkm_k4p | nRF52833 | 512KB | Debug, Low-Power | Accelerometer, MCUmgr |
| wb_20241007 | nRF52833 | 512KB | Debug | Custom board |
| wb_20241125 | nRF52833 | 512KB | Debug | Custom board |
| kkm_c2_nrf82805 | nRF52805 | 256KB | Debug, Low-Power | - |
| nrf52805_evm | nRF52805 | 256KB | Debug, Low-Power | - |
| kkm_p1_nrf52810 | nRF52810 | 192KB | Debug, Low-Power | - |
| kkm_p11_nrf52810 | nRF52810 | 192KB | Debug, Low-Power | - |

## Accessing Build Results

### In GitHub Web UI

1. Click **Actions** tab
2. Select a workflow run
3. Scroll to **Artifacts** section
4. Download desired firmware files

### Download via GitHub CLI

```bash
# Download specific artifact
gh run download <run-id> -n "firmware-hcbb22e-prj-smpsvr.conf"

# Download all artifacts from latest run
gh run download -n "firmware-*"
```

### Download via URL

Visit: `https://github.com/<owner>/<repo>/actions/runs/<run-id>`

## Build Artifacts Structure

Each artifact contains:

```
firmware-<board>-<config>/
├── zephyr.hex          # Intel HEX format
├── zephyr.bin          # Binary format
├── zephyr.elf          # ELF executable (debugging)
└── <other build files>
```

## Release Publishing

When you create a tag/release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow automatically:
1. Runs full build for all devices
2. Collects all firmware files
3. Creates GitHub Release
4. Uploads all .hex and .bin files

## Troubleshooting

### Build Fails for Specific Device

1. Check workflow logs:
   - Click **Actions** → Select workflow run
   - Expand "Build firmware" step for that device
   - Review error messages

2. Common issues:
   - Board directory missing or named incorrectly
   - Configuration file doesn't exist
   - Incompatible NCS version

### No Artifacts Generated

- Check if build succeeded ("✓ Build successful" message)
- Verify `zephyr.hex` exists in build directory
- Check artifact upload step didn't fail

### Artifacts Disappear

- GitHub automatically cleans up old artifacts
- Default retention: 30 days
- For longer retention, modify workflow:
  ```yaml
  retention-days: 30  # Increase this value
  ```

### Workflow Not Triggering

- Verify `.github/workflows/build-firmware.yml` is on correct branch
- Check branch protection rules don't prevent workflow
- Manual trigger: Click **Actions** → **Run workflow**

## Customization

### Adding a New Device Board

1. Create board files in `boards/arm/<board_name>/`
2. Edit `.github/workflows/build-firmware.yml`
3. Add to matrix:

```yaml
- board: <new_board_name>
  config: <config_file>.conf
  overlay: <overlay_file_or_empty>
  name: "<Device Name> (<MCU>) - <Variant>"
```

4. Commit and push

### Changing Build Configuration

Edit the matrix entry to use different config files:

```yaml
- board: hcbb22e
  config: prj-test.conf    # Change this
  overlay: nrf52832dk.overlay
  name: "Minew HCB22E - Test"
```

### Modifying NCS Version

Edit workflow file and change:

```yaml
- uses: nrfconnect/action-nrf-connect-sdk@main
  with:
    ncs-version: v2.8.0    # Change this version
```

### Changing Build Schedule

For nightly builds, edit cron expression:

```yaml
cron: '0 2 * * *'  # 2 AM UTC daily
# Format: minute hour day month day-of-week
# Examples:
# '0 0 * * *'       = Daily midnight UTC
# '0 12 * * *'      = Daily noon UTC
# '0 * * * *'       = Every hour
# '0 0 * * 0'       = Weekly Sunday
```

## Performance Tips

### Reduce Build Time

1. Limit matrix items to specific devices:
   ```yaml
   include:
     - board: hcbb22e
       config: prj-smpsvr.conf
   ```

2. Use `fail-fast: false` to allow all builds to complete even if one fails

### Reduce Storage

1. Decrease artifact retention:
   ```yaml
   retention-days: 7  # Instead of 30
   ```

2. Don't upload build logs for successful builds

## Security Considerations

- Workflows have access to repository secrets
- GitHub Token is automatically available (GITHUB_TOKEN)
- Artifacts are only accessible to collaborators
- For public releases, use workflow permissions appropriately

## Integration with CI/CD

The workflows can be integrated with:

- **Branch protection rules** - Require build success before merging
- **Status checks** - Add as required check for PR merges
- **Notifications** - Send Slack/email alerts on build status
- **External deployments** - Download artifacts for flashing

## Monitoring and Alerts

### Set up Notifications

GitHub Actions can notify via:
- Email (via GitHub settings)
- GitHub App notifications
- Third-party integrations (Slack, Discord, etc.)

### View Build History

- **Actions** tab shows all workflow runs
- Filter by branch, status, or workflow
- Compare builds across time periods

## Documentation Files

- `BUILD_WORKFLOW.md` - Detailed workflow description
- `WORKFLOWS_GUIDE.md` - This file
- `.github/workflows/build-firmware.yml` - Main build workflow
- `.github/workflows/nightly-build.yml` - Nightly builds
- `.github/workflows/validate-firmware.yml` - Firmware validation

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Zephyr Build System](https://docs.zephyrproject.org/latest/build/index.html)
- [nRF Connect SDK Documentation](https://developer.nordicsemi.com/nRF_Connect_SDK/doc/)
- [Nordic Semiconductor Support](https://devzone.nordicsemi.com/)

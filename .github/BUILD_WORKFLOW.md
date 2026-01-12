# GitHub Actions - Firmware Build Workflow

This document describes the automated firmware build workflow for the Everytag project.

## Overview

The GitHub Actions workflow (`build-firmware.yml`) automatically builds the Everytag firmware for all supported NRF devices on every push and pull request.

## Supported Devices

The workflow builds firmware for the following NRF devices:

### nRF52832 (512KB Flash)
- **hcbb22e** - Minew HCB22E beacon
  - Debug version with MCUmgr support
  - Low-power version with MCUmgr support

### nRF52833 (512KB Flash)
- **kkm_k4p** - KKM K4P/K5 with accelerometer
  - Debug version with MCUmgr support
  - Low-power version with MCUmgr support
- **wb_20241007** - Custom board variant 1
  - Debug version
- **wb_20241125** - Custom board variant 2
  - Debug version

### nRF52805 (256KB Flash)
- **kkm_c2_nrf82805** - KKM C2 beacon
  - Debug version
  - Low-power version
- **nrf52805_evm** - Fanstel NRF52805EVM
  - Debug version
  - Low-power version

### nRF52810 (192KB Flash)
- **kkm_p1_nrf52810** - KKM P1 beacon
  - Debug version
  - Low-power version
- **kkm_p11_nrf52810** - KKM P11 beacon
  - Debug version
  - Low-power version

## Configuration Files

The workflow uses the following Kconfig files for different build variants:

- **prj.conf** - Debug version with RTT console (for larger flash)
- **prj-smpsvr.conf** - Debug with MCUmgr and bootloader support (for 512KB+ flash)
- **prj-smpsvr-lowpower.conf** - Low-power with MCUmgr and bootloader support
- **prj-lowpower.conf** - Low-power with RTT console (for smaller flash)

## Build Process

### Triggers

The workflow runs on:
- **Push** to `main` and `develop` branches
- **Pull requests** to `main` and `develop` branches
- **Manual trigger** via `workflow_dispatch`

### Build Steps

1. **Checkout code** - Clones the repository
2. **Set up nRF Connect SDK** - Installs NCS v2.8.0
3. **Build firmware** - Compiles for each device/configuration combination
4. **Check results** - Verifies build output
5. **Upload artifacts** - Stores built binaries for 30 days

### Release Publishing

When a tag is pushed (e.g., `v1.0.0`), the workflow:
1. Downloads all build artifacts
2. Organizes firmware files (.hex and .bin)
3. Creates a GitHub Release with all firmware binaries

## Artifacts

Build artifacts include:

- **zephyr.hex** - Intel HEX format (for flashing via SWD/JLink)
- **zephyr.bin** - Binary format

Artifacts are named by board and configuration:
- `firmware-hcbb22e-prj-smpsvr.conf`
- `firmware-kkm_c2_nrf82805-prj-lowpower.conf`
- etc.

Each artifact is retained for 30 days.

## Adding New Devices

To add a new NRF device board:

1. Create board files in `boards/arm/<board_name>/` directory
2. Add matrix entry to `.github/workflows/build-firmware.yml`:

```yaml
- board: <board_name>
  config: <config_file>.conf
  overlay: <overlay_file_if_needed>
  name: "<Device Name> (<MCU>) - <Variant>"
```

3. Push changes to trigger the workflow

## Customization

### Modifying NCS Version

To use a different nRF Connect SDK version, edit the workflow:

```yaml
- uses: nrfconnect/action-nrf-connect-sdk@main
  with:
    ncs-version: v2.8.0  # Change this version
```

### Adding Additional Build Variants

To add more build configurations for a device, add more matrix entries:

```yaml
- board: hcbb22e
  config: prj-test.conf
  overlay: ""
  name: "Minew HCB22E - Test Build"
```

### Changing Artifact Retention

To change how long artifacts are kept, modify the `retention-days` parameter:

```yaml
retention-days: 30  # Change this value
```

## Troubleshooting

### Build Failures

1. Check the **Actions** tab on GitHub for detailed logs
2. Verify board files exist in `boards/arm/<board_name>/`
3. Ensure config file paths are correct
4. Check for Zephyr configuration issues

### Missing Artifacts

- Artifacts are only created for successful builds
- Check if build step shows "✓ Build successful"
- Verify the device directory structure is correct

### NCS Version Issues

- Ensure the specified nRF Connect SDK version supports your board
- Check the nRF Connect SDK release notes for compatibility

## Manual Local Build

To build locally, use:

```bash
# Set up nRF Connect SDK environment first
# Then build for a specific device:

west build -b hcbb22e -c prj-smpsvr.conf

# For devices with overlays:
west build -b hcbb22e \
  -c prj-smpsvr.conf \
  -- -DEXTRA_DTC_OVERLAY_FILE=nrf52832dk.overlay
```

## References

- [Zephyr Build System](https://docs.zephyrproject.org/latest/build/index.html)
- [nRF Connect SDK](https://developer.nordicsemi.com/nRF_Connect_SDK/doc/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Nordic Semiconductor nRF Products](https://www.nordicsemi.com/Products)

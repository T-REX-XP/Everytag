# GitHub Actions Quick Reference

## Quick Commands

### Download Latest Firmware
```bash
# Using GitHub CLI
gh run download -n "firmware-*"

# Or visit Actions tab and download manually
```

### Trigger Manual Build
1. Go to **Actions** tab
2. Click **Build Firmware for NRF Devices**
3. Click **Run workflow**
4. Select branch
5. Click **Run workflow** button

### View Build Logs
1. Actions → Workflow run
2. Click on device in **Build firmware** section
3. Expand steps to view logs

## Device Naming Quick Reference

| Short Name | Full Name | MCU | Flash |
|------------|-----------|-----|-------|
| hcbb22e | Minew HCB22E | nRF52832 | 512KB |
| kkm_k4p | KKM K4P/K5 | nRF52833 | 512KB |
| kkm_c2_nrf82805 | KKM C2 | nRF52805 | 256KB |
| nrf52805_evm | Fanstel EVM | nRF52805 | 256KB |
| kkm_p1_nrf52810 | KKM P1 | nRF52810 | 192KB |
| kkm_p11_nrf52810 | KKM P11 | nRF52810 | 192KB |
| wb_20241007 | Custom v1 | nRF52833 | 512KB |
| wb_20241125 | Custom v2 | nRF52833 | 512KB |

## Configuration Quick Reference

| Config | Use Case | MCUs | Size |
|--------|----------|------|------|
| prj.conf | Debug, RTT console | nRF52805, nRF52810 | Small |
| prj-smpsvr.conf | Debug + OTA | nRF52832, nRF52833 | Large |
| prj-smpsvr-lowpower.conf | Low-power + OTA | nRF52832, nRF52833 | Large |
| prj-lowpower.conf | Low-power, RTT | nRF52805, nRF52810 | Small |

## Artifact Names

Format: `firmware-<board>-<config>`

Examples:
- `firmware-hcbb22e-prj-smpsvr.conf`
- `firmware-kkm_c2_nrf82805-prj-lowpower.conf`
- `firmware-nrf52805_evm-prj.conf`

## Workflow Status Indicators

| Status | Meaning |
|--------|---------|
| ✓ | Successful build |
| ✗ | Build failed |
| ⧖ | In progress |
| ⊘ | Skipped |

## Common Tasks

### Check if specific device built successfully
1. Actions tab → Latest run
2. Scroll to Build section
3. Look for device name
4. Check for ✓ Build successful

### Download single device firmware
1. Actions tab → Latest run
2. Scroll to Artifacts
3. Find `firmware-<device>-<config>`
4. Click to download

### Get firmware for release
1. Create git tag: `git tag v1.0.0`
2. Push: `git push origin v1.0.0`
3. Wait for workflow to complete
4. Go to Releases tab
5. Download .hex and .bin files

### View build times
1. Workflow run page
2. Click on each build step
3. Time shown at top of step logs

### Check firmware size
1. Download artifact
2. Check hex file size
3. Or view nightly build report (shows sizes)

## File Locations in Artifacts

Each artifact contains:
- `zephyr.hex` - For flashing with JLink/SWD
- `zephyr.bin` - Binary format
- `zephyr.elf` - For debugging
- `zephyr.map` - Link map (size info)

## Troubleshooting Quick Links

- **Build fails?** Check workflow logs for device
- **No artifacts?** Verify build step shows "✓"
- **Old artifacts?** GitHub deletes after 30 days
- **Need more time?** Manual workflow_dispatch trigger
- **Version issues?** Check NCS version in workflow

## Workflow Files Location

All workflows in: `.github/workflows/`

- `build-firmware.yml` - Main (14 matrix items)
- `nightly-build.yml` - Nightly (2 AM UTC)
- `validate-firmware.yml` - Validation (auto-trigger)

## Learn More

- [Full Build Workflow Guide](BUILD_WORKFLOW.md)
- [Workflows Setup Guide](WORKFLOWS_GUIDE.md)
- [Local Build Instructions](../README.md#compilation)

## Support

For issues:
1. Check workflow logs
2. Review [WORKFLOWS_GUIDE.md](WORKFLOWS_GUIDE.md#troubleshooting)
3. Check GitHub Issues
4. Review nRF Connect SDK docs

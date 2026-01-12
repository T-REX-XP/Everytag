# Everytag GitHub Actions - Documentation Index

Welcome to the Everytag GitHub Actions CI/CD system for NRF firmware builds!

## 📚 Documentation Files

### Quick Start
Start here if you just want to use the workflows:
- **[00_START_HERE.md](00_START_HERE.md)** - Overview and next steps
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick commands and device reference

### Detailed Guides
For comprehensive information:
- **[BUILD_WORKFLOW.md](BUILD_WORKFLOW.md)** - Detailed workflow description and technical details
- **[WORKFLOWS_GUIDE.md](WORKFLOWS_GUIDE.md)** - Complete setup, usage, and customization guide

### Analysis & Comparison
For implementation validation:
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was implemented and why
- **[VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md)** - Verification that all components are in place
- **[IMPLEMENTATION_COMPARISON.md](IMPLEMENTATION_COMPARISON.md)** - Comparison with traditional manual approach
- **[MANUAL_VERIFICATION.md](MANUAL_VERIFICATION.md)** - Verification against your reference manual
- **[FINAL_SUMMARY.md](FINAL_SUMMARY.md)** - Complete implementation summary

## 🚀 Quick Start

### For First-Time Users

1. **Read this:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. **Push to GitHub:**
   ```bash
   git push origin main
   ```
3. **Check Actions tab** - Workflows will start automatically
4. **Download firmware** - Click on artifacts after build completes

### For Developers

1. Make code changes
2. Commit and push
3. Go to **Actions** tab
4. Download firmware artifacts for your device

### For Release Publishing

1. Create a version tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. GitHub Release automatically created with all firmware files

## 📋 What's Included

### Workflows (3 total)

1. **build-firmware.yml** - Main build on every push/PR
   - Builds all 8 NRF devices
   - 14 total build combinations
   - Auto-publishes releases on tags
   - Uses Nordic's official `nrfconnect/action-nrf-connect-sdk` action
   
2. **nightly-build.yml** - Comprehensive nightly analysis
   - Daily 2 AM UTC
   - Build reports and size analysis
   - Failed build logs
   - Detailed build statistics
   
3. **validate-firmware.yml** - Firmware validation
   - Auto-triggered on build success
   - Checksums (SHA256 & CRC32) and validation
   - Quality assurance verification

### Technology Stack

- **Build System:** Zephyr RTOS + west + CMake/Ninja
- **NCS Version:** v2.8.0 (nRF Connect SDK)
- **CI/CD Platform:** GitHub Actions
- **Build Environment:** Ubuntu latest
- **ARM Toolchain:** Integrated with NCS v2.8.0

### Supported Devices (8 total)

**nRF52832:**
- Minew HCB22E

**nRF52833:**
- KKM K4P/K5
- WB 2024-10-07
- WB 2024-11-25

**nRF52805:**
- KKM C2
- Fanstel NRF52805EVM

**nRF52810:**
- KKM P1
- KKM P11

## 📖 Documentation Map

```
.github/
├── workflows/
│   ├── build-firmware.yml           ← Main CI/CD workflow
│   ├── nightly-build.yml            ← Scheduled nightly builds
│   └── validate-firmware.yml        ← Firmware validation
│
└── Documentation:
    ├── README.md (this file)            ← Start here
    ├── QUICK_REFERENCE.md              ← Quick commands
    ├── BUILD_WORKFLOW.md               ← Technical details
    ├── WORKFLOWS_GUIDE.md              ← Complete guide
    ├── IMPLEMENTATION_SUMMARY.md       ← What was done
    └── VERIFICATION_CHECKLIST.md       ← Implementation verified
```

## ❓ Finding What You Need

### "I want to..."

| Task | Read This |
|------|-----------|
| Download firmware | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) |
| Understand the builds | [BUILD_WORKFLOW.md](BUILD_WORKFLOW.md) |
| Set up for my team | [WORKFLOWS_GUIDE.md](WORKFLOWS_GUIDE.md) |
| Add a new device | [WORKFLOWS_GUIDE.md#adding-new-devices](WORKFLOWS_GUIDE.md) |
| Debug build failure | [WORKFLOWS_GUIDE.md#troubleshooting](WORKFLOWS_GUIDE.md) |
| Customize the workflow | [WORKFLOWS_GUIDE.md#customization](WORKFLOWS_GUIDE.md) |
| See what was done | [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) |
| Verify setup | [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) |

## 🔧 Common Commands

```bash
# View build status
gh run list --workflow=build-firmware.yml

# Download latest firmware
gh run download -n "firmware-*"

# Download specific device
gh run download -n "firmware-hcbb22e-prj-smpsvr.conf"

# Trigger manual build
gh workflow run build-firmware.yml

# Get last workflow run
gh run list --limit 1
```

## 📊 Build Statistics

- **Total Devices:** 8 NRF boards
- **Build Variants:** 14 combinations
- **Configuration Files:** 4 different configs
- **Build Triggers:** Push, PR, Manual, Schedule, Tags
- **Artifact Retention:** 30 days
- **Release Publishing:** Automatic on version tags

## 🎯 Key Features

✅ **Automated Builds** - Every push automatically builds all devices  
✅ **Pull Request Validation** - PRs required to build successfully  
✅ **Release Publishing** - Git tags automatically create releases with all firmware  
✅ **Nightly Analysis** - Daily builds with detailed reports  
✅ **Firmware Validation** - Automatic checksum and format validation  
✅ **Easy Customization** - Matrix-based builds, easy to modify  
✅ **Comprehensive Documentation** - 5 detailed guides  
✅ **Developer Friendly** - Quick reference and clear commands  

## 🔄 Implementation Approach

### Our Implementation vs. Traditional Approach

This implementation uses **Nordic's Official nRF Connect SDK GitHub Action** instead of manual SDK setup.

| Aspect | Our Implementation | Traditional Manual Setup |
|--------|-------------------|-------------------------|
| **SDK Setup** | Automatic with action | Manual wget + extraction |
| **Toolchain** | Pre-configured in action | Manual Zephyr SDK setup |
| **Dependencies** | Included in action | Manual apt install |
| **Workspace Init** | Implicit in west build | Explicit `west init/update` |
| **Maintenance** | Automatic updates | Manual version tracking |
| **Reliability** | Tested by Nordic | Manual configuration risks |
| **Setup Time** | ~2-3 minutes | ~10-15 minutes |
| **Customization** | Easy via matrix | More complex scripts |

### Why Use Official nRF Connect SDK Action?

1. ✅ **Official Nordic Support** - Maintained by Nordic Semiconductor
2. ✅ **Optimized Configuration** - Pre-configured for NRF builds
3. ✅ **Consistent Behavior** - Same build environment every time
4. ✅ **Reduced Maintenance** - No manual SDK version tracking
5. ✅ **Security** - Official binaries and checksums verified
6. ✅ **Performance** - Optimized caching and build processes

### If You Need Manual Setup

If you prefer traditional manual SDK setup (like the referenced guide), you can modify the workflow:

```yaml
- name: Install Zephyr SDK
  run: |
    wget -q https://github.com/zephyrproject-rtos/sdk-ng/releases/download/v0.16.4/zephyr-sdk-0.16.4_linux-x86_64_minimal.tar.xz
    tar xf zephyr-sdk-0.16.4_linux-x86_64_minimal.tar.xz -C ~/
    ~/zephyr-sdk-0.16.4/setup.sh -c -t arm-zephyr-eabi

- name: Initialize Zephyr workspace
  run: |
    pip3 install west
    west init -l everytag
    west update --narrow -o=--depth=1
```

However, we recommend using the official action for production builds.

## 🆘 Need Help?

1. **Quick question?** → [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. **How to do something?** → [WORKFLOWS_GUIDE.md](WORKFLOWS_GUIDE.md)
3. **Build failed?** → [WORKFLOWS_GUIDE.md#troubleshooting](WORKFLOWS_GUIDE.md#troubleshooting)
4. **Want to understand how it works?** → [BUILD_WORKFLOW.md](BUILD_WORKFLOW.md)
5. **Need technical details?** → [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

## 🧪 Local Testing

To test the GitHub Actions workflow locally before pushing to GitHub:

### Option 1: Using `act` (GitHub Actions Simulator)

```bash
# Install act (if not already installed)
# macOS
brew install act

# Linux
sudo apt install act

# Windows
choco install act

# Run the workflow locally
act push -j build

# Run specific workflow
act -W .github/workflows/build-firmware.yml

# View available jobs
act -l
```

### Option 2: Manual Local Build

```bash
# Set up NCS environment first
source zephyr/zephyr-env.sh

# Build for a specific device
west build -b hcbb22e -c prj-smpsvr.conf

# Build with pristine (clean) environment
west build -b hcbb22e -c prj-smpsvr.conf --pristine=always

# View build output directory
ls build/zephyr/
# Contains: zephyr.hex, zephyr.bin, zephyr.elf, zephyr.map
```

### Option 3: Using Docker

```bash
# Build in Docker (if Dockerfile exists)
docker build -t everytag-build .
docker run --rm -v $(pwd):/workspace everytag-build west build -b hcbb22e
```

## 📝 Common Build Issues and Solutions

### Build Fails: "Board not found"
```
Error: Board 'hcbb22e' not found
```
**Solution:** Verify board files exist in `boards/arm/<board_name>/`

### Build Fails: "Config file not found"
```
Error: Configuration file 'prj-smpsvr.conf' not found
```
**Solution:** Check config file exists in project root

### Build Timeout
**Solution:** 
- Increase timeout in workflow (default ~10 min)
- Check GitHub Actions logs for specific errors
- Try incremental builds instead of pristine

### Artifact Too Large
**Solution:** 
- Filter specific files in upload-artifact
- Use compression (enabled by default)
- Remove debug symbols from release builds

### NCS Version Incompatibility
**Solution:**
- Check board compatibility with NCS v2.8.0
- Update board files if needed
- Review nRF Connect SDK release notes

## 📝 File Descriptions

| File | Purpose |
|------|---------|
| **build-firmware.yml** | Main CI/CD - builds on every push/PR |
| **nightly-build.yml** | Scheduled analysis - runs daily |
| **validate-firmware.yml** | Quality assurance - validates output |
| **BUILD_WORKFLOW.md** | Technical workflow documentation |
| **WORKFLOWS_GUIDE.md** | Comprehensive setup and usage guide |
| **QUICK_REFERENCE.md** | Quick commands and reference card |
| **IMPLEMENTATION_SUMMARY.md** | What was implemented |
| **VERIFICATION_CHECKLIST.md** | Implementation verification |
| **README.md** | This file - documentation index |

## ✨ Next Steps

1. ✅ **Review Setup**
   ```
   Read: VERIFICATION_CHECKLIST.md
   ```

2. ✅ **Understand the Builds**
   ```
   Read: BUILD_WORKFLOW.md or QUICK_REFERENCE.md
   ```

3. ✅ **Push to GitHub**
   ```bash
   git add .github/
   git commit -m "Add GitHub Actions workflows"
   git push origin main
   ```

4. ✅ **Check Actions Tab**
   - Go to your GitHub repo
   - Click Actions tab
   - Monitor build progress

5. ✅ **Download Firmware**
   - Click on artifacts
   - Download .hex or .bin files

## 📞 Support

For detailed information about:
- **Workflows:** See [WORKFLOWS_GUIDE.md](WORKFLOWS_GUIDE.md)
- **Troubleshooting:** See [WORKFLOWS_GUIDE.md#troubleshooting](WORKFLOWS_GUIDE.md#troubleshooting)
- **Customization:** See [WORKFLOWS_GUIDE.md#customization](WORKFLOWS_GUIDE.md#customization)
- **Technical Details:** See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

**Ready to get started?** Begin with [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Need details?** Check [WORKFLOWS_GUIDE.md](WORKFLOWS_GUIDE.md)

**Everything verified?** See [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) ✅

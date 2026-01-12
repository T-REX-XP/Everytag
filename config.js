// Everytag Bluetooth Configuration - JavaScript Logic

// Service and characteristic UUIDs
const SERVICE_UUID = '5cfce313-a7e3-45c3-933d-418b8100da7f';
const CHAR_FMDN = '8c5debdb-ad8d-4810-a31f-53862e79ee77';
const CHAR_AIRTAG = '8c5debdc-ad8d-4810-a31f-53862e79ee77';
const CHAR_PERIOD = '8c5debdd-ad8d-4810-a31f-53862e79ee77';
const CHAR_KEY = '8c5debde-ad8d-4810-a31f-53862e79ee77';
const CHAR_AUTH = '8c5debdf-ad8d-4810-a31f-53862e79ee77';
const CHAR_INTERVAL = '8c5debe0-ad8d-4810-a31f-53862e79ee77';
const CHAR_TXPOWER = '8c5debe1-ad8d-4810-a31f-53862e79ee77';
const CHAR_FMDNKEY = '8c5debe2-ad8d-4810-a31f-53862e79ee77';
const CHAR_TIME = '8c5debe3-ad8d-4810-a31f-53862e79ee77';
const CHAR_MAC = '8c5debe4-ad8d-4810-a31f-53862e79ee77';
const CHAR_STATUS = '8c5debe5-ad8d-4810-a31f-53862e79ee77';
const CHAR_ACCEL = '8c5debe6-ad8d-4810-a31f-53862e79ee77';

// State variables
let device = null;
let server = null;
let service = null;
let keyFileData = null;

/**
 * Display status message to user
 */
function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status ${type} show`;
    console.log(`[${type.toUpperCase()}] ${message}`);
}

/**
 * Update connection indicator LED
 */
function updateConnectionIndicator(connected) {
    const indicator = document.getElementById('connectionIndicator');
    if (connected) {
        indicator.classList.add('active');
    } else {
        indicator.classList.remove('active');
    }
}

/**
 * Connect to Everytag beacon via Web Bluetooth API
 */
async function connectDevice() {
    try {
        showStatus('Requesting Bluetooth device...', 'info');
        
        device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }],
            optionalServices: [SERVICE_UUID]
        });

        showStatus(`Connecting to ${device.name || device.id}...`, 'info');
        
        server = await device.connect();
        service = await server.getPrimaryService(SERVICE_UUID);

        showStatus(`Connected to ${device.name || device.id}!`, 'success');
        updateConnectionIndicator(true);
        
        document.getElementById('connectBtn').style.display = 'none';
        document.getElementById('configForm').style.display = 'block';

        device.addEventListener('gattserverdisconnected', onDisconnected);
    } catch (error) {
        showStatus(`Connection failed: ${error.message}`, 'error');
        console.error('Connection error:', error);
    }
}

/**
 * Handle disconnection event
 */
function onDisconnected() {
    showStatus('Device disconnected', 'info');
    updateConnectionIndicator(false);
    document.getElementById('connectBtn').style.display = 'block';
    document.getElementById('configForm').style.display = 'none';
    device = null;
    server = null;
    service = null;
}

/**
 * Disconnect from device
 */
async function disconnectDevice() {
    if (device && device.gatt.connected) {
        device.gatt.disconnect();
    }
}

/**
 * Authenticate with beacon
 */
async function authenticate() {
    const authCode = document.getElementById('authCode').value;
    if (!authCode) {
        throw new Error('Authorization code is required');
    }

    const encoder = new TextEncoder();
    const authData = encoder.encode(authCode);
    
    const characteristic = await service.getCharacteristic(CHAR_AUTH);
    await characteristic.writeValue(authData);
    showStatus('✓ Authentication successful', 'success');
}

/**
 * Handle keyfile selection
 */
function handleKeyFileSelect(input) {
    const file = input.files[0];
    if (file) {
        document.getElementById('keyFileName').textContent = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            keyFileData = new Uint8Array(e.target.result);
            showStatus(`Loaded keyfile: ${file.name} (${keyFileData.length} bytes)`, 'success');
        };
        reader.readAsArrayBuffer(file);
    }
}

/**
 * Write all settings to beacon
 */
async function writeSettings() {
    if (!device || !device.gatt.connected) {
        showStatus('Not connected to device', 'error');
        return;
    }

    try {
        showStatus('Authenticating...', 'info');
        await authenticate();

        // Write FMDN enable
        const fmdnEnabled = document.getElementById('enableFmdn').checked;
        await writeCharacteristic(CHAR_FMDN, int32ToBytes(fmdnEnabled ? 1 : 0));
        showStatus('✓ FMDN setting saved', 'info');

        // Write AirTag enable
        const airtagEnabled = document.getElementById('enableAirtag').checked;
        await writeCharacteristic(CHAR_AIRTAG, int32ToBytes(airtagEnabled ? 1 : 0));
        showStatus('✓ AirTag setting saved', 'info');

        // Write broadcast delay
        const delay = parseInt(document.getElementById('broadcastDelay').value);
        await writeCharacteristic(CHAR_PERIOD, int32ToBytes(delay));
        showStatus('✓ Broadcast delay saved', 'info');

        // Write TX power
        const txPower = parseInt(document.getElementById('txPower').value);
        await writeCharacteristic(CHAR_TXPOWER, int32ToBytes(txPower));
        showStatus('✓ TX power saved', 'info');

        // Write key change interval
        const interval = parseInt(document.getElementById('keyChangeInterval').value);
        if (interval) {
            await writeCharacteristic(CHAR_INTERVAL, int32ToBytes(interval));
            showStatus('✓ Key interval saved', 'info');
        }

        // Write FMDN key
        const fmdnKey = document.getElementById('fmdnKey').value;
        if (fmdnKey && fmdnKey.length === 40) {
            const fmdnKeyBytes = hexToBytes(fmdnKey);
            await writeCharacteristic(CHAR_FMDNKEY, fmdnKeyBytes);
            showStatus('✓ FMDN key saved', 'info');
        }

        // Write AirTag keys
        if (keyFileData && keyFileData.length > 0) {
            showStatus('Uploading AirTag keys...', 'info');
            await uploadKeys(keyFileData);
            showStatus('✓ AirTag keys uploaded', 'success');
        }

        // Write accelerometer threshold
        const accelThreshold = document.getElementById('accelThreshold').value;
        if (accelThreshold !== '') {
            await writeCharacteristic(CHAR_ACCEL, int32ToBytes(parseInt(accelThreshold)));
            showStatus('✓ Accelerometer threshold saved', 'info');
        }

        // Write status flags
        const statusFlags = document.getElementById('statusFlags').value;
        if (statusFlags) {
            const statusValue = parseInt(statusFlags, 16);
            await writeCharacteristic(CHAR_STATUS, int32ToBytes(statusValue));
            showStatus('✓ Status flags saved', 'info');
        }

        // Write new MAC address
        const newMac = document.getElementById('newMacAddress').value;
        if (newMac) {
            const macBytes = macToBytes(newMac);
            await writeCharacteristic(CHAR_MAC, macBytes);
            showStatus('✓ MAC address saved', 'info');
        }

        // Write new auth code (must be last)
        const newAuthCode = document.getElementById('newAuthCode').value;
        if (newAuthCode) {
            const encoder = new TextEncoder();
            const newAuthData = encoder.encode(newAuthCode);
            await writeCharacteristic(CHAR_AUTH, newAuthData);
            showStatus('✓ New authorization code saved', 'info');
        }

        showStatus('🎉 All settings saved successfully!', 'success');
    } catch (error) {
        showStatus(`Error saving settings: ${error.message}`, 'error');
        console.error('Write error:', error);
    }
}

/**
 * Upload AirTag keyfile to beacon
 */
async function uploadKeys(keyFileData) {
    if (keyFileData.length < 1) {
        throw new Error('Invalid key file');
    }

    const numKeys = keyFileData[0];
    if (numKeys > 40) {
        throw new Error('Too many keys (max 40)');
    }

    const keyCharacteristic = await service.getCharacteristic(CHAR_KEY);
    
    // Upload keys (2 chunks of 14 bytes per key)
    for (let i = 0; i < numKeys * 2; i++) {
        const offset = 1 + (i * 14);
        const chunk = keyFileData.slice(offset, offset + 14);
        
        if (chunk.length === 14) {
            await keyCharacteristic.writeValue(chunk);
            showStatus(`Uploading key ${Math.floor(i/2) + 1}/${numKeys}...`, 'info');
        }
    }

    // Send zero key to mark end if less than 40 keys
    if (numKeys < 40) {
        const zeroKey = new Uint8Array(14).fill(0);
        await keyCharacteristic.writeValue(zeroKey);
        await keyCharacteristic.writeValue(zeroKey);
    }
}

/**
 * Read current time from beacon
 */
async function readTime() {
    if (!device || !device.gatt.connected) {
        showStatus('Not connected to device', 'error');
        return;
    }

    try {
        await authenticate();
        const characteristic = await service.getCharacteristic(CHAR_TIME);
        const value = await characteristic.readValue();
        
        // Read 8-byte timestamp (little-endian)
        const timestamp = value.getUint32(0, true) + (value.getUint32(4, true) * 4294967296);
        const date = new Date(timestamp * 1000);
        
        document.getElementById('timeDisplay').style.display = 'block';
        document.getElementById('beaconTime').textContent = date.toUTCString();
        showStatus('Time read successfully', 'success');
    } catch (error) {
        showStatus(`Error reading time: ${error.message}`, 'error');
        console.error('Read time error:', error);
    }
}

/**
 * Synchronize beacon time to current time
 */
async function writeTime() {
    if (!device || !device.gatt.connected) {
        showStatus('Not connected to device', 'error');
        return;
    }

    try {
        await authenticate();
        
        const currentTime = Math.floor(Date.now() / 1000);
        const timeBytes = new Uint8Array(8);
        const view = new DataView(timeBytes.buffer);
        
        // Write 64-bit timestamp in little-endian
        view.setUint32(0, currentTime & 0xFFFFFFFF, true);
        view.setUint32(4, Math.floor(currentTime / 4294967296), true);
        
        await writeCharacteristic(CHAR_TIME, timeBytes);
        showStatus('✓ Time synchronized successfully!', 'success');
    } catch (error) {
        showStatus(`Error writing time: ${error.message}`, 'error');
        console.error('Write time error:', error);
    }
}

/**
 * Write value to characteristic
 */
async function writeCharacteristic(uuid, data) {
    const characteristic = await service.getCharacteristic(uuid);
    await characteristic.writeValue(data);
}

/**
 * Convert 32-bit integer to little-endian bytes
 */
function int32ToBytes(value) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, value, true); // little-endian
    return new Uint8Array(buffer);
}

/**
 * Convert hex string to bytes
 */
function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

/**
 * Convert MAC address string to bytes (reversed for Everytag protocol)
 */
function macToBytes(mac) {
    const parts = mac.split(':');
    const bytes = new Uint8Array(6);
    // Reverse byte order (as per Python script)
    for (let i = 0; i < 6; i++) {
        bytes[5 - i] = parseInt(parts[i], 16);
    }
    return bytes;
}

/**
 * Check Web Bluetooth support on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    if (!navigator.bluetooth) {
        showStatus('Web Bluetooth API is not supported in this browser. Please use Chrome, Edge, or Opera.', 'error');
        document.getElementById('connectBtn').disabled = true;
    }
});

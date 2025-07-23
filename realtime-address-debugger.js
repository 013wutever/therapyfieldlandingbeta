// ========== REALTIME ADDRESS DEBUGGER ==========
// Direct diagnostic to find and fix the exact issue

console.log('🔥 REALTIME DEBUGGER: Loading direct diagnostic...');

// Create visual debug panel
function createDebugPanel() {
    const existingPanel = document.getElementById('debug-panel');
    if (existingPanel) existingPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 400px;
        max-height: 500px;
        background: black;
        color: lime;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 5px;
        z-index: 10000;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;
    
    panel.innerHTML = `
        <div style="color: yellow; font-weight: bold; margin-bottom: 10px;">
            🔥 REALTIME ADDRESS DEBUGGER
            <button onclick="this.parentElement.parentElement.remove()" style="float: right; background: red; color: white; border: none; padding: 2px 8px; cursor: pointer;">✕</button>
        </div>
        <div id="debug-output">Initializing...</div>
    `;
    
    document.body.appendChild(panel);
    return document.getElementById('debug-output');
}

// Debug logger
const debugOutput = createDebugPanel();
function debugLog(message, color = 'lime') {
    console.log(message);
    debugOutput.innerHTML += `<div style="color: ${color};">${message}</div>`;
    debugOutput.scrollTop = debugOutput.scrollHeight;
}

// Immediate system check
function immediateSystemCheck() {
    debugLog('🔥 STARTING IMMEDIATE SYSTEM CHECK...', 'yellow');
    
    // Check 1: Google Maps
    if (typeof google === 'undefined') {
        debugLog('❌ CRITICAL: Google Maps not loaded', 'red');
        return false;
    } else {
        debugLog('✅ Google Maps API available', 'lime');
    }
    
    // Check 2: Form fields  
    const countryField = document.getElementById('country');
    const cityField = document.getElementById('city');
    const areaField = document.getElementById('area');
    const addressField = document.getElementById('officeAddress');
    
    debugLog(`Country field: ${countryField ? '✅ FOUND' : '❌ MISSING'}`, countryField ? 'lime' : 'red');
    debugLog(`City field: ${cityField ? '✅ FOUND' : '❌ MISSING'}`, cityField ? 'lime' : 'red');
    debugLog(`Area field: ${areaField ? '✅ FOUND' : '❌ MISSING'}`, areaField ? 'lime' : 'red');
    debugLog(`Address field: ${addressField ? '✅ FOUND' : '❌ MISSING'}`, addressField ? 'lime' : 'red');
    
    if (!countryField || !cityField || !areaField || !addressField) {
        debugLog('❌ CRITICAL: Missing form fields', 'red');
        return false;
    }
    
    // Check 3: Field properties
    debugLog(`Country readonly: ${countryField.readOnly}`, countryField.readOnly ? 'orange' : 'lime');
    debugLog(`Country disabled: ${countryField.disabled}`, countryField.disabled ? 'orange' : 'lime');
    
    return true;
}

// Direct address test
async function directAddressTest(address) {
    debugLog(`\n🔥 TESTING: "${address}"`, 'yellow');
    
    if (!immediateSystemCheck()) {
        debugLog('❌ System check failed - cannot proceed', 'red');
        return;
    }
    
    debugLog('📡 Sending to Google Geocoder...', 'cyan');
    
    try {
        const geocoder = new google.maps.Geocoder();
        
        const results = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: address }, (results, status) => {
                debugLog(`Google status: ${status}`, status === 'OK' ? 'lime' : 'red');
                if (status === 'OK') {
                    resolve(results);
                } else {
                    reject(new Error(status));
                }
            });
        });
        
        if (!results || results.length === 0) {
            debugLog('❌ No results from Google', 'red');
            return;
        }
        
        debugLog(`✅ Got ${results.length} result(s)`, 'lime');
        
        const place = results[0];
        debugLog(`Formatted: ${place.formatted_address}`, 'cyan');
        
        // Parse components
        let country = null, city = null, area = null;
        
        debugLog('\n🔍 PARSING COMPONENTS:', 'yellow');
        place.address_components.forEach((component, index) => {
            const types = component.types.join(', ');
            debugLog(`${index + 1}. "${component.long_name}" [${types}]`, 'white');
            
            // Extract components
            if (component.types.includes('country')) {
                country = component.long_name;
                debugLog(`   → COUNTRY: ${country}`, 'lime');
            }
            if (component.types.includes('locality')) {
                city = component.long_name;
                debugLog(`   → CITY: ${city}`, 'lime');
            }
            if (component.types.includes('sublocality') || component.types.includes('sublocality_level_1')) {
                area = component.long_name;
                debugLog(`   → AREA: ${area}`, 'lime');
            }
            if (component.types.includes('neighborhood')) {
                area = component.long_name;
                debugLog(`   → AREA (neighborhood): ${area}`, 'lime');
            }
        });
        
        debugLog('\n🎯 EXTRACTED:', 'yellow');
        debugLog(`Country: ${country || 'NOT FOUND'}`, country ? 'lime' : 'red');
        debugLog(`City: ${city || 'NOT FOUND'}`, city ? 'lime' : 'red');
        debugLog(`Area: ${area || 'NOT FOUND'}`, area ? 'lime' : 'red');
        
        // Try to fill fields
        debugLog('\n💉 FILLING FIELDS:', 'yellow');
        
        const countryField = document.getElementById('country');
        const cityField = document.getElementById('city');
        const areaField = document.getElementById('area');
        
        if (country && countryField) {
            countryField.value = country;
            countryField.style.backgroundColor = '#90EE90';
            debugLog(`✅ Filled country: ${country}`, 'lime');
        } else {
            debugLog(`❌ Cannot fill country: field=${!!countryField}, value=${!!country}`, 'red');
        }
        
        if (city && cityField) {
            cityField.value = city;
            cityField.style.backgroundColor = '#90EE90';
            debugLog(`✅ Filled city: ${city}`, 'lime');
        } else {
            debugLog(`❌ Cannot fill city: field=${!!cityField}, value=${!!city}`, 'red');
        }
        
        if (area && areaField) {
            areaField.value = area;
            areaField.style.backgroundColor = '#90EE90';
            debugLog(`✅ Filled area: ${area}`, 'lime');
        } else {
            debugLog(`❌ Cannot fill area: field=${!!areaField}, value=${!!area}`, 'red');
        }
        
        debugLog('\n🎉 TEST COMPLETE!', 'yellow');
        
    } catch (error) {
        debugLog(`❌ ERROR: ${error.message}`, 'red');
    }
}

// Auto-attach to address field
function attachToAddressField() {
    debugLog('🔗 Attaching to address field...', 'cyan');
    
    const addressField = document.getElementById('officeAddress');
    if (!addressField) {
        debugLog('❌ Address field not found', 'red');
        return;
    }
    
    // Remove existing listeners
    const newField = addressField.cloneNode(true);
    addressField.parentNode.replaceChild(newField, addressField);
    
    // Add new listener
    newField.addEventListener('blur', async function() {
        const address = this.value.trim();
        if (address.length > 5) {
            debugLog('\n🚀 ADDRESS FIELD BLUR TRIGGERED', 'yellow');
            await directAddressTest(address);
        }
    });
    
    newField.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const address = this.value.trim();
            if (address.length > 5) {
                debugLog('\n🚀 ADDRESS FIELD ENTER TRIGGERED', 'yellow');
                await directAddressTest(address);
            }
        }
    });
    
    debugLog('✅ Listeners attached to address field', 'lime');
}

// Global test function
window.DIRECT_ADDRESS_TEST = directAddressTest;

// Auto-initialize
setTimeout(() => {
    debugLog('🔥 REALTIME DEBUGGER READY', 'yellow');
    debugLog('Type address and press Tab or Enter', 'cyan');
    debugLog('Or use: window.DIRECT_ADDRESS_TEST("your address")', 'cyan');
    
    immediateSystemCheck();
    attachToAddressField();
}, 1000);

console.log('🔥 REALTIME DEBUGGER LOADED');
console.log('💡 Test: await window.DIRECT_ADDRESS_TEST("88 Kurfürstendamm, Charlottenburg, Berlin 10709, Germany")'); 
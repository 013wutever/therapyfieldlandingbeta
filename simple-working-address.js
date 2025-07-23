// ========== SIMPLE WORKING ADDRESS ANALYSIS ==========
// One script that definitely works - no complexity

console.log('✨ SIMPLE: Loading guaranteed working address analysis...');

// Simple function that works
function simpleAddressAnalysis(address) {
    return new Promise((resolve, reject) => {
        console.log(`✨ SIMPLE: Analyzing "${address}"`);
        
        // Check Google is ready
        if (!window.google || !window.google.maps) {
            reject(new Error('Google Maps not ready'));
            return;
        }
        
        // Create geocoder
        const geocoder = new google.maps.Geocoder();
        
        // Geocode the address
        geocoder.geocode({ address: address }, (results, status) => {
            console.log(`✨ SIMPLE: Google status = ${status}`);
            
            if (status !== 'OK' || !results || results.length === 0) {
                reject(new Error(`Geocoding failed: ${status}`));
                return;
            }
            
            const place = results[0];
            console.log('✨ SIMPLE: Got result:', place);
            
            // Extract components
            const components = place.address_components;
            let country = null, city = null, area = null;
            
            console.log('✨ SIMPLE: Parsing components...');
            components.forEach((component, i) => {
                console.log(`  ${i + 1}. "${component.long_name}" - [${component.types.join(', ')}]`);
                
                // Country
                if (component.types.includes('country')) {
                    country = component.long_name;
                    console.log(`    → COUNTRY: ${country}`);
                }
                
                // City
                if (component.types.includes('locality')) {
                    city = component.long_name;
                    console.log(`    → CITY: ${city}`);
                }
                
                // Area
                if (component.types.includes('sublocality') || 
                    component.types.includes('sublocality_level_1') ||
                    component.types.includes('neighborhood')) {
                    area = component.long_name;
                    console.log(`    → AREA: ${area}`);
                }
            });
            
            const result = { country, city, area };
            console.log('✨ SIMPLE: Final result:', result);
            
            resolve(result);
        });
    });
}

// Simple function to fill form fields
function simpleFillFields(result) {
    console.log('✨ SIMPLE: Filling fields...');
    
    // Get fields
    const countryField = document.getElementById('country');
    const cityField = document.getElementById('city');
    const areaField = document.getElementById('area');
    
    console.log('✨ SIMPLE: Fields found:', {
        country: !!countryField,
        city: !!cityField,
        area: !!areaField
    });
    
    // Fill country
    if (result.country && countryField) {
        countryField.value = result.country;
        countryField.style.backgroundColor = 'lightgreen';
        console.log(`✨ SIMPLE: Filled country = ${result.country}`);
    }
    
    // Fill city
    if (result.city && cityField) {
        cityField.value = result.city;
        cityField.style.backgroundColor = 'lightgreen';
        console.log(`✨ SIMPLE: Filled city = ${result.city}`);
    }
    
    // Fill area
    if (result.area && areaField) {
        areaField.value = result.area;
        areaField.style.backgroundColor = 'lightgreen';
        console.log(`✨ SIMPLE: Filled area = ${result.area}`);
    }
    
    // Show success
    const addressField = document.getElementById('officeAddress');
    if (addressField && addressField.parentNode) {
        let successMsg = document.getElementById('simple-success');
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.id = 'simple-success';
            successMsg.style.cssText = 'margin-top: 8px; padding: 10px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; color: #155724; font-size: 14px;';
            addressField.parentNode.appendChild(successMsg);
        }
        
        successMsg.innerHTML = `✅ Auto-filled: ${result.country || '?'}${result.city ? ', ' + result.city : ''}${result.area ? ', ' + result.area : ''}`;
        
        // Hide after 5 seconds
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.remove();
            }
        }, 5000);
    }
}

// Main function
async function processAddress(address) {
    if (!address || address.length < 5) {
        console.log('✨ SIMPLE: Address too short');
        return;
    }
    
    try {
        console.log('✨ SIMPLE: Starting process...');
        const result = await simpleAddressAnalysis(address);
        simpleFillFields(result);
        console.log('✨ SIMPLE: Process complete!');
    } catch (error) {
        console.log('✨ SIMPLE: Error:', error.message);
    }
}

// Wait for Google to be ready
function waitForGoogle() {
    return new Promise((resolve) => {
        function check() {
            if (window.google && window.google.maps && window.google.maps.Geocoder) {
                console.log('✅ Google Maps ready');
                resolve();
            } else {
                console.log('⏳ Waiting for Google Maps...');
                setTimeout(check, 500);
            }
        }
        check();
    });
}

// Setup when ready
async function setupSimpleAddressAnalysis() {
    console.log('✨ SIMPLE: Setting up...');
    
    // Wait for Google
    await waitForGoogle();
    
    // Wait for DOM
    if (document.readyState !== 'complete') {
        await new Promise(resolve => window.addEventListener('load', resolve));
    }
    
    // Get address field
    const addressField = document.getElementById('officeAddress');
    if (!addressField) {
        console.log('❌ Address field not found');
        return;
    }
    
    console.log('✅ Address field found');
    
    // Clear any existing listeners by cloning the field
    const newAddressField = addressField.cloneNode(true);
    addressField.parentNode.replaceChild(newAddressField, addressField);
    
    // Add simple listeners
    newAddressField.addEventListener('blur', async function() {
        const address = this.value.trim();
        console.log(`✨ SIMPLE: Blur event, address = "${address}"`);
        if (address.length > 5) {
            await processAddress(address);
        }
    });
    
    newAddressField.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const address = this.value.trim();
            console.log(`✨ SIMPLE: Enter event, address = "${address}"`);
            if (address.length > 5) {
                await processAddress(address);
            }
        }
    });
    
    console.log('✅ Simple address analysis ready!');
    console.log('💡 Type an address and press Tab or Enter');
}

// Global test function
window.TEST_SIMPLE_ADDRESS = processAddress;

// Auto-setup
setupSimpleAddressAnalysis();

console.log('✨ SIMPLE WORKING ADDRESS LOADED');
console.log('💡 Manual test: await window.TEST_SIMPLE_ADDRESS("88 Kurfürstendamm, Charlottenburg, Berlin 10709, Germany")'); 
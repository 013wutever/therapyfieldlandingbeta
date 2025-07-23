// ========== DEBUG GOOGLE ADDRESS EXTRACTION ==========
// Debug version to see exactly what Google returns

console.log('🔍 DEBUG GOOGLE ADDRESS: Loading debugging tools...');

// Debug function to analyze what Google actually returns
window.debugGoogleAddressAnalysis = async function(address) {
    console.log('🔍 DEBUG: Starting Google address analysis...');
    console.log(`🔍 Input address: "${address}"`);
    
    if (!address || address.length < 5) {
        console.log('❌ Address too short');
        return;
    }
    
    // Check if Google is available
    if (!window.google || !window.google.maps) {
        console.log('❌ Google Maps not available');
        return;
    }
    
    const geocoder = new google.maps.Geocoder();
    
    try {
        console.log('🔍 Sending to Google Geocoder...');
        
        const results = await new Promise((resolve, reject) => {
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK') {
                    resolve(results);
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });
        
        console.log('🔍 Google geocoding results:', results);
        
        if (!results || results.length === 0) {
            console.log('❌ No results from Google');
            return;
        }
        
        const place = results[0];
        console.log('🔍 First result:', place);
        console.log('🔍 Formatted address:', place.formatted_address);
        console.log('🔍 Address components:', place.address_components);
        
        // Analyze each component
        console.log('\n🔍 DETAILED COMPONENT ANALYSIS:');
        place.address_components.forEach((component, index) => {
            console.log(`\n   Component ${index + 1}:`);
            console.log(`      Long name: "${component.long_name}"`);
            console.log(`      Short name: "${component.short_name}"`);
            console.log(`      Types: [${component.types.join(', ')}]`);
            
            // Check what this component would be classified as
            if (component.types.includes('country')) {
                console.log(`      ✅ This is COUNTRY: ${component.long_name}`);
            }
            if (component.types.includes('locality')) {
                console.log(`      ✅ This is CITY (locality): ${component.long_name}`);
            }
            if (component.types.includes('sublocality') || component.types.includes('sublocality_level_1')) {
                console.log(`      ✅ This is AREA (sublocality): ${component.long_name}`);
            }
            if (component.types.includes('neighborhood')) {
                console.log(`      ✅ This is AREA (neighborhood): ${component.long_name}`);
            }
            if (component.types.includes('administrative_area_level_1')) {
                console.log(`      ℹ️ This is admin area 1: ${component.long_name}`);
            }
            if (component.types.includes('administrative_area_level_2')) {
                console.log(`      ℹ️ This is admin area 2: ${component.long_name}`);
            }
            if (component.types.includes('administrative_area_level_3')) {
                console.log(`      ℹ️ This is admin area 3: ${component.long_name}`);
            }
            if (component.types.includes('administrative_area_level_4')) {
                console.log(`      ✅ This is AREA (admin area 4): ${component.long_name}`);
            }
            if (component.types.includes('postal_code')) {
                console.log(`      ✅ This is POSTAL CODE: ${component.long_name}`);
            }
        });
        
        // Now test our parsing logic
        console.log('\n🔍 TESTING OUR PARSING LOGIC:');
        const parsed = parseComponentsDetailed(place.address_components);
        console.log('🔍 Parsed result:', parsed);
        
        return parsed;
        
    } catch (error) {
        console.log('❌ Google geocoding error:', error);
        return null;
    }
};

// Enhanced parsing with detailed logging
function parseComponentsDetailed(addressComponents) {
    console.log('🔍 Starting detailed component parsing...');
    
    const components = {
        country: null,
        city: null,
        area: null,
        postalCode: null
    };
    
    addressComponents.forEach((component, index) => {
        const types = component.types;
        const longName = component.long_name;
        
        console.log(`\n🔍 Processing component ${index + 1}: "${longName}"`);
        console.log(`   Types: [${types.join(', ')}]`);
        
        // Country detection
        if (types.includes('country')) {
            components.country = longName;
            console.log(`   ✅ SET COUNTRY: ${longName}`);
        }
        
        // City detection - try multiple types
        else if (types.includes('locality')) {
            components.city = longName;
            console.log(`   ✅ SET CITY (locality): ${longName}`);
        }
        else if (types.includes('administrative_area_level_3') && !components.city) {
            components.city = longName;
            console.log(`   ✅ SET CITY (admin_3): ${longName}`);
        }
        else if (types.includes('administrative_area_level_2') && !components.city) {
            components.city = longName;
            console.log(`   ✅ SET CITY (admin_2): ${longName}`);
        }
        
        // Area detection - try multiple types
        else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
            components.area = longName;
            console.log(`   ✅ SET AREA (sublocality): ${longName}`);
        }
        else if (types.includes('neighborhood')) {
            components.area = longName;
            console.log(`   ✅ SET AREA (neighborhood): ${longName}`);
        }
        else if (types.includes('administrative_area_level_4')) {
            components.area = longName;
            console.log(`   ✅ SET AREA (admin_4): ${longName}`);
        }
        else if (types.includes('administrative_area_level_5')) {
            components.area = longName;
            console.log(`   ✅ SET AREA (admin_5): ${longName}`);
        }
        
        // Postal code
        else if (types.includes('postal_code')) {
            components.postalCode = longName;
            console.log(`   ✅ SET POSTAL CODE: ${longName}`);
        }
        
        else {
            console.log(`   ⚪ Not used for extraction`);
        }
    });
    
    console.log('\n🔍 FINAL PARSED COMPONENTS:');
    console.log(`   Country: ${components.country || 'NOT FOUND'}`);
    console.log(`   City: ${components.city || 'NOT FOUND'}`);
    console.log(`   Area: ${components.area || 'NOT FOUND'}`);
    console.log(`   Postal Code: ${components.postalCode || 'NOT FOUND'}`);
    
    return components;
}

// Test function for common addresses
window.testCommonAddresses = async function() {
    console.log('🔍 DEBUG: Testing common addresses...');
    
    const testAddresses = [
        "88 Kurfürstendamm, Charlottenburg, Berlin 10709, Germany",
        "Charlottenburg, Berlin, Germany",
        "Berlin, Germany",
        "Via del Corso 45, Centro Storico, Rome 00186, Italy",
        "Centro Storico, Rome, Italy", 
        "25 Skoufa Street, Kolonaki, Athens 10673, Greece",
        "Kolonaki, Athens, Greece",
        "15 Irinis Street, Zografou, Athens 15772, Greece",
        "Zografou, Athens, Greece"
    ];
    
    for (const address of testAddresses) {
        console.log('\n' + '='.repeat(80));
        console.log(`🔍 TESTING: "${address}"`);
        console.log('='.repeat(80));
        
        await window.debugGoogleAddressAnalysis(address);
        
        // Wait a bit between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

// Quick test for registration form
window.testRegistrationAddress = async function(address) {
    console.log('🔍 DEBUG: Testing address for registration form...');
    
    if (!address) {
        const addressField = document.getElementById('officeAddress');
        if (addressField) {
            address = addressField.value.trim();
        }
    }
    
    if (!address) {
        console.log('❌ No address provided');
        return;
    }
    
    console.log(`🔍 Testing registration address: "${address}"`);
    
    const result = await window.debugGoogleAddressAnalysis(address);
    
    if (result) {
        console.log('\n🔍 FORM FIELD CHECK:');
        
        // Check if form fields exist
        const countryField = document.getElementById('country');
        const cityField = document.getElementById('city');
        const areaField = document.getElementById('area');
        
        console.log(`   Country field: ${countryField ? '✅ EXISTS' : '❌ NOT FOUND'}`);
        console.log(`   City field: ${cityField ? '✅ EXISTS' : '❌ NOT FOUND'}`);
        console.log(`   Area field: ${areaField ? '✅ EXISTS' : '❌ NOT FOUND'}`);
        
        if (result.country && countryField) {
            console.log(`   ✅ Would fill country: "${result.country}"`);
        }
        if (result.city && cityField) {
            console.log(`   ✅ Would fill city: "${result.city}"`);
        }
        if (result.area && areaField) {
            console.log(`   ✅ Would fill area: "${result.area}"`);
        }
    }
};

console.log('🔍 DEBUG GOOGLE ADDRESS LOADED');
console.log('💡 Test address: await window.debugGoogleAddressAnalysis("your address")');
console.log('💡 Test common: await window.testCommonAddresses()');
console.log('💡 Test registration: await window.testRegistrationAddress()'); 
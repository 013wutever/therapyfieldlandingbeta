// ========== DEBUG COUNTRY DETECTION ==========
// Debug why Berlin is showing as Greece instead of Germany

console.log('🔍 DEBUG COUNTRY DETECTION: Loading debugging tools...');

// Debug version of country extraction with detailed logging
function debugCountryExtraction(therapist) {
    console.log(`\n🔍 DEBUGGING: Dr. ${therapist.first_name} ${therapist.last_name}`);
    console.log(`   Address: "${therapist.address}"`);
    console.log(`   City: "${therapist.city}"`);
    console.log(`   CityKey: "${therapist.cityKey}"`);
    
    const address = therapist.address || '';
    const city = therapist.city || '';
    const cityKey = therapist.cityKey || '';
    
    if (!address) {
        console.log(`   ❌ No address provided`);
        return null;
    }
    
    const addressLower = address.toLowerCase();
    console.log(`   🔍 Address (lowercase): "${addressLower}"`);
    
    // Test each detection method step by step
    
    // Method 1: Postal code patterns
    console.log(`   📮 Testing postal code patterns...`);
    
    const postalCodePatterns = {
        'Greece': /\b\d{5}\b.*greece|greece.*\b\d{5}\b|\b1[0-9]{4}\b|\b2[0-9]{4}\b|\b3[0-9]{4}\b|\bgreece\b/i,
        'Italy': /\b\d{5}\b.*italy|italy.*\b\d{5}\b|\b0[0-9]{4}\b|rome\s+\d{5}/i,
        'France': /\b\d{5}\b.*france|france.*\b\d{5}\b|\bparis\s+\d{5}\b|\b7[0-9]{4}\b/i,
        'Germany': /\b\d{5}\b.*germany|germany.*\b\d{5}\b|\bberlin\s+\d{5}\b|\b1[0-9]{4}\b|\b8[0-9]{4}\b|\b9[0-9]{4}\b/i,
        'United Kingdom': /\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b|london.*\b[A-Z]\d[A-Z]\s?\d[A-Z]{2}\b/i
    };
    
    for (const [country, pattern] of Object.entries(postalCodePatterns)) {
        const matches = pattern.test(addressLower);
        console.log(`      ${country}: ${matches ? '✅ MATCH' : '❌ no match'} - Pattern: ${pattern}`);
        if (matches) {
            console.log(`   📮 POSTAL CODE MATCH: ${country}`);
            return country;
        }
    }
    
    // Method 2: City name patterns  
    console.log(`   🏙️ Testing city name patterns...`);
    
    const cityPatterns = {
        'Greece': ['athens', 'thessaloniki', 'piraeus', 'patras', 'volos', 'larissa', 'heraklion'],
        'Italy': ['rome', 'milan', 'naples', 'turin', 'florence', 'bologna', 'venice'],
        'France': ['paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'bordeaux'],
        'Germany': ['berlin', 'hamburg', 'munich', 'cologne', 'frankfurt', 'düsseldorf', 'dortmund'],
        'United Kingdom': ['london', 'birmingham', 'manchester', 'glasgow', 'liverpool', 'edinburgh', 'cardiff']
    };
    
    for (const [country, cities] of Object.entries(cityPatterns)) {
        for (const cityName of cities) {
            const matches = addressLower.includes(cityName);
            if (matches) {
                console.log(`      ${country} (${cityName}): ✅ MATCH`);
                console.log(`   🏙️ CITY PATTERN MATCH: ${country} for city: ${cityName}`);
                return country;
            }
        }
        console.log(`      ${country}: ❌ no match`);
    }
    
    // Method 3: Fallback mappings
    console.log(`   🗝️ Testing fallback mappings...`);
    
    const cityKeyMapping = {
        'athens': 'Greece',
        'paris': 'France', 
        'rome': 'Italy',
        'berlin': 'Germany',
        'london': 'United Kingdom'
    };
    
    if (cityKey && cityKeyMapping[cityKey.toLowerCase()]) {
        const result = cityKeyMapping[cityKey.toLowerCase()];
        console.log(`   🗝️ CITY KEY FALLBACK: ${result} for cityKey: ${cityKey}`);
        return result;
    }
    
    if (city && cityKeyMapping[city.toLowerCase()]) {
        const result = cityKeyMapping[city.toLowerCase()];
        console.log(`   🏛️ CITY NAME FALLBACK: ${result} for city: ${city}`);
        return result;
    }
    
    console.log(`   ❓ NO MATCH FOUND for address: ${address}`);
    return null;
}

// Test the problematic therapists
window.debugBerlinTherapists = function() {
    console.log('🔍 DEBUG: Testing Berlin therapists specifically...');
    
    if (!window.therapistData) {
        console.log('❌ No therapist data available');
        return;
    }
    
    const berlinTherapists = window.therapistData.filter(t => 
        t.city && t.city.toLowerCase() === 'berlin'
    );
    
    console.log(`🔍 Found ${berlinTherapists.length} Berlin therapists:`);
    
    berlinTherapists.forEach((therapist, index) => {
        console.log(`\n--- Berlin Therapist ${index + 1} ---`);
        const detectedCountry = debugCountryExtraction(therapist);
        console.log(`🎯 FINAL RESULT: ${detectedCountry || 'Unknown'}`);
        
        if (detectedCountry !== 'Germany') {
            console.log(`⚠️  PROBLEM: Expected Germany, got ${detectedCountry}`);
        }
    });
};

// Test all therapists to find country detection issues
window.debugAllCountryDetection = function() {
    console.log('🔍 DEBUG: Testing country detection for all therapists...');
    
    if (!window.therapistData) {
        console.log('❌ No therapist data available');
        return;
    }
    
    const results = {
        correct: 0,
        incorrect: 0,
        unknown: 0,
        details: []
    };
    
    const expectedCountries = {
        'athens': 'Greece',
        'paris': 'France',
        'rome': 'Italy', 
        'berlin': 'Germany',
        'london': 'United Kingdom'
    };
    
    window.therapistData.forEach(therapist => {
        const cityKey = therapist.cityKey ? therapist.cityKey.toLowerCase() : '';
        const expectedCountry = expectedCountries[cityKey] || 'Unknown';
        
        const detectedCountry = debugCountryExtraction(therapist);
        
        const result = {
            name: `Dr. ${therapist.first_name} ${therapist.last_name}`,
            city: therapist.city,
            cityKey: therapist.cityKey,
            address: therapist.address,
            expected: expectedCountry,
            detected: detectedCountry || 'Unknown',
            correct: detectedCountry === expectedCountry
        };
        
        if (result.correct) {
            results.correct++;
        } else if (detectedCountry === null) {
            results.unknown++;
        } else {
            results.incorrect++;
        }
        
        results.details.push(result);
    });
    
    console.log(`\n📊 DETECTION SUMMARY:`);
    console.log(`   ✅ Correct: ${results.correct}`);
    console.log(`   ❌ Incorrect: ${results.incorrect}`);
    console.log(`   ❓ Unknown: ${results.unknown}`);
    
    console.log(`\n❌ INCORRECT DETECTIONS:`);
    results.details.filter(r => !r.correct && r.detected !== 'Unknown').forEach(result => {
        console.log(`   ${result.name} (${result.city}): Expected ${result.expected}, got ${result.detected}`);
        console.log(`      Address: ${result.address}`);
    });
    
    return results;
};

// Quick test for Berlin specifically 
window.quickBerlinTest = function() {
    console.log('🔍 QUICK BERLIN TEST:');
    
    const testAddress = "88 Kurfürstendamm, Charlottenburg, Berlin 10709";
    const testCity = "Berlin";
    const testCityKey = "berlin";
    
    console.log(`Testing: "${testAddress}"`);
    
    const testTherapist = {
        first_name: "Test",
        last_name: "Therapist", 
        address: testAddress,
        city: testCity,
        cityKey: testCityKey
    };
    
    const result = debugCountryExtraction(testTherapist);
    console.log(`🎯 Result: ${result}`);
    
    if (result === 'Germany') {
        console.log('✅ DETECTION WORKING CORRECTLY');
    } else {
        console.log('❌ DETECTION FAILED - NEEDS FIXING');
    }
    
    return result;
};

// Auto-run quick test
setTimeout(() => {
    console.log('🔍 DEBUG: Auto-running Berlin test...');
    window.quickBerlinTest();
}, 500);

console.log('🔍 DEBUG COUNTRY DETECTION LOADED');
console.log('💡 Test Berlin: window.debugBerlinTherapists()');
console.log('💡 Test all: window.debugAllCountryDetection()');
console.log('💡 Quick test: window.quickBerlinTest()'); 
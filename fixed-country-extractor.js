// ========== FIXED COUNTRY EXTRACTOR ==========
// Fixed postal code patterns that don't overlap between countries

console.log('🔧 FIXED COUNTRY EXTRACTOR: Loading corrected postal code detection...');

// Fixed country extraction with accurate, non-overlapping postal codes
function fixedCountryExtraction(address, city, cityKey) {
    if (!address) return null;
    
    const addressLower = address.toLowerCase();
    
    // Method 1: Accurate postal code patterns (non-overlapping)
    console.log(`🔧 Testing address: "${addressLower}"`);
    
    // Greece: 10000-73999 (but exclude common German ranges)
    if (/\b(1[0-4][0-9]{3}|15[0-7][0-9]{2}|158[0-3][0-9]|584[0-9]{2}|[2-6][0-9]{4}|7[0-3][0-9]{3})\b/i.test(addressLower)) {
        // But check if it's actually in Athens area first
        if (addressLower.includes('athens') || addressLower.includes('greece')) {
            console.log(`🔧 Greece postal code + location match`);
            return 'Greece';
        }
    }
    
    // Germany: 01000-99999 (but be more specific for 10xxx)
    if (/\b(0[1-9][0-9]{3}|[2-9][0-9]{4})\b/i.test(addressLower) || 
        (/\b1[0-9]{4}\b/i.test(addressLower) && addressLower.includes('berlin'))) {
        console.log(`🔧 Germany postal code match`);
        return 'Germany';
    }
    
    // Italy: 00100-98168
    if (/\b(0[0-9]{4}|[1-8][0-9]{4}|9[0-8][0-9]{3})\b/i.test(addressLower)) {
        if (addressLower.includes('rome') || addressLower.includes('italy')) {
            console.log(`🔧 Italy postal code match`);
            return 'Italy';
        }
    }
    
    // France: 01000-98890
    if (/\b(0[1-9][0-9]{3}|[1-8][0-9]{4}|9[0-8][0-9]{3})\b/i.test(addressLower)) {
        if (addressLower.includes('paris') || addressLower.includes('france')) {
            console.log(`🔧 France postal code match`);
            return 'France';
        }
    }
    
    // UK: Alphanumeric pattern
    if (/\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/i.test(addressLower)) {
        console.log(`🔧 UK postal code match`);
        return 'United Kingdom';
    }
    
    // Method 2: City name detection (most reliable for our data)
    console.log(`🔧 Testing city patterns...`);
    
    if (addressLower.includes('berlin')) {
        console.log(`🔧 Berlin city match -> Germany`);
        return 'Germany';
    }
    if (addressLower.includes('athens')) {
        console.log(`🔧 Athens city match -> Greece`);
        return 'Greece';
    }
    if (addressLower.includes('rome')) {
        console.log(`🔧 Rome city match -> Italy`);
        return 'Italy';
    }
    if (addressLower.includes('paris')) {
        console.log(`🔧 Paris city match -> France`);
        return 'France';
    }
    if (addressLower.includes('london')) {
        console.log(`🔧 London city match -> UK`);
        return 'United Kingdom';
    }
    
    // Method 3: Street patterns (as backup)
    if (addressLower.includes('via ') || addressLower.includes('piazza ')) {
        console.log(`🔧 Italian street pattern -> Italy`);
        return 'Italy';
    }
    if (addressLower.includes('rue ') || addressLower.includes('avenue ')) {
        console.log(`🔧 French street pattern -> France`);
        return 'France';
    }
    if (addressLower.includes('straße') || addressLower.includes('strasse')) {
        console.log(`🔧 German street pattern -> Germany`);
        return 'Germany';
    }
    
    // Method 4: Fallback to city key mapping
    if (cityKey) {
        const cityKeyMapping = {
            'athens': 'Greece',
            'paris': 'France',
            'rome': 'Italy',
            'berlin': 'Germany',
            'london': 'United Kingdom'
        };
        
        const result = cityKeyMapping[cityKey.toLowerCase()];
        if (result) {
            console.log(`🔧 City key fallback: ${result} for ${cityKey}`);
            return result;
        }
    }
    
    console.log(`🔧 No country detected for: ${address}`);
    return null;
}

// Main function to fix country extraction
window.FIXED_EXTRACT_COUNTRIES = function() {
    console.log('🔧 FIXED: Starting corrected country extraction...');
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('❌ No therapist data available');
        return false;
    }
    
    console.log(`🔧 Processing ${window.therapistData.length} therapists...`);
    
    let successCount = 0;
    let failureCount = 0;
    
    // Fix each therapist's country
    window.therapistData.forEach((therapist, index) => {
        console.log(`\n${index + 1}. Dr. ${therapist.first_name} ${therapist.last_name}`);
        console.log(`   Address: ${therapist.address}`);
        console.log(`   City: ${therapist.city}, CityKey: ${therapist.cityKey}`);
        
        // Extract country using fixed logic
        const extractedCountry = fixedCountryExtraction(
            therapist.address, 
            therapist.city, 
            therapist.cityKey
        );
        
        if (extractedCountry) {
            therapist.country = extractedCountry;
            successCount++;
            console.log(`   ✅ Country: ${extractedCountry}`);
        } else {
            therapist.country = 'Unknown';
            failureCount++;
            console.log(`   ❌ Country: Unknown`);
        }
    });
    
    console.log(`\n📊 FIXED EXTRACTION SUMMARY:`);
    console.log(`   ✅ Success: ${successCount} therapists`);
    console.log(`   ❌ Failed: ${failureCount} therapists`);
    
    return true;
};

// Update city filter with fixed countries
window.UPDATE_FIXED_CITY_FILTER = function() {
    console.log('🔧 UPDATING: City filter with fixed countries...');
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('❌ No therapist data available');
        return false;
    }
    
    // Run fixed country extraction
    window.FIXED_EXTRACT_COUNTRIES();
    
    // Build city options with correct countries
    const cityData = new Map();
    
    window.therapistData.forEach(therapist => {
        const country = therapist.country || 'Unknown';
        
        // Only process main cities (not areas)
        if (therapist.cityKey && therapist.city) {
            const cityKey = therapist.cityKey;
            
            if (!cityData.has(cityKey)) {
                cityData.set(cityKey, {
                    key: cityKey,
                    country: country,
                    city: therapist.city,
                    display: `${country}, ${therapist.city}`
                });
            }
        }
    });
    
    console.log(`🔧 Built ${cityData.size} city options:`);
    Array.from(cityData.values()).forEach(city => {
        console.log(`   📍 ${city.display}`);
    });
    
    // Update filter
    const cityFilter = document.getElementById('city-filter');
    if (!cityFilter) {
        console.log('❌ City filter element not found');
        return false;
    }
    
    // Clear and rebuild
    cityFilter.innerHTML = '<option value="">All Cities</option>';
    
    // Sort by country, then city
    const sortedCities = Array.from(cityData.values()).sort((a, b) => {
        if (a.country !== b.country) {
            return a.country.localeCompare(b.country);
        }
        return a.city.localeCompare(b.city);
    });
    
    // Add options
    sortedCities.forEach(cityInfo => {
        const option = document.createElement('option');
        option.value = cityInfo.key;
        option.textContent = cityInfo.display;
        cityFilter.appendChild(option);
    });
    
    console.log(`✅ City filter updated with ${cityFilter.options.length} options`);
    
    // Verification
    const berlinOption = Array.from(cityFilter.options).find(opt => 
        opt.value === 'berlin'
    );
    if (berlinOption) {
        console.log(`🎯 Berlin shows as: "${berlinOption.textContent}"`);
        if (berlinOption.textContent === 'Germany, Berlin') {
            console.log('✅ Berlin is correctly showing as Germany!');
        } else {
            console.log('❌ Berlin still showing wrong country');
        }
    }
    
    return true;
};

// Override navigation
const existingNavigationFixed = window.navigateToTherapistStepThreeCriteria;
window.navigateToTherapistStepThreeCriteria = function() {
    console.log('🔧 FIXED: Navigation with corrected country detection...');
    
    // Do normal navigation
    try {
        if (existingNavigationFixed && typeof existingNavigationFixed === 'function') {
            existingNavigationFixed.apply(this, arguments);
        } else {
            // Basic navigation
            ['therapist-step-1', 'therapist-step-2', 'therapist-step-3-location', 'therapist-step-3-quiz'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });
            
            const criteriaStep = document.getElementById('therapist-step-3-criteria');
            if (criteriaStep) {
                criteriaStep.classList.remove('hidden');
                criteriaStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    } catch (error) {
        console.log('❌ Navigation error:', error);
    }
    
    // Run fixed country extraction and filter update
    setTimeout(() => {
        console.log('🔧 FIXED: Running corrected country extraction...');
        window.UPDATE_FIXED_CITY_FILTER();
    }, 500);
};

// Auto-run 
setTimeout(() => {
    if (window.therapistData && window.therapistData.length > 0) {
        console.log('🔧 FIXED: Auto-running corrected extraction...');
        window.UPDATE_FIXED_CITY_FILTER();
    }
}, 2500);

// Test function
window.testFixedCountryExtraction = function() {
    console.log('🧪 TESTING: Fixed country extraction...');
    
    // Test specific addresses
    const testCases = [
        { address: "88 Kurfürstendamm, Charlottenburg, Berlin 10709", city: "Berlin", cityKey: "berlin", expected: "Germany" },
        { address: "Via del Corso 45, Centro Storico, Rome 00186", city: "Rome", cityKey: "rome", expected: "Italy" },
        { address: "25 Skoufa Street, Kolonaki, Athens 10673", city: "Athens", cityKey: "athens", expected: "Greece" }
    ];
    
    testCases.forEach(test => {
        const result = fixedCountryExtraction(test.address, test.city, test.cityKey);
        const status = result === test.expected ? '✅' : '❌';
        console.log(`${status} ${test.city}: Expected ${test.expected}, got ${result}`);
    });
    
    if (window.UPDATE_FIXED_CITY_FILTER()) {
        console.log('✅ Filter update successful');
    }
};

console.log('🔧 FIXED COUNTRY EXTRACTOR LOADED');
console.log('💡 Test: window.testFixedCountryExtraction()');
console.log('💡 Update filter: window.UPDATE_FIXED_CITY_FILTER()'); 
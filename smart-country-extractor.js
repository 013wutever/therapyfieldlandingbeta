// ========== SMART COUNTRY EXTRACTOR ==========
// Automatically extracts country from address using postal codes and patterns

console.log('🌍 SMART COUNTRY EXTRACTOR: Loading intelligent address analysis...');

// Smart country extraction based on address patterns and postal codes
function extractCountryFromAddress(address, city, cityKey) {
    if (!address) return null;
    
    const addressLower = address.toLowerCase();
    
    // Method 1: Postal code patterns (most reliable)
    const postalCodePatterns = {
        'Greece': /\b\d{5}\b.*greece|greece.*\b\d{5}\b|\b1[0-9]{4}\b|\b2[0-9]{4}\b|\b3[0-9]{4}\b|\bgreece\b/i,
        'Italy': /\b\d{5}\b.*italy|italy.*\b\d{5}\b|\b0[0-9]{4}\b|rome\s+\d{5}/i,
        'France': /\b\d{5}\b.*france|france.*\b\d{5}\b|\bparis\s+\d{5}\b|\b7[0-9]{4}\b/i,
        'Germany': /\b\d{5}\b.*germany|germany.*\b\d{5}\b|\bberlin\s+\d{5}\b|\b1[0-9]{4}\b|\b8[0-9]{4}\b|\b9[0-9]{4}\b/i,
        'United Kingdom': /\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b|london.*\b[A-Z]\d[A-Z]\s?\d[A-Z]{2}\b/i
    };
    
    // Check postal code patterns first
    for (const [country, pattern] of Object.entries(postalCodePatterns)) {
        if (pattern.test(addressLower)) {
            console.log(`📮 Postal code pattern match: ${country} for address: ${address}`);
            return country;
        }
    }
    
    // Method 2: City name patterns (specific cities)
    const cityPatterns = {
        'Greece': ['athens', 'thessaloniki', 'piraeus', 'patras', 'volos', 'larissa', 'heraklion'],
        'Italy': ['rome', 'milan', 'naples', 'turin', 'florence', 'bologna', 'venice'],
        'France': ['paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'bordeaux'],
        'Germany': ['berlin', 'hamburg', 'munich', 'cologne', 'frankfurt', 'düsseldorf', 'dortmund'],
        'United Kingdom': ['london', 'birmingham', 'manchester', 'glasgow', 'liverpool', 'edinburgh', 'cardiff']
    };
    
    for (const [country, cities] of Object.entries(cityPatterns)) {
        for (const cityName of cities) {
            if (addressLower.includes(cityName)) {
                console.log(`🏙️ City pattern match: ${country} for city: ${cityName} in address: ${address}`);
                return country;
            }
        }
    }
    
    // Method 3: Street name patterns (language-specific)
    const streetPatterns = {
        'Greece': ['leoforos', 'odos', 'plateia', 'street', 'avenue'],
        'Italy': ['via', 'piazza', 'corso', 'viale', 'largo'],
        'France': ['rue', 'avenue', 'boulevard', 'place', 'quai'],
        'Germany': ['straße', 'strasse', 'platz', 'weg', 'allee', 'gasse'],
        'United Kingdom': ['street', 'road', 'avenue', 'lane', 'crescent', 'square']
    };
    
    for (const [country, patterns] of Object.entries(streetPatterns)) {
        for (const pattern of patterns) {
            if (addressLower.includes(pattern)) {
                console.log(`🛣️ Street pattern match: ${country} for pattern: ${pattern} in address: ${address}`);
                return country;
            }
        }
    }
    
    // Method 4: Fallback to city key mapping (last resort)
    const cityKeyMapping = {
        'athens': 'Greece',
        'paris': 'France',
        'rome': 'Italy',
        'berlin': 'Germany',
        'london': 'United Kingdom'
    };
    
    if (cityKey && cityKeyMapping[cityKey.toLowerCase()]) {
        console.log(`🗝️ City key fallback: ${cityKeyMapping[cityKey.toLowerCase()]} for cityKey: ${cityKey}`);
        return cityKeyMapping[cityKey.toLowerCase()];
    }
    
    if (city && cityKeyMapping[city.toLowerCase()]) {
        console.log(`🏛️ City name fallback: ${cityKeyMapping[city.toLowerCase()]} for city: ${city}`);
        return cityKeyMapping[city.toLowerCase()];
    }
    
    console.log(`❓ Could not determine country for address: ${address}`);
    return null;
}

// Main function to enhance therapist data with country information
window.SMART_EXTRACT_COUNTRIES = function() {
    console.log('🌍 SMART EXTRACTOR: Starting intelligent country extraction...');
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('❌ No therapist data available');
        return false;
    }
    
    console.log(`🌍 Processing ${window.therapistData.length} therapists...`);
    
    let successCount = 0;
    let failureCount = 0;
    
    // Enhance each therapist with country information
    window.therapistData.forEach((therapist, index) => {
        console.log(`\n${index + 1}. Dr. ${therapist.first_name} ${therapist.last_name}`);
        console.log(`   Address: ${therapist.address}`);
        console.log(`   City: ${therapist.city}, Area: ${therapist.area}`);
        
        // Extract country from address
        const extractedCountry = extractCountryFromAddress(
            therapist.address, 
            therapist.city, 
            therapist.cityKey
        );
        
        if (extractedCountry) {
            therapist.country = extractedCountry;
            successCount++;
            console.log(`   ✅ Country extracted: ${extractedCountry}`);
        } else {
            therapist.country = 'Unknown';
            failureCount++;
            console.log(`   ❌ Could not determine country`);
        }
    });
    
    console.log(`\n📊 EXTRACTION SUMMARY:`);
    console.log(`   ✅ Success: ${successCount} therapists`);
    console.log(`   ❌ Failed: ${failureCount} therapists`);
    
    return true;
};

// Update location filters with enhanced data
window.UPDATE_LOCATION_FILTERS_WITH_COUNTRIES = function() {
    console.log('🎯 UPDATING: Location filters with extracted countries...');
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('❌ No therapist data available');
        return false;
    }
    
    // Ensure countries are extracted
    window.SMART_EXTRACT_COUNTRIES();
    
    // Build location data with correct countries
    const locationData = new Map();
    
    window.therapistData.forEach(therapist => {
        const country = therapist.country || 'Unknown';
        
        // Add city
        if (therapist.cityKey && therapist.city) {
            const cityKey = therapist.cityKey;
            if (!locationData.has(cityKey)) {
                locationData.set(cityKey, {
                    key: cityKey,
                    display: `${country}, ${therapist.city}`,
                    country: country,
                    name: therapist.city,
                    type: 'city'
                });
            }
        }
        
        // Add area (if different from city)
        if (therapist.areaKey && therapist.area && therapist.areaKey !== therapist.cityKey) {
            const areaKey = therapist.areaKey;
            if (!locationData.has(areaKey)) {
                locationData.set(areaKey, {
                    key: areaKey,
                    display: `${country}, ${therapist.area}`,
                    country: country,
                    name: therapist.area,
                    type: 'area'
                });
            }
        }
    });
    
    console.log(`🎯 Built ${locationData.size} location options:`);
    Array.from(locationData.values()).forEach(location => {
        console.log(`   📍 ${location.display} (${location.key})`);
    });
    
    // Update city filter
    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
        console.log('🎯 Updating city filter dropdown...');
        
        // Clear and rebuild
        cityFilter.innerHTML = '<option value="">All Locations</option>';
        
        // Sort by country, then by name
        const sortedLocations = Array.from(locationData.values()).sort((a, b) => {
            if (a.country !== b.country) {
                return a.country.localeCompare(b.country);
            }
            return a.name.localeCompare(b.name);
        });
        
        // Add options
        sortedLocations.forEach(location => {
            const option = document.createElement('option');
            option.value = location.key;
            option.textContent = location.display;
            cityFilter.appendChild(option);
        });
        
        console.log(`✅ City filter updated with ${cityFilter.options.length} options`);
        
        // Verify results
        const hasZografou = Array.from(cityFilter.options).some(opt => 
            opt.value.toLowerCase().includes('zografou')
        );
        console.log(`🎯 Zografou available: ${hasZografou ? '✅ YES' : '❌ NO'}`);
        
        // Check for incorrect countries
        const wrongCountries = Array.from(cityFilter.options).filter(opt => 
            (opt.text.includes('Greece, Rome') || 
             opt.text.includes('Greece, Berlin') ||
             opt.text.includes('Italy, Athens'))
        );
        
        if (wrongCountries.length > 0) {
            console.log('⚠️ Found incorrect country mappings:');
            wrongCountries.forEach(opt => console.log(`   ❌ ${opt.text}`));
        } else {
            console.log('✅ All country mappings appear correct');
        }
        
    } else {
        console.log('❌ City filter element not found');
        return false;
    }
    
    return true;
};

// Override navigation to use smart extraction
const previousNavigation = window.navigateToTherapistStepThreeCriteria;
window.navigateToTherapistStepThreeCriteria = function() {
    console.log('🌍 SMART EXTRACTOR: Navigation with intelligent country extraction...');
    
    // Do normal navigation
    try {
        if (previousNavigation && typeof previousNavigation === 'function') {
            previousNavigation.apply(this, arguments);
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
    
    // Run smart extraction
    setTimeout(() => {
        console.log('🌍 SMART EXTRACTOR: Running intelligent country extraction...');
        
        // Load localStorage therapists first
        if (typeof window.loadAndMergeLocalStorageTherapists === 'function') {
            try {
                const added = window.loadAndMergeLocalStorageTherapists();
                if (added.length > 0) {
                    console.log(`✅ Added ${added.length} therapists from localStorage`);
                }
            } catch (e) {
                console.log('⚠️ Could not load localStorage therapists');
            }
        }
        
        // Extract countries and update filters
        window.UPDATE_LOCATION_FILTERS_WITH_COUNTRIES();
        
        // Also fix other filters
        if (typeof window.INSTANT_OVERRIDE_FILTERS === 'function') {
            window.INSTANT_OVERRIDE_FILTERS();
        }
        
        // Populate cards
        if (typeof window.populateCriteriaCards === 'function') {
            try {
                window.populateCriteriaCards();
                console.log('✅ Therapist cards populated');
            } catch (e) {
                console.log('⚠️ Could not populate therapist cards');
            }
        }
        
    }, 300);
};

// Auto-run on load
setTimeout(() => {
    if (window.therapistData && window.therapistData.length > 0) {
        console.log('🌍 SMART EXTRACTOR: Auto-running country extraction...');
        window.UPDATE_LOCATION_FILTERS_WITH_COUNTRIES();
    }
}, 1500);

// Manual test function
window.testSmartCountryExtraction = function() {
    console.log('🧪 TESTING: Smart country extraction...');
    
    if (window.UPDATE_LOCATION_FILTERS_WITH_COUNTRIES()) {
        console.log('✅ Test successful!');
        
        const cityFilter = document.getElementById('city-filter');
        if (cityFilter) {
            console.log(`\nCity filter options (${cityFilter.options.length}):`);
            Array.from(cityFilter.options).slice(1, 8).forEach((opt, idx) => {
                console.log(`   ${idx + 1}. ${opt.text} (${opt.value})`);
            });
        }
    } else {
        console.log('❌ Test failed');
    }
};

console.log('🌍 SMART COUNTRY EXTRACTOR LOADED');
console.log('💡 Manual test: window.testSmartCountryExtraction()');
console.log('💡 Manual run: window.UPDATE_LOCATION_FILTERS_WITH_COUNTRIES()'); 
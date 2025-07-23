// ========== IMPROVED LOCATION FILTER ==========
// Detects country from address and uses format "Country, City"

console.log('🌍 IMPROVED LOCATION FILTER: Loading address-based country detection...');

// Enhanced country detection from actual address
function detectCountryFromAddress(therapist) {
    const address = therapist.address || '';
    const city = therapist.city || '';
    const cityKey = therapist.cityKey || '';
    
    // First, try to detect from address
    if (address) {
        const addressLower = address.toLowerCase();
        
        // Look for country indicators in address
        if (addressLower.includes('athens') || addressLower.includes('greece')) {
            return 'Greece';
        }
        if (addressLower.includes('paris') || addressLower.includes('france')) {
            return 'France';
        }
        if (addressLower.includes('rome') || addressLower.includes('italy')) {
            return 'Italy';
        }
        if (addressLower.includes('berlin') || addressLower.includes('germany')) {
            return 'Germany';
        }
        if (addressLower.includes('london') || addressLower.includes('uk') || addressLower.includes('united kingdom')) {
            return 'United Kingdom';
        }
    }
    
    // Fallback to city-based detection
    if (city) {
        const cityLower = city.toLowerCase();
        if (cityLower === 'athens') return 'Greece';
        if (cityLower === 'paris') return 'France';
        if (cityLower === 'rome') return 'Italy';
        if (cityLower === 'berlin') return 'Germany';
        if (cityLower === 'london') return 'United Kingdom';
    }
    
    // Final fallback to cityKey
    if (cityKey) {
        const keyLower = cityKey.toLowerCase();
        if (keyLower === 'athens') return 'Greece';
        if (keyLower === 'paris') return 'France';
        if (keyLower === 'rome') return 'Italy';
        if (keyLower === 'berlin') return 'Germany';
        if (keyLower === 'london') return 'United Kingdom';
    }
    
    return 'Unknown';
}

// Improved filter override function
window.IMPROVED_LOCATION_FILTERS = function() {
    console.log('🌍 IMPROVED: Starting address-based location filter...');
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('🌍 IMPROVED: No therapist data available');
        return false;
    }
    
    console.log(`🌍 IMPROVED: Processing ${window.therapistData.length} therapists...`);
    
    // Extract unique locations with improved country detection
    const locationData = new Map();
    
    window.therapistData.forEach(therapist => {
        const country = detectCountryFromAddress(therapist);
        
        console.log(`Processing: Dr. ${therapist.first_name} ${therapist.last_name}`);
        console.log(`   Address: ${therapist.address}`);
        console.log(`   City: ${therapist.city}, Area: ${therapist.area}`);
        console.log(`   Detected Country: ${country}`);
        
        // Add city location
        if (therapist.cityKey && therapist.city) {
            const cityKey = therapist.cityKey;
            if (!locationData.has(cityKey)) {
                locationData.set(cityKey, {
                    key: cityKey,
                    display: `${country}, ${therapist.city}`,
                    country: country,
                    type: 'city',
                    name: therapist.city
                });
            }
        }
        
        // Add area location (if different from city)
        if (therapist.areaKey && therapist.area && therapist.areaKey !== therapist.cityKey) {
            const areaKey = therapist.areaKey;
            if (!locationData.has(areaKey)) {
                // For areas, show the area name (not the city name)
                locationData.set(areaKey, {
                    key: areaKey,
                    display: `${country}, ${therapist.area}`,
                    country: country,
                    type: 'area',
                    name: therapist.area
                });
            }
        }
    });
    
    console.log(`🌍 IMPROVED: Extracted ${locationData.size} unique locations`);
    
    // Log all locations for verification
    Array.from(locationData.values()).forEach(location => {
        console.log(`   📍 ${location.display} (${location.key}) - ${location.type}`);
    });
    
    // Update the city filter
    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
        console.log('🌍 IMPROVED: Updating city filter...');
        
        // Clear existing options
        cityFilter.innerHTML = '<option value="">All Locations</option>';
        
        // Sort locations by country, then by name
        const sortedLocations = Array.from(locationData.values()).sort((a, b) => {
            if (a.country !== b.country) {
                return a.country.localeCompare(b.country);
            }
            return a.name.localeCompare(b.name);
        });
        
        // Add all location options
        sortedLocations.forEach(location => {
            const option = document.createElement('option');
            option.value = location.key;
            option.textContent = location.display;
            cityFilter.appendChild(option);
            console.log(`   ✅ Added: ${location.display} (${location.key})`);
        });
        
        console.log(`🌍 IMPROVED: City filter updated with ${cityFilter.options.length} options`);
        
        // Verify specific locations
        const hasZografou = Array.from(cityFilter.options).some(opt => 
            opt.value.toLowerCase().includes('zografou')
        );
        console.log(`🎯 Zografou available: ${hasZografou ? '✅ YES' : '❌ NO'}`);
        
        if (hasZografou) {
            const zografouOption = Array.from(cityFilter.options).find(opt => 
                opt.value.toLowerCase().includes('zografou')
            );
            console.log(`   Zografou: "${zografouOption.text}" (${zografouOption.value})`);
        }
        
        // Check for any incorrect countries
        const incorrectCountries = Array.from(cityFilter.options).filter(opt => 
            opt.text.includes('Greece, Rome') || 
            opt.text.includes('Italy, Athens') ||
            opt.text.includes('France, Berlin')
        );
        
        if (incorrectCountries.length > 0) {
            console.log('⚠️ Found incorrect country mappings:');
            incorrectCountries.forEach(opt => {
                console.log(`   ❌ ${opt.text} (${opt.value})`);
            });
        } else {
            console.log('✅ All country mappings appear correct');
        }
        
    } else {
        console.log('❌ City filter element not found');
        return false;
    }
    
    console.log('🌍 IMPROVED: Location filter update complete!');
    return true;
};

// Enhanced navigation override
const existingNavigationImproved = window.navigateToTherapistStepThreeCriteria;
window.navigateToTherapistStepThreeCriteria = function() {
    console.log('🌍 IMPROVED: Navigation with improved location filter...');
    
    // Do normal navigation first
    try {
        if (existingNavigationImproved && typeof existingNavigationImproved === 'function') {
            existingNavigationImproved.apply(this, arguments);
        } else {
            // Fallback navigation
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
        console.log('🌍 IMPROVED: Navigation error:', error);
    }
    
    // Run improved location filter
    setTimeout(() => {
        console.log('🌍 IMPROVED: Running improved location filter...');
        
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
        
        // Run improved location filter
        window.IMPROVED_LOCATION_FILTERS();
        
        // Also run other filter fixes for non-location filters
        if (typeof window.INSTANT_OVERRIDE_FILTERS === 'function') {
            console.log('🌍 IMPROVED: Also running instant override for other filters...');
            window.INSTANT_OVERRIDE_FILTERS();
        }
        
        // Populate therapist cards
        if (typeof window.populateCriteriaCards === 'function') {
            try {
                window.populateCriteriaCards();
                console.log('✅ Therapist cards populated');
            } catch (e) {
                console.log('⚠️ Could not populate therapist cards');
            }
        }
        
    }, 200);
};

// Auto-run to fix existing filters
setTimeout(() => {
    if (window.therapistData && window.therapistData.length > 0) {
        console.log('🌍 IMPROVED: Auto-running improved location filter...');
        window.IMPROVED_LOCATION_FILTERS();
    }
}, 1000);

// Make available for manual testing
window.testImprovedLocationFilter = function() {
    console.log('🧪 TESTING: Improved location filter...');
    
    if (window.IMPROVED_LOCATION_FILTERS()) {
        console.log('✅ Test successful!');
        
        const cityFilter = document.getElementById('city-filter');
        if (cityFilter) {
            console.log(`City filter has ${cityFilter.options.length} options:`);
            Array.from(cityFilter.options).slice(1, 6).forEach((opt, idx) => {
                console.log(`   ${idx + 1}. ${opt.text} (${opt.value})`);
            });
        }
    } else {
        console.log('❌ Test failed');
    }
};

console.log('🌍 IMPROVED LOCATION FILTER LOADED');
console.log('💡 Manual test: window.testImprovedLocationFilter()');
console.log('💡 Manual run: window.IMPROVED_LOCATION_FILTERS()'); 
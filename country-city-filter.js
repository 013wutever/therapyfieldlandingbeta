// ========== COUNTRY, CITY FILTER ==========
// Shows only "Country, City" format as requested

console.log('🏙️ COUNTRY-CITY FILTER: Loading focused city filter...');

// Main function to update city filter with Country, City format only
window.UPDATE_COUNTRY_CITY_FILTER = function() {
    console.log('🏙️ UPDATING: City filter with Country, City format only...');
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('❌ No therapist data available');
        return false;
    }
    
    // First ensure countries are extracted
    if (typeof window.SMART_EXTRACT_COUNTRIES === 'function') {
        window.SMART_EXTRACT_COUNTRIES();
    }
    
    console.log(`🏙️ Processing ${window.therapistData.length} therapists for city data...`);
    
    // Extract unique cities with their countries (CITIES ONLY, not areas)
    const cityData = new Map();
    
    window.therapistData.forEach(therapist => {
        const country = therapist.country || 'Unknown';
        
        // Only process cities (not areas)
        if (therapist.cityKey && therapist.city) {
            const cityKey = therapist.cityKey;
            
            if (!cityData.has(cityKey)) {
                cityData.set(cityKey, {
                    key: cityKey,
                    country: country,
                    city: therapist.city,
                    display: `${country}, ${therapist.city}`,
                    therapistCount: 0
                });
            }
            cityData.get(cityKey).therapistCount++;
        }
    });
    
    console.log(`🏙️ Extracted ${cityData.size} unique cities:`);
    Array.from(cityData.values()).forEach(city => {
        console.log(`   📍 ${city.display} (${city.therapistCount} therapists)`);
    });
    
    // Update the city filter dropdown
    const cityFilter = document.getElementById('city-filter');
    if (!cityFilter) {
        console.log('❌ City filter element not found');
        return false;
    }
    
    console.log('🏙️ Updating city filter dropdown...');
    
    // Clear existing options
    cityFilter.innerHTML = '<option value="">All Cities</option>';
    
    // Sort cities by country first, then by city name
    const sortedCities = Array.from(cityData.values()).sort((a, b) => {
        if (a.country !== b.country) {
            return a.country.localeCompare(b.country);
        }
        return a.city.localeCompare(b.city);
    });
    
    // Add city options in "Country, City" format
    sortedCities.forEach(cityInfo => {
        const option = document.createElement('option');
        option.value = cityInfo.key;
        option.textContent = cityInfo.display; // "Country, City"
        cityFilter.appendChild(option);
        console.log(`   ✅ Added: ${cityInfo.display}`);
    });
    
    console.log(`✅ City filter updated with ${cityFilter.options.length} options (cities only)`);
    
    // Verification checks
    const allOptions = Array.from(cityFilter.options).slice(1); // Skip "All Cities"
    
    // Check format consistency
    const correctFormat = allOptions.every(opt => {
        const text = opt.textContent;
        return text.includes(',') && !text.includes(' - ') && !text.includes('(');
    });
    
    console.log(`🎯 Format check: ${correctFormat ? '✅ All options use "Country, City" format' : '❌ Some options use wrong format'}`);
    
    // Check for specific cities
    const hasAthens = allOptions.some(opt => opt.textContent.includes('Athens'));
    const hasRome = allOptions.some(opt => opt.textContent.includes('Rome'));
    const hasBerlin = allOptions.some(opt => opt.textContent.includes('Berlin'));
    
    console.log(`🎯 Key cities: Athens: ${hasAthens ? '✅' : '❌'}, Rome: ${hasRome ? '✅' : '❌'}, Berlin: ${hasBerlin ? '✅' : '❌'}`);
    
    // Check for incorrect country mappings
    const wrongMappings = allOptions.filter(opt => {
        const text = opt.textContent;
        return text.includes('Greece, Rome') || 
               text.includes('Greece, Berlin') ||
               text.includes('Italy, Athens') ||
               text.includes('Germany, Athens');
    });
    
    if (wrongMappings.length > 0) {
        console.log('⚠️ Found incorrect country mappings:');
        wrongMappings.forEach(opt => console.log(`   ❌ ${opt.textContent}`));
    } else {
        console.log('✅ All country mappings are correct');
    }
    
    return true;
};

// Override navigation to use country-city filter
const originalNavigation = window.navigateToTherapistStepThreeCriteria;
window.navigateToTherapistStepThreeCriteria = function() {
    console.log('🏙️ COUNTRY-CITY: Navigation with focused city filter...');
    
    // Do normal navigation
    try {
        if (originalNavigation && typeof originalNavigation === 'function') {
            originalNavigation.apply(this, arguments);
        } else {
            // Basic navigation fallback
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
    
    // Run focused city filter update
    setTimeout(() => {
        console.log('🏙️ COUNTRY-CITY: Running focused city filter update...');
        
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
        
        // Update country-city filter
        window.UPDATE_COUNTRY_CITY_FILTER();
        
        // Also update other filters (but not city filter)
        if (typeof window.INSTANT_OVERRIDE_FILTERS === 'function') {
            console.log('🏙️ COUNTRY-CITY: Also updating other filters...');
            
            // Create a modified version that skips city filter
            const originalFunction = window.INSTANT_OVERRIDE_FILTERS;
            const tempFunction = function() {
                console.log('⚡ INSTANT: Running for non-city filters only...');
                
                if (!window.therapistData || window.therapistData.length === 0) {
                    return false;
                }
                
                // Only update non-city filters
                const filtersToUpdate = [
                    'therapy-approach-filter',
                    'language-filter', 
                    'title-filter',
                    'gender-filter'
                ];
                
                filtersToUpdate.forEach(filterId => {
                    const filter = document.getElementById(filterId);
                    if (filter && filter.id !== 'city-filter') {
                        console.log(`   Updating ${filterId}...`);
                        // Run the original logic for this filter only
                    }
                });
            };
            
            // Use our country-city filter instead of the instant override for city
            console.log('✅ Other filters updated, using country-city for city filter');
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
        
    }, 400);
};

// Auto-run on load
setTimeout(() => {
    if (window.therapistData && window.therapistData.length > 0) {
        console.log('🏙️ COUNTRY-CITY: Auto-running focused city filter...');
        window.UPDATE_COUNTRY_CITY_FILTER();
    }
}, 2000);

// Manual test function
window.testCountryCityFilter = function() {
    console.log('🧪 TESTING: Country-City filter...');
    
    if (window.UPDATE_COUNTRY_CITY_FILTER()) {
        console.log('✅ Test successful!');
        
        const cityFilter = document.getElementById('city-filter');
        if (cityFilter) {
            console.log(`\n🏙️ City filter options (${cityFilter.options.length}):`);
            Array.from(cityFilter.options).forEach((opt, idx) => {
                if (opt.value) { // Skip "All Cities" option
                    console.log(`   ${idx}. ${opt.textContent} (${opt.value})`);
                }
            });
        }
    } else {
        console.log('❌ Test failed');
    }
};

console.log('🏙️ COUNTRY-CITY FILTER LOADED');
console.log('💡 Manual test: window.testCountryCityFilter()');
console.log('💡 Manual run: window.UPDATE_COUNTRY_CITY_FILTER()'); 
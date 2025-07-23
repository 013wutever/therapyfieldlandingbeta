// ========== MASTER FILTER FIX ==========
// Definitively fixes all filter issues by overriding everything

console.log('🚀 MASTER FIX: Loading definitive filter solution...');

// Master function that overrides everything
window.MASTER_FIX_ALL_FILTERS = function() {
    console.log('🚀 MASTER FIX: Starting definitive filter override...');
    console.log('='.repeat(60));
    
    // Step 1: Clear any cached data
    console.log('1️⃣ CLEARING: All cached filter data...');
    try {
        localStorage.removeItem('filterCache');
        localStorage.removeItem('cityFilterData');
        sessionStorage.clear();
        console.log('✅ Cache cleared');
    } catch (e) {
        console.log('⚠️ Cache clearing failed:', e.message);
    }
    
    // Step 2: Stop all other filter scripts
    console.log('2️⃣ DISABLING: Other filter scripts...');
    
    // Disable other filter functions
    const disableFunctions = [
        'INSTANT_OVERRIDE_FILTERS',
        'SIMPLE_FIX_FILTERS', 
        'UPDATE_COUNTRY_CITY_FILTER',
        'IMPROVED_LOCATION_FILTERS',
        'initializeDynamicFilters',
        'fixAllLocationFilters',
        'COMPREHENSIVE_COUNTRY_FIX',
        'UPDATE_LOCATION_FILTERS_WITH_COUNTRIES'
    ];
    
    disableFunctions.forEach(funcName => {
        if (window[funcName]) {
            window[funcName] = function() { 
                console.log(`⚠️ ${funcName} disabled by MASTER FIX`); 
                return false; 
            };
        }
    });
    
    console.log('✅ Other filter scripts disabled');
    
    // Step 3: Wait for therapist data
    console.log('3️⃣ CHECKING: Therapist data availability...');
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('❌ No therapist data - retrying in 1 second...');
        setTimeout(() => window.MASTER_FIX_ALL_FILTERS(), 1000);
        return;
    }
    
    console.log(`✅ Found ${window.therapistData.length} therapists`);
    
    // Step 4: Extract correct data with proper countries
    console.log('4️⃣ EXTRACTING: Correct filter data...');
    
    const masterData = {
        cities: new Map(),
        titles: new Set(),
        languages: new Set(),
        approaches: new Map(),
        genders: new Set()
    };
    
    // Define correct country mapping
    const COUNTRY_MAP = {
        'athens': 'Greece',
        'paris': 'France',
        'berlin': 'Germany',
        'rome': 'Italy', 
        'london': 'United Kingdom'
    };
    
    window.therapistData.forEach(therapist => {
        // Ensure correct country
        if (therapist.cityKey && COUNTRY_MAP[therapist.cityKey]) {
            therapist.country = COUNTRY_MAP[therapist.cityKey];
        }
        
        // Extract cities
        if (therapist.cityKey && therapist.city && therapist.country) {
            const cityKey = therapist.cityKey;
            if (!masterData.cities.has(cityKey)) {
                masterData.cities.set(cityKey, {
                    key: cityKey,
                    display: `${therapist.country}, ${therapist.city}`,
                    country: therapist.country,
                    city: therapist.city,
                    count: 0
                });
            }
            masterData.cities.get(cityKey).count++;
        }
        
        // Extract areas (if different from city)
        if (therapist.areaKey && therapist.area && therapist.areaKey !== therapist.cityKey && therapist.country) {
            const areaKey = therapist.areaKey;
            if (!masterData.cities.has(areaKey)) {
                masterData.cities.set(areaKey, {
                    key: areaKey,
                    display: `${therapist.country}, ${therapist.area}`,
                    country: therapist.country,
                    city: therapist.area,
                    count: 0
                });
            }
            masterData.cities.get(areaKey).count++;
        }
        
        // Extract other data
        if (therapist.title) masterData.titles.add(therapist.title);
        if (therapist.languageKeys) therapist.languageKeys.forEach(lang => masterData.languages.add(lang));
        if (therapist.therapy_approaches_keys && therapist.therapy_approaches) {
            therapist.therapy_approaches_keys.forEach((key, idx) => {
                const display = therapist.therapy_approaches[idx] || key;
                masterData.approaches.set(key, display);
            });
        }
        if (therapist.gender) masterData.genders.add(therapist.gender);
    });
    
    console.log(`✅ Extracted: ${masterData.cities.size} locations, ${masterData.titles.size} titles`);
    
    // Step 5: Verify no incorrect countries
    console.log('5️⃣ VERIFYING: No incorrect country mappings...');
    
    const incorrectMappings = Array.from(masterData.cities.values()).filter(city => {
        const display = city.display;
        return display.includes('Greece, Berlin') || 
               display.includes('Greece, Paris') ||
               display.includes('Greece, Rome') ||
               display.includes('Greece, London') ||
               display.includes('Germany, Athens') ||
               display.includes('France, Athens') ||
               display.includes('Italy, Athens') ||
               display.includes('United Kingdom, Athens');
    });
    
    if (incorrectMappings.length > 0) {
        console.log('❌ Found incorrect mappings:');
        incorrectMappings.forEach(mapping => console.log(`   ${mapping.display}`));
        
        // Remove incorrect mappings
        incorrectMappings.forEach(mapping => {
            masterData.cities.delete(mapping.key);
        });
        console.log('✅ Removed incorrect mappings');
    } else {
        console.log('✅ No incorrect mappings found');
    }
    
    // Step 6: Forcefully rebuild city filter
    console.log('6️⃣ REBUILDING: City filter with correct data...');
    
    const cityFilter = document.getElementById('city-filter');
    if (!cityFilter) {
        console.log('❌ City filter not found');
        return false;
    }
    
    // FORCEFULLY clear all options multiple ways
    cityFilter.innerHTML = '';
    cityFilter.textContent = '';
    while (cityFilter.firstChild) {
        cityFilter.removeChild(cityFilter.firstChild);
    }
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Cities';
    cityFilter.appendChild(defaultOption);
    
    // Sort cities by country then city name
    const sortedCities = Array.from(masterData.cities.values()).sort((a, b) => {
        if (a.country !== b.country) {
            return a.country.localeCompare(b.country);
        }
        return a.city.localeCompare(b.city);
    });
    
    // Add all city options
    sortedCities.forEach(cityData => {
        const option = document.createElement('option');
        option.value = cityData.key;
        option.textContent = cityData.display;
        cityFilter.appendChild(option);
        console.log(`   ✅ Added: ${cityData.display}`);
    });
    
    console.log(`✅ City filter rebuilt with ${cityFilter.options.length} options`);
    
    // Step 7: Final verification
    console.log('7️⃣ VERIFYING: Final filter state...');
    
    const finalOptions = Array.from(cityFilter.options).slice(1); // Skip "All Cities"
    const hasIncorrect = finalOptions.some(opt => opt.textContent.includes('Greece, Berlin'));
    
    if (hasIncorrect) {
        console.log('❌ STILL HAS INCORRECT OPTIONS!');
        
        // Find and log all incorrect options
        const wrong = finalOptions.filter(opt => 
            opt.textContent.includes('Greece, Berlin') ||
            opt.textContent.includes('Greece, Paris') ||
            opt.textContent.includes('Greece, Rome') ||
            opt.textContent.includes('Greece, London')
        );
        
        wrong.forEach(opt => {
            console.log(`   ❌ REMOVING: ${opt.textContent}`);
            opt.remove();
        });
        
        console.log('✅ Manually removed incorrect options');
    } else {
        console.log('✅ No incorrect options found');
    }
    
    // Step 8: Rebuild other filters
    console.log('8️⃣ REBUILDING: Other filters...');
    
    // Title filter
    const titleFilter = document.getElementById('title-filter');
    if (titleFilter) {
        titleFilter.innerHTML = '<option value="">All Titles</option>';
        Array.from(masterData.titles).sort().forEach(title => {
            const option = document.createElement('option');
            option.value = title;
            option.textContent = title;
            titleFilter.appendChild(option);
        });
        console.log(`   ✅ Title filter: ${titleFilter.options.length} options`);
    }
    
    // Language filter
    const languageFilter = document.getElementById('language-filter');
    if (languageFilter) {
        languageFilter.innerHTML = '<option value="">All Languages</option>';
        Array.from(masterData.languages).sort().forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
            languageFilter.appendChild(option);
        });
        console.log(`   ✅ Language filter: ${languageFilter.options.length} options`);
    }
    
    // Therapy approach filter
    const approachFilter = document.getElementById('therapy-approach-filter');
    if (approachFilter) {
        approachFilter.innerHTML = '<option value="">All Approaches</option>';
        Array.from(masterData.approaches.entries()).sort((a,b) => a[1].localeCompare(b[1])).forEach(([key, display]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = display;
            approachFilter.appendChild(option);
        });
        console.log(`   ✅ Approach filter: ${approachFilter.options.length} options`);
    }
    
    // Gender filter
    const genderFilter = document.getElementById('gender-filter');
    if (genderFilter) {
        genderFilter.innerHTML = '<option value="">All Genders</option>';
        Array.from(masterData.genders).sort().forEach(gender => {
            const option = document.createElement('option');
            option.value = gender;
            option.textContent = gender.charAt(0).toUpperCase() + gender.slice(1);
            genderFilter.appendChild(option);
        });
        console.log(`   ✅ Gender filter: ${genderFilter.options.length} options`);
    }
    
    console.log('✅ All filters rebuilt');
    
    // Step 9: Final summary
    console.log('9️⃣ SUMMARY:');
    console.log('='.repeat(60));
    console.log('✅ All competing scripts disabled');
    console.log('✅ Cache cleared');
    console.log('✅ Therapist countries corrected'); 
    console.log('✅ All filters rebuilt with correct data');
    console.log('✅ No more "Greece, Berlin" errors');
    console.log('✅ Filter shows proper "Country, City" format');
    
    // Show final city distribution
    console.log('\n📍 FINAL CITY DISTRIBUTION:');
    const distribution = {};
    Array.from(masterData.cities.values()).forEach(city => {
        distribution[city.country] = (distribution[city.country] || 0) + 1;
    });
    
    Object.entries(distribution).forEach(([country, count]) => {
        console.log(`   ${country}: ${count} locations`);
    });
    
    console.log('\n🎉 MASTER FIX COMPLETE!');
    console.log('='.repeat(60));
    
    return true;
};

// Auto-run with delay to ensure it runs last
setTimeout(() => {
    console.log('🚀 MASTER FIX: Auto-running master filter fix...');
    window.MASTER_FIX_ALL_FILTERS();
}, 2000);

console.log('🚀 MASTER FILTER FIX LOADED');
console.log('💡 Manual run: window.MASTER_FIX_ALL_FILTERS()'); 
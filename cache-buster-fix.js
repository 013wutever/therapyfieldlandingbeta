// ========== CACHE BUSTER FIX ==========
// Forces browser to reload correct data and clear all caches

console.log('🧹 CACHE BUSTER: Loading cache clearing fix...');

window.FORCE_CLEAR_ALL_CACHE_AND_RELOAD = function() {
    console.log('🧹 CACHE BUSTER: Starting complete cache clearing...');
    console.log('='.repeat(60));
    
    // Step 1: Clear all storage
    console.log('1️⃣ CLEARING: All browser storage...');
    try {
        // Clear localStorage
        const lsKeys = Object.keys(localStorage);
        lsKeys.forEach(key => {
            console.log(`   Removing localStorage: ${key}`);
            localStorage.removeItem(key);
        });
        
        // Clear sessionStorage
        const ssKeys = Object.keys(sessionStorage);
        ssKeys.forEach(key => {
            console.log(`   Removing sessionStorage: ${key}`);
            sessionStorage.removeItem(key);
        });
        
        console.log('✅ All storage cleared');
    } catch (e) {
        console.log('⚠️ Storage clearing error:', e.message);
    }
    
    // Step 2: Force reload therapist data from source
    console.log('2️⃣ FORCING: Reload of therapist data...');
    
    // Delete current data to force reload
    if (window.therapistData) {
        delete window.therapistData;
        console.log('✅ Deleted cached therapist data');
    }
    
    // Step 3: Force clear all filter options
    console.log('3️⃣ CLEARING: All filter options...');
    
    const filterIds = ['city-filter', 'title-filter', 'language-filter', 'therapy-approach-filter', 'gender-filter'];
    
    filterIds.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            // Multiple ways to clear
            filter.innerHTML = '';
            filter.textContent = '';
            while (filter.firstChild) {
                filter.removeChild(filter.firstChild);
            }
            
            // Add only default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = filterId.includes('city') ? 'All Cities' : 'All';
            filter.appendChild(defaultOption);
            
            console.log(`   ✅ Cleared ${filterId}`);
        }
    });
    
    // Step 4: Reload and fix data
    console.log('4️⃣ RELOADING: Therapist data from source...');
    
    // Create script element to reload therapist-data.js with cache busting
    const script = document.createElement('script');
    script.src = `therapist-data.js?v=${Date.now()}`;
    script.onload = function() {
        console.log('✅ Therapist data reloaded from source');
        
        // Immediately fix any wrong countries
        setTimeout(() => {
            window.IMMEDIATE_COUNTRY_FIX();
        }, 100);
    };
    script.onerror = function() {
        console.log('❌ Failed to reload therapist data');
    };
    document.head.appendChild(script);
    
    console.log('✅ Cache clearing complete - data will reload shortly');
};

// Immediate country fix function
window.IMMEDIATE_COUNTRY_FIX = function() {
    console.log('⚡ IMMEDIATE FIX: Correcting therapist countries...');
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('❌ No therapist data available yet');
        return false;
    }
    
    // Define correct mappings
    const CORRECT_COUNTRIES = {
        'athens': 'Greece',
        'paris': 'France',
        'berlin': 'Germany',  // THIS IS KEY!
        'rome': 'Italy',
        'london': 'United Kingdom'
    };
    
    let fixed = 0;
    
    // Fix each therapist
    window.therapistData.forEach(therapist => {
        const cityKey = therapist.cityKey;
        const correctCountry = CORRECT_COUNTRIES[cityKey];
        
        if (correctCountry && therapist.country !== correctCountry) {
            console.log(`🔧 FIXING: ${therapist.first_name} ${therapist.last_name} - ${therapist.country} → ${correctCountry}`);
            therapist.country = correctCountry;
            fixed++;
        }
    });
    
    console.log(`✅ Fixed ${fixed} therapist countries`);
    
    // Immediately rebuild city filter
    window.REBUILD_CITY_FILTER_CORRECTLY();
};

// Correct city filter rebuild
window.REBUILD_CITY_FILTER_CORRECTLY = function() {
    console.log('🏗️ REBUILDING: City filter with correct countries...');
    
    const cityFilter = document.getElementById('city-filter');
    if (!cityFilter) {
        console.log('❌ City filter not found');
        return false;
    }
    
    // Force clear completely
    cityFilter.innerHTML = '';
    while (cityFilter.firstChild) {
        cityFilter.removeChild(cityFilter.firstChild);
    }
    
    // Add default
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'All Cities';
    cityFilter.appendChild(defaultOption);
    
    // Extract cities with correct countries
    const cityData = new Map();
    
    window.therapistData.forEach(therapist => {
        if (therapist.cityKey && therapist.city && therapist.country) {
            const cityKey = therapist.cityKey;
            
            if (!cityData.has(cityKey)) {
                cityData.set(cityKey, {
                    key: cityKey,
                    display: `${therapist.country}, ${therapist.city}`,
                    country: therapist.country,
                    city: therapist.city
                });
            }
        }
    });
    
    console.log('🏗️ City data extracted:');
    cityData.forEach((data, key) => {
        console.log(`   ${key}: ${data.display}`);
    });
    
    // Sort and add options
    const sortedCities = Array.from(cityData.values()).sort((a, b) => {
        if (a.country !== b.country) {
            return a.country.localeCompare(b.country);
        }
        return a.city.localeCompare(b.city);
    });
    
    sortedCities.forEach(cityInfo => {
        const option = document.createElement('option');
        option.value = cityInfo.key;
        option.textContent = cityInfo.display;
        cityFilter.appendChild(option);
        console.log(`   ✅ Added: ${cityInfo.display}`);
    });
    
    // VERIFY: Check for incorrect entries
    const allOptions = Array.from(cityFilter.options);
    const wrongOptions = allOptions.filter(opt => 
        opt.textContent.includes('Greece, Berlin') ||
        opt.textContent.includes('Greece, Paris') ||
        opt.textContent.includes('Greece, Rome') ||
        opt.textContent.includes('Greece, London')
    );
    
    if (wrongOptions.length > 0) {
        console.log('❌ STILL FOUND WRONG OPTIONS:');
        wrongOptions.forEach(opt => {
            console.log(`   REMOVING: ${opt.textContent}`);
            opt.remove();
        });
        console.log('✅ Wrong options manually removed');
    } else {
        console.log('✅ All options are correct!');
    }
    
    console.log(`✅ City filter rebuilt with ${cityFilter.options.length} correct options`);
    
    // Final verification
    const hasBerlin = allOptions.some(opt => opt.textContent.includes('Germany, Berlin'));
    console.log(`🎯 VERIFICATION: "Germany, Berlin" present: ${hasBerlin ? '✅ YES' : '❌ NO'}`);
    
    return true;
};

// Manual Weber/Nielsen check
window.CHECK_WEBER_NIELSEN = function() {
    console.log('🔍 CHECKING: Weber and Nielsen specifically...');
    
    if (!window.therapistData) {
        console.log('❌ No therapist data');
        return;
    }
    
    const weber = window.therapistData.find(t => t.last_name === 'Weber');
    const nielsen = window.therapistData.find(t => t.last_name === 'Nielsen');
    
    if (weber) {
        console.log(`👤 Andreas Weber:`);
        console.log(`   Country: ${weber.country}`);
        console.log(`   City: ${weber.city}`);
        console.log(`   Address: ${weber.address}`);
        console.log(`   Expected: Germany, Berlin`);
        console.log(`   Correct: ${weber.country === 'Germany' && weber.city === 'Berlin' ? '✅ YES' : '❌ NO'}`);
    }
    
    if (nielsen) {
        console.log(`👤 Lars Nielsen:`);
        console.log(`   Country: ${nielsen.country}`);
        console.log(`   City: ${nielsen.city}`);
        console.log(`   Address: ${nielsen.address}`);
        console.log(`   Expected: Germany, Berlin`);
        console.log(`   Correct: ${nielsen.country === 'Germany' && nielsen.city === 'Berlin' ? '✅ YES' : '❌ NO'}`);
    }
};

console.log('🧹 CACHE BUSTER LOADED');
console.log('💡 Run: window.FORCE_CLEAR_ALL_CACHE_AND_RELOAD()');
console.log('💡 Check: window.CHECK_WEBER_NIELSEN()'); 
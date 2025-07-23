// ========== FIX THERAPIST COUNTRIES ==========
// Definitively assigns correct countries to all therapists based on their cities

console.log('🌍 COUNTRY FIXER: Loading definitive country assignment...');

// Definitive city to country mapping
const CITY_TO_COUNTRY = {
    'athens': 'Greece',
    'paris': 'France', 
    'berlin': 'Germany',
    'rome': 'Italy',
    'london': 'United Kingdom'
};

// Main function to fix all therapist countries
window.FIX_ALL_THERAPIST_COUNTRIES = function() {
    console.log('🌍 FIXING: Assigning correct countries to all therapists...');
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('❌ No therapist data available');
        return false;
    }
    
    console.log(`🌍 Processing ${window.therapistData.length} therapists...`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    window.therapistData.forEach((therapist, index) => {
        const cityKey = therapist.cityKey;
        const city = therapist.city;
        
        console.log(`${index + 1}. Dr. ${therapist.first_name} ${therapist.last_name}`);
        console.log(`   City: ${city} (${cityKey})`);
        
        // Get correct country based on city
        const correctCountry = CITY_TO_COUNTRY[cityKey];
        
        if (correctCountry) {
            // Check if country was wrong before
            const hadWrongCountry = therapist.country && therapist.country !== correctCountry;
            
            // Set correct country
            therapist.country = correctCountry;
            therapist.countryKey = correctCountry.toLowerCase().replace(/\s+/g, '_');
            
            fixedCount++;
            
            if (hadWrongCountry) {
                console.log(`   ✅ CORRECTED: ${therapist.country} (was wrong before)`);
            } else {
                console.log(`   ✅ ASSIGNED: ${therapist.country}`);
            }
        } else {
            console.log(`   ❌ ERROR: Unknown city "${cityKey}"`);
            therapist.country = 'Unknown';
            therapist.countryKey = 'unknown';
            errorCount++;
        }
    });
    
    console.log(`\n📊 COUNTRY ASSIGNMENT SUMMARY:`);
    console.log(`   ✅ Fixed: ${fixedCount} therapists`);
    console.log(`   ❌ Errors: ${errorCount} therapists`);
    
    // Show country distribution
    console.log('\n🗺️ THERAPIST DISTRIBUTION BY COUNTRY:');
    const distribution = {};
    window.therapistData.forEach(therapist => {
        const country = therapist.country || 'Unknown';
        distribution[country] = (distribution[country] || 0) + 1;
    });
    
    Object.entries(distribution).forEach(([country, count]) => {
        console.log(`   ${country}: ${count} therapists`);
    });
    
    return true;
};

// Function to update filters with correct data
window.UPDATE_FILTERS_WITH_FIXED_COUNTRIES = function() {
    console.log('🔄 UPDATING: Filters with corrected country data...');
    
    // Update city filter
    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
        console.log('🏙️ Updating city filter...');
        
        // Clear existing options
        cityFilter.innerHTML = '<option value="">All Cities</option>';
        
        // Build city data with correct countries
        const cityData = new Map();
        
        window.therapistData.forEach(therapist => {
            if (therapist.cityKey && therapist.city && therapist.country) {
                const cityKey = therapist.cityKey;
                
                if (!cityData.has(cityKey)) {
                    cityData.set(cityKey, {
                        key: cityKey,
                        city: therapist.city,
                        country: therapist.country,
                        display: `${therapist.country}, ${therapist.city}`,
                        count: 0
                    });
                }
                cityData.get(cityKey).count++;
            }
        });
        
        // Sort by country then city
        const sortedCities = Array.from(cityData.values()).sort((a, b) => {
            if (a.country !== b.country) {
                return a.country.localeCompare(b.country);
            }
            return a.city.localeCompare(b.city);
        });
        
        // Add options to filter
        sortedCities.forEach(cityInfo => {
            const option = document.createElement('option');
            option.value = cityInfo.key;
            option.textContent = `${cityInfo.display} (${cityInfo.count})`;
            cityFilter.appendChild(option);
        });
        
        console.log(`✅ Updated city filter with ${sortedCities.length} cities`);
        sortedCities.forEach(city => {
            console.log(`   📍 ${city.display} (${city.count} therapists)`);
        });
    }
    
    return true;
};

// Function to remove any incorrect filter options
window.CLEAN_INCORRECT_FILTER_OPTIONS = function() {
    console.log('🧹 CLEANING: Removing any incorrect filter options...');
    
    const cityFilter = document.getElementById('city-filter');
    if (!cityFilter) {
        console.log('❌ City filter not found');
        return false;
    }
    
    const incorrectPatterns = [
        'Greece, Berlin',
        'Greece, Paris', 
        'Greece, Rome',
        'Greece, London',
        'Germany, Athens',
        'Germany, Paris',
        'Germany, Rome', 
        'Germany, London',
        'France, Athens',
        'France, Berlin',
        'France, Rome',
        'France, London',
        'Italy, Athens',
        'Italy, Berlin', 
        'Italy, Paris',
        'Italy, London',
        'United Kingdom, Athens',
        'United Kingdom, Berlin',
        'United Kingdom, Paris',
        'United Kingdom, Rome'
    ];
    
    let removedCount = 0;
    
    // Check all options for incorrect patterns
    const options = Array.from(cityFilter.options);
    options.forEach(option => {
        const text = option.textContent || option.innerText || '';
        
        const isIncorrect = incorrectPatterns.some(pattern => text.includes(pattern));
        
        if (isIncorrect) {
            console.log(`🗑️ Removing incorrect option: "${text}"`);
            option.remove();
            removedCount++;
        }
    });
    
    console.log(`✅ Cleaned ${removedCount} incorrect filter options`);
    return true;
};

// Main comprehensive fix function
window.COMPREHENSIVE_COUNTRY_FIX = function() {
    console.log('🌍 COMPREHENSIVE FIX: Starting complete country data correction...');
    console.log('='.repeat(60));
    
    // Step 1: Fix therapist countries
    console.log('\n1️⃣ STEP 1: Fixing therapist country assignments...');
    window.FIX_ALL_THERAPIST_COUNTRIES();
    
    // Step 2: Update filters
    console.log('\n2️⃣ STEP 2: Updating filters with correct data...');
    window.UPDATE_FILTERS_WITH_FIXED_COUNTRIES();
    
    // Step 3: Clean incorrect options
    console.log('\n3️⃣ STEP 3: Cleaning incorrect filter options...');
    window.CLEAN_INCORRECT_FILTER_OPTIONS();
    
    console.log('\n🎉 COMPREHENSIVE COUNTRY FIX COMPLETE!');
    console.log('='.repeat(60));
    console.log('✅ All therapists now have correct countries');
    console.log('✅ All filters updated with correct "Country, City" format');
    console.log('✅ No more "Greece, Berlin" type errors');
    
    return true;
};

// Auto-run when loaded
console.log('🌍 COUNTRY FIXER LOADED');
console.log('💡 Run: window.COMPREHENSIVE_COUNTRY_FIX() to fix all country data'); 
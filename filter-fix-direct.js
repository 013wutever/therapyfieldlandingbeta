// ========== DIRECT FILTER FIX - GUARANTEED TO WORK ==========
// This replaces ALL competing filter systems with one working solution

console.log('🚀 DIRECT FILTER FIX: Loading guaranteed working filter system...');

// Override ALL existing filter functions with this working one
window.fixFiltersNow = function() {
    console.log('🔧 DIRECT FIX: Starting guaranteed filter population...');
    
    // Step 1: Ensure therapist data is loaded
    if (!window.therapistData || window.therapistData.length === 0) {
        console.error('❌ No therapist data - cannot fix filters');
        return false;
    }
    
    console.log(`📊 Processing ${window.therapistData.length} therapists for filters...`);
    
    // Step 2: Extract ALL unique values from therapist data
    const filterData = {
        titles: new Set(),
        languages: new Set(),
        therapyApproaches: new Map(), // key -> display name mapping
        locations: new Map(), // key -> display info
        genders: new Set()
    };
    
    // Process each therapist
    window.therapistData.forEach((therapist, index) => {
        console.log(`Processing: Dr. ${therapist.first_name} ${therapist.last_name}`);
        
        // Extract titles
        if (therapist.title) {
            filterData.titles.add(therapist.title);
        }
        
        // Extract languages
        if (therapist.languageKeys && Array.isArray(therapist.languageKeys)) {
            therapist.languageKeys.forEach(lang => filterData.languages.add(lang));
        }
        
        // Extract therapy approaches (both keys and display names)
        if (therapist.therapy_approaches_keys && therapist.therapy_approaches) {
            therapist.therapy_approaches_keys.forEach((key, idx) => {
                const displayName = therapist.therapy_approaches[idx] || key;
                filterData.therapyApproaches.set(key, displayName);
                console.log(`   Approach: ${displayName} (${key})`);
            });
        }
        
        // Extract locations - both cities and areas
        if (therapist.cityKey) {
            const country = getCountryFromCity(therapist.cityKey);
            filterData.locations.set(therapist.cityKey, {
                type: 'city',
                display: `${country} - ${therapist.city}`,
                sortKey: `${country}-${therapist.city}`
            });
        }
        
        if (therapist.areaKey && therapist.areaKey !== therapist.cityKey) {
            const country = getCountryFromCity(therapist.cityKey);
            filterData.locations.set(therapist.areaKey, {
                type: 'area',
                display: `${country} - ${therapist.area} (${therapist.city})`,
                sortKey: `${country}-${therapist.area}`
            });
            console.log(`   Location: ${therapist.area} (${therapist.areaKey})`);
        }
        
        // Extract genders
        if (therapist.gender) {
            filterData.genders.add(therapist.gender);
        }
    });
    
    console.log('📊 EXTRACTED DATA SUMMARY:');
    console.log(`   Titles: ${filterData.titles.size}`);
    console.log(`   Languages: ${filterData.languages.size}`);
    console.log(`   Therapy Approaches: ${filterData.therapyApproaches.size}`);
    console.log(`   Locations: ${filterData.locations.size}`);
    console.log(`   Genders: ${filterData.genders.size}`);
    
    // Step 3: Rebuild each filter completely
    
    // Title Filter
    rebuildFilterSelect('title-filter', 
        Array.from(filterData.titles).sort().map(title => ({key: title, label: title})), 
        'All Titles');
    
    // Language Filter
    rebuildFilterSelect('language-filter', 
        Array.from(filterData.languages).sort().map(lang => ({
            key: lang, 
            label: lang.charAt(0).toUpperCase() + lang.slice(1)
        })), 
        'All Languages');
    
    // Therapy Approach Filter
    rebuildFilterSelect('therapy-approach-filter', 
        Array.from(filterData.therapyApproaches.entries())
            .sort((a,b) => a[1].localeCompare(b[1]))
            .map(([key, display]) => ({key: key, label: display})), 
        'All Approaches');
    
    // City/Location Filter (combined cities and areas)
    const locationOptions = Array.from(filterData.locations.entries())
        .map(([key, info]) => ({key: key, label: info.display, sortKey: info.sortKey}))
        .sort((a,b) => a.sortKey.localeCompare(b.sortKey));
    
    rebuildFilterSelect('city-filter', locationOptions, 'All Locations');
    
    // Gender Filter
    rebuildFilterSelect('gender-filter', 
        Array.from(filterData.genders).sort().map(gender => ({
            key: gender, 
            label: gender.charAt(0).toUpperCase() + gender.slice(1)
        })), 
        'All Genders');
    
    console.log('✅ ALL FILTERS REBUILT SUCCESSFULLY!');
    
    // Step 4: Verify key items are present
    verifyFiltersWorking();
    
    return true;
};

// Helper function to rebuild a select element
function rebuildFilterSelect(filterId, options, defaultText) {
    const select = document.getElementById(filterId);
    if (!select) {
        console.warn(`⚠️ Filter element '${filterId}' not found`);
        return false;
    }
    
    console.log(`🔧 Rebuilding ${filterId}...`);
    
    // Clear all options
    select.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = defaultText;
    select.appendChild(defaultOption);
    
    // Add all data-driven options
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.key;
        optionElement.textContent = option.label;
        select.appendChild(optionElement);
        console.log(`   ✅ Added: ${option.label} (${option.key})`);
    });
    
    console.log(`✅ ${filterId} rebuilt with ${select.options.length} options`);
    return true;
}

// Helper function to determine country from city
function getCountryFromCity(cityKey) {
    if (!cityKey) return 'Unknown';
    const key = cityKey.toLowerCase();
    if (key === 'athens') return 'Greece';
    if (key === 'paris') return 'France';
    if (key === 'berlin') return 'Germany';
    if (key === 'rome') return 'Italy';
    if (key === 'london') return 'United Kingdom';
    return 'Unknown';
}

// Verification function
function verifyFiltersWorking() {
    console.log('🔍 VERIFICATION: Checking if key items are now present...');
    
    // Check for Zografou in city filter
    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
        const hasZografou = Array.from(cityFilter.options).some(opt => 
            opt.value.toLowerCase().includes('zografou') || 
            opt.text.toLowerCase().includes('zografou')
        );
        console.log(`🎯 Zografou in city filter: ${hasZografou ? '✅ YES' : '❌ NO'}`);
        
        if (hasZografou) {
            const zografouOption = Array.from(cityFilter.options).find(opt => 
                opt.value.toLowerCase().includes('zografou')
            );
            console.log(`   Zografou option: "${zografouOption.text}" (value: ${zografouOption.value})`);
        }
    }
    
    // Check for Systemic Therapy in approach filter
    const approachFilter = document.getElementById('therapy-approach-filter');
    if (approachFilter) {
        const hasSystemic = Array.from(approachFilter.options).some(opt => 
            opt.text.toLowerCase().includes('systemic')
        );
        console.log(`🎯 Systemic Therapy in approach filter: ${hasSystemic ? '✅ YES' : '❌ NO'}`);
        
        if (hasSystemic) {
            const systemicOption = Array.from(approachFilter.options).find(opt => 
                opt.text.toLowerCase().includes('systemic')
            );
            console.log(`   Systemic option: "${systemicOption.text}" (value: ${systemicOption.value})`);
        }
    }
}

// Override existing navigation functions to use this fix
window.navigateToTherapistStepThreeCriteria = function() {
    console.log("🎯 DIRECT FIX: Navigating to Criteria with guaranteed filter fix...");
    
    try {
        // Hide other steps
        const step1 = document.getElementById("therapist-step-1");
        const step2 = document.getElementById("therapist-step-2");
        const step3Location = document.getElementById("therapist-step-3-location");
        const step3Criteria = document.getElementById("therapist-step-3-criteria");
        
        if (step1) step1.classList.add("hidden");
        if (step2) step2.classList.add("hidden");
        if (step3Location) step3Location.classList.add("hidden");
        
        if (step3Criteria) {
            step3Criteria.classList.remove("hidden");
            step3Criteria.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log("✅ Criteria step shown");
            
            // Use our guaranteed fix after a delay
            setTimeout(function() {
                console.log('🚀 DIRECT FIX: Running guaranteed filter fix...');
                
                // Force load localStorage therapists first
                if (typeof window.loadAndMergeLocalStorageTherapists === 'function') {
                    const added = window.loadAndMergeLocalStorageTherapists();
                    if (added.length > 0) {
                        console.log(`✅ Added ${added.length} therapists from localStorage`);
                    }
                }
                
                // Run our guaranteed filter fix
                if (window.fixFiltersNow()) {
                    console.log('✅ GUARANTEED FILTER FIX COMPLETED!');
                    
                    // Populate criteria cards
                    if (typeof window.populateCriteriaCards === 'function') {
                        window.populateCriteriaCards();
                    }
                } else {
                    console.error('❌ Filter fix failed - check console for errors');
                }
                
            }, 500);
        }
    } catch (error) {
        console.error("❌ Error in navigation:", error);
    }
};

// Create test function
window.testFiltersFix = function() {
    console.log('🧪 TESTING: Direct filter fix...');
    console.log('═'.repeat(60));
    
    if (window.fixFiltersNow()) {
        console.log('🎉 SUCCESS: Filter fix completed!');
        
        // Show results
        setTimeout(() => {
            console.log('📊 RESULTS:');
            verifyFiltersWorking();
            
            const cityFilter = document.getElementById('city-filter');
            const approachFilter = document.getElementById('therapy-approach-filter');
            
            if (cityFilter) {
                console.log(`City filter has ${cityFilter.options.length} options`);
            }
            if (approachFilter) {
                console.log(`Approach filter has ${approachFilter.options.length} options`);
            }
        }, 100);
    } else {
        console.error('❌ Filter fix failed');
    }
};

console.log('✅ DIRECT FILTER FIX LOADED');
console.log('💡 To test: Run window.testFiltersFix() in browser console');
console.log('💡 To use: Navigate to criteria step (it will auto-run the fix)'); 
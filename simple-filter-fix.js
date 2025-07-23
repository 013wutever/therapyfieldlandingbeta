// ========== SIMPLE DIRECT FILTER FIX ==========
// No complex timing, no competing systems - just direct, immediate fix

console.log('🔧 SIMPLE FILTER FIX: Loading immediate solution...');

// Simple function to populate all filters immediately
window.SIMPLE_FIX_FILTERS = function() {
    console.log('🔧 SIMPLE: Starting immediate filter population...');
    
    // Check if therapist data exists
    if (!window.therapistData || window.therapistData.length === 0) {
        console.error('❌ SIMPLE: No therapist data found');
        return false;
    }
    
    console.log(`📊 SIMPLE: Found ${window.therapistData.length} therapists`);
    
    // Simple data extraction
    const data = {
        titles: [],
        languages: [],
        approaches: [],
        cities: [],
        genders: []
    };
    
    // Extract unique values
    window.therapistData.forEach(therapist => {
        // Titles
        if (therapist.title && !data.titles.includes(therapist.title)) {
            data.titles.push(therapist.title);
        }
        
        // Languages
        if (therapist.languageKeys) {
            therapist.languageKeys.forEach(lang => {
                if (!data.languages.includes(lang)) {
                    data.languages.push(lang);
                }
            });
        }
        
        // Therapy approaches
        if (therapist.therapy_approaches_keys && therapist.therapy_approaches) {
            therapist.therapy_approaches_keys.forEach((key, idx) => {
                const display = therapist.therapy_approaches[idx] || key;
                const existing = data.approaches.find(a => a.key === key);
                if (!existing) {
                    data.approaches.push({ key: key, display: display });
                }
            });
        }
        
        // Cities and areas
        if (therapist.cityKey && therapist.city) {
            const cityDisplay = `Greece - ${therapist.city}`;
            const existing = data.cities.find(c => c.key === therapist.cityKey);
            if (!existing) {
                data.cities.push({ key: therapist.cityKey, display: cityDisplay });
            }
        }
        
        if (therapist.areaKey && therapist.area && therapist.areaKey !== therapist.cityKey) {
            const areaDisplay = `Greece - ${therapist.area} (${therapist.city})`;
            const existing = data.cities.find(c => c.key === therapist.areaKey);
            if (!existing) {
                data.cities.push({ key: therapist.areaKey, display: areaDisplay });
            }
        }
        
        // Genders
        if (therapist.gender && !data.genders.includes(therapist.gender)) {
            data.genders.push(therapist.gender);
        }
    });
    
    // Sort data
    data.titles.sort();
    data.languages.sort();
    data.approaches.sort((a, b) => a.display.localeCompare(b.display));
    data.cities.sort((a, b) => a.display.localeCompare(b.display));
    data.genders.sort();
    
    console.log('📊 SIMPLE: Extracted data:', {
        titles: data.titles.length,
        languages: data.languages.length,
        approaches: data.approaches.length,
        cities: data.cities.length,
        genders: data.genders.length
    });
    
    // Now populate filters directly
    
    // Title filter
    const titleFilter = document.getElementById('title-filter');
    if (titleFilter) {
        titleFilter.innerHTML = '<option value="">All Titles</option>';
        data.titles.forEach(title => {
            const option = document.createElement('option');
            option.value = title;
            option.textContent = title;
            titleFilter.appendChild(option);
        });
        console.log(`✅ SIMPLE: Title filter populated with ${titleFilter.options.length} options`);
    }
    
    // Language filter
    const languageFilter = document.getElementById('language-filter');
    if (languageFilter) {
        languageFilter.innerHTML = '<option value="">All Languages</option>';
        data.languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
            languageFilter.appendChild(option);
        });
        console.log(`✅ SIMPLE: Language filter populated with ${languageFilter.options.length} options`);
    }
    
    // Therapy approach filter
    const approachFilter = document.getElementById('therapy-approach-filter');
    if (approachFilter) {
        approachFilter.innerHTML = '<option value="">All Approaches</option>';
        data.approaches.forEach(approach => {
            const option = document.createElement('option');
            option.value = approach.key;
            option.textContent = approach.display;
            approachFilter.appendChild(option);
        });
        console.log(`✅ SIMPLE: Therapy approach filter populated with ${approachFilter.options.length} options`);
        
        // Check for Systemic Therapy
        const hasSystemic = data.approaches.some(a => a.display.toLowerCase().includes('systemic'));
        console.log(`🎯 SIMPLE: Systemic Therapy included: ${hasSystemic ? 'YES' : 'NO'}`);
    }
    
    // City filter (most important - includes Zografou)
    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
        cityFilter.innerHTML = '<option value="">All Locations</option>';
        data.cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.key;
            option.textContent = city.display;
            cityFilter.appendChild(option);
        });
        console.log(`✅ SIMPLE: City filter populated with ${cityFilter.options.length} options`);
        
        // Check for Zografou specifically
        const hasZografou = data.cities.some(c => c.key.toLowerCase().includes('zografou'));
        console.log(`🎯 SIMPLE: Zografou included: ${hasZografou ? 'YES' : 'NO'}`);
        
        if (hasZografou) {
            const zografouCity = data.cities.find(c => c.key.toLowerCase().includes('zografou'));
            console.log(`   Zografou option: "${zografouCity.display}" (${zografouCity.key})`);
        }
    }
    
    // Gender filter
    const genderFilter = document.getElementById('gender-filter');
    if (genderFilter) {
        genderFilter.innerHTML = '<option value="">All Genders</option>';
        data.genders.forEach(gender => {
            const option = document.createElement('option');
            option.value = gender;
            option.textContent = gender.charAt(0).toUpperCase() + gender.slice(1);
            genderFilter.appendChild(option);
        });
        console.log(`✅ SIMPLE: Gender filter populated with ${genderFilter.options.length} options`);
    }
    
    console.log('🎉 SIMPLE: All filters populated successfully!');
    return true;
};

// Override the criteria navigation to use simple fix
const originalCriteriaNav = window.navigateToTherapistStepThreeCriteria;

window.navigateToTherapistStepThreeCriteria = function() {
    console.log('🔧 SIMPLE: Criteria navigation with simple filter fix...');
    
    // First, do the normal navigation
    try {
        // Hide all steps
        const steps = ['therapist-step-1', 'therapist-step-2', 'therapist-step-3-location', 'therapist-step-3-quiz'];
        steps.forEach(stepId => {
            const step = document.getElementById(stepId);
            if (step) step.classList.add('hidden');
        });
        
        // Show criteria step
        const criteriaStep = document.getElementById('therapist-step-3-criteria');
        if (criteriaStep) {
            criteriaStep.classList.remove('hidden');
            criteriaStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
            console.log('✅ SIMPLE: Criteria step shown');
        }
    } catch (error) {
        console.error('❌ SIMPLE: Navigation error:', error);
    }
    
    // Then, immediately fix the filters
    setTimeout(() => {
        console.log('🔧 SIMPLE: Running simple filter fix...');
        
        // Load localStorage therapists first if available
        if (typeof window.loadAndMergeLocalStorageTherapists === 'function') {
            try {
                const added = window.loadAndMergeLocalStorageTherapists();
                if (added.length > 0) {
                    console.log(`✅ SIMPLE: Added ${added.length} therapists from localStorage`);
                }
            } catch (e) {
                console.log('⚠️ SIMPLE: Could not load localStorage therapists');
            }
        }
        
        // Run the simple filter fix
        if (window.SIMPLE_FIX_FILTERS()) {
            console.log('🎉 SIMPLE: Filter fix completed successfully!');
            
            // Populate therapist cards if function exists
            if (typeof window.populateCriteriaCards === 'function') {
                try {
                    window.populateCriteriaCards();
                    console.log('✅ SIMPLE: Therapist cards populated');
                } catch (e) {
                    console.log('⚠️ SIMPLE: Could not populate therapist cards');
                }
            }
        } else {
            console.error('❌ SIMPLE: Filter fix failed');
        }
    }, 200);
};

// Create manual test function
window.testSimpleFilterFix = function() {
    console.log('🧪 SIMPLE: Testing simple filter fix...');
    
    if (window.SIMPLE_FIX_FILTERS()) {
        console.log('🎉 SIMPLE: Test successful!');
        
        // Show what we found
        const cityFilter = document.getElementById('city-filter');
        const approachFilter = document.getElementById('therapy-approach-filter');
        
        if (cityFilter) {
            console.log(`City filter has ${cityFilter.options.length} options`);
            const zografou = Array.from(cityFilter.options).find(opt => 
                opt.value.toLowerCase().includes('zografou')
            );
            if (zografou) {
                console.log(`🎯 Found Zografou: "${zografou.text}" (${zografou.value})`);
            }
        }
        
        if (approachFilter) {
            console.log(`Approach filter has ${approachFilter.options.length} options`);
            const systemic = Array.from(approachFilter.options).find(opt => 
                opt.text.toLowerCase().includes('systemic')
            );
            if (systemic) {
                console.log(`🎯 Found Systemic: "${systemic.text}" (${systemic.value})`);
            }
        }
    } else {
        console.error('❌ SIMPLE: Test failed');
    }
};

console.log('✅ SIMPLE FILTER FIX LOADED');
console.log('💡 Manual test: window.testSimpleFilterFix()');
console.log('💡 Auto-runs when you navigate to criteria step'); 
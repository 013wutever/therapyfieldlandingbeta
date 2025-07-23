// ========== SIMPLE DATA-DRIVEN FILTER ==========
// Uses clean Country, City, Area data from registration (no complex logic needed)

console.log('🎯 SIMPLE DATA-DRIVEN FILTER: Loading clean data display...');

// Simple filter that just displays clean registration data
window.SIMPLE_DATA_FILTER = function() {
    console.log('🎯 SIMPLE: Displaying clean registration data in filters...');
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('❌ No therapist data available');
        return false;
    }
    
    console.log(`🎯 Processing ${window.therapistData.length} therapists with clean data...`);
    
    // Extract unique values from clean registration data
    const filterData = {
        cities: new Set(),
        countries: new Set(),
        areas: new Set(),
        titles: new Set(),
        languages: new Set(),
        approaches: new Set(),
        genders: new Set()
    };
    
    window.therapistData.forEach(therapist => {
        // Use clean registration data (no complex extraction needed)
        if (therapist.country && therapist.city) {
            const cityDisplay = `${therapist.country}, ${therapist.city}`;
            filterData.cities.add(cityDisplay);
            filterData.countries.add(therapist.country);
        }
        
        if (therapist.area) {
            filterData.areas.add(therapist.area);
        }
        
        if (therapist.title) {
            filterData.titles.add(therapist.title);
        }
        
        if (therapist.languageKeys) {
            therapist.languageKeys.forEach(lang => filterData.languages.add(lang));
        }
        
        if (therapist.therapy_approaches_keys && therapist.therapy_approaches) {
            therapist.therapy_approaches_keys.forEach((key, idx) => {
                const display = therapist.therapy_approaches[idx] || key;
                filterData.approaches.add(`${key}|${display}`);
            });
        }
        
        if (therapist.gender) {
            filterData.genders.add(therapist.gender);
        }
    });
    
    console.log(`🎯 Extracted clean data:`);
    console.log(`   Cities: ${filterData.cities.size}`);
    console.log(`   Countries: ${filterData.countries.size}`);
    console.log(`   Languages: ${filterData.languages.size}`);
    console.log(`   Approaches: ${filterData.approaches.size}`);
    
    // Update all filters with clean data
    updateSimpleFilter('city-filter', Array.from(filterData.cities).sort(), 'All Cities');
    updateSimpleFilter('title-filter', Array.from(filterData.titles).sort(), 'All Titles');
    updateSimpleFilter('language-filter', Array.from(filterData.languages).sort().map(lang => capitalizeFirst(lang)), 'All Languages');
    updateSimpleFilter('gender-filter', Array.from(filterData.genders).sort().map(gender => capitalizeFirst(gender)), 'All Genders');
    
    // Therapy approaches need special handling for display names
    const approachOptions = Array.from(filterData.approaches).map(item => {
        const [key, display] = item.split('|');
        return { value: key, text: display };
    }).sort((a, b) => a.text.localeCompare(b.text));
    
    updateApproachFilter('therapy-approach-filter', approachOptions, 'All Approaches');
    
    return true;
};

// Helper function to update a simple filter
function updateSimpleFilter(filterId, options, defaultText) {
    const filter = document.getElementById(filterId);
    if (!filter) {
        console.log(`⚠️ Filter ${filterId} not found`);
        return;
    }
    
    console.log(`🎯 Updating ${filterId} with ${options.length} options...`);
    
    // Clear and add default
    filter.innerHTML = `<option value="">${defaultText}</option>`;
    
    // Add options
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.toLowerCase().replace(/[^a-z0-9]/g, '');
        optionElement.textContent = option;
        filter.appendChild(optionElement);
    });
    
    console.log(`✅ ${filterId} updated with ${filter.options.length} options`);
}

// Special handler for therapy approaches (has key/display pairs)
function updateApproachFilter(filterId, approachOptions, defaultText) {
    const filter = document.getElementById(filterId);
    if (!filter) {
        console.log(`⚠️ Filter ${filterId} not found`);
        return;
    }
    
    console.log(`🎯 Updating ${filterId} with ${approachOptions.length} approaches...`);
    
    // Clear and add default
    filter.innerHTML = `<option value="">${defaultText}</option>`;
    
    // Add approach options
    approachOptions.forEach(approach => {
        const optionElement = document.createElement('option');
        optionElement.value = approach.value;
        optionElement.textContent = approach.text;
        filter.appendChild(optionElement);
    });
    
    console.log(`✅ ${filterId} updated with ${filter.options.length} options`);
    
    // Check for specific approaches
    const hasSystemic = approachOptions.some(a => a.text.toLowerCase().includes('systemic'));
    console.log(`🎯 Systemic Therapy included: ${hasSystemic ? '✅ YES' : '❌ NO'}`);
}

// Helper function
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Override navigation to use simple data-driven filter
const previousNavigationSimple = window.navigateToTherapistStepThreeCriteria;
window.navigateToTherapistStepThreeCriteria = function() {
    console.log('🎯 SIMPLE: Navigation with clean data-driven filters...');
    
    // Do normal navigation
    try {
        if (previousNavigationSimple && typeof previousNavigationSimple === 'function') {
            previousNavigationSimple.apply(this, arguments);
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
    
    // Run simple data-driven filter
    setTimeout(() => {
        console.log('🎯 SIMPLE: Running clean data filter...');
        
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
        
        // Update filters with clean data
        window.SIMPLE_DATA_FILTER();
        
        // Populate therapist cards
        if (typeof window.populateCriteriaCards === 'function') {
            try {
                window.populateCriteriaCards();
                console.log('✅ Therapist cards populated');
            } catch (e) {
                console.log('⚠️ Could not populate therapist cards');
            }
        }
        
    }, 600);
};

// Auto-run 
setTimeout(() => {
    if (window.therapistData && window.therapistData.length > 0) {
        console.log('🎯 SIMPLE: Auto-running clean data filter...');
        window.SIMPLE_DATA_FILTER();
    }
}, 3000);

// Test function
window.testSimpleDataFilter = function() {
    console.log('🧪 TESTING: Simple data-driven filter...');
    
    if (window.SIMPLE_DATA_FILTER()) {
        console.log('✅ Simple filter test successful');
        
        const cityFilter = document.getElementById('city-filter');
        if (cityFilter) {
            console.log(`\n🎯 City filter options (${cityFilter.options.length}):`);
            Array.from(cityFilter.options).forEach((opt, idx) => {
                if (opt.value) {
                    console.log(`   ${idx}. ${opt.textContent}`);
                }
            });
            
            // Check for correct format
            const berlinOption = Array.from(cityFilter.options).find(opt => 
                opt.textContent.includes('Berlin')
            );
            if (berlinOption) {
                console.log(`🎯 Berlin displays as: "${berlinOption.textContent}"`);
                if (berlinOption.textContent.includes('Germany')) {
                    console.log('✅ Berlin correctly shows Germany!');
                } else {
                    console.log('❌ Berlin still showing wrong country');
                }
            }
        }
    } else {
        console.log('❌ Simple filter test failed');
    }
};

console.log('🎯 SIMPLE DATA-DRIVEN FILTER LOADED');
console.log('💡 Test: window.testSimpleDataFilter()');
console.log('💡 Run: window.SIMPLE_DATA_FILTER()');
console.log('📝 Note: This assumes therapist data has clean country/city fields from registration'); 
// ========== INSTANT FILTER OVERRIDE ==========
// Runs immediately when loaded, overrides ALL hardcoded filters

console.log('⚡ INSTANT OVERRIDE: Replacing hardcoded filters with dynamic data...');

// Run immediately and repeatedly to ensure override
function INSTANT_OVERRIDE_FILTERS() {
    console.log('⚡ INSTANT: Starting immediate filter override...');
    
    // Check if therapist data is available
    if (!window.therapistData || window.therapistData.length === 0) {
        console.log('⚡ INSTANT: Therapist data not ready, will retry...');
        return false;
    }
    
    console.log(`⚡ INSTANT: Found ${window.therapistData.length} therapists, extracting data...`);
    
    // Quick data extraction
    const uniqueData = {
        cities: new Set(),
        approaches: new Set(), 
        languages: new Set(),
        titles: new Set(),
        genders: new Set()
    };
    
    // Extract unique values from all therapists
    window.therapistData.forEach(therapist => {
        // Cities and areas
        if (therapist.cityKey) uniqueData.cities.add(`${therapist.cityKey}|Greece - ${therapist.city}`);
        if (therapist.areaKey && therapist.areaKey !== therapist.cityKey) {
            uniqueData.cities.add(`${therapist.areaKey}|Greece - ${therapist.area} (${therapist.city})`);
        }
        
        // Therapy approaches
        if (therapist.therapy_approaches_keys && therapist.therapy_approaches) {
            therapist.therapy_approaches_keys.forEach((key, idx) => {
                const display = therapist.therapy_approaches[idx] || key;
                uniqueData.approaches.add(`${key}|${display}`);
            });
        }
        
        // Languages
        if (therapist.languageKeys) {
            therapist.languageKeys.forEach(lang => {
                uniqueData.languages.add(`${lang}|${lang.charAt(0).toUpperCase() + lang.slice(1)}`);
            });
        }
        
        // Titles
        if (therapist.title) uniqueData.titles.add(therapist.title);
        
        // Genders
        if (therapist.gender) uniqueData.genders.add(therapist.gender);
    });
    
    console.log(`⚡ INSTANT: Extracted - Cities: ${uniqueData.cities.size}, Approaches: ${uniqueData.approaches.size}, Languages: ${uniqueData.languages.size}`);
    
    // Now replace each filter immediately
    
    // CITY FILTER - Most important
    const cityFilter = document.getElementById('city-filter');
    if (cityFilter) {
        console.log(`⚡ INSTANT: City filter found with ${cityFilter.options.length} options, replacing...`);
        cityFilter.innerHTML = '<option value="">All Locations</option>';
        
        Array.from(uniqueData.cities).sort().forEach(cityData => {
            const [key, display] = cityData.split('|');
            const option = document.createElement('option');
            option.value = key;
            option.textContent = display;
            cityFilter.appendChild(option);
        });
        
        console.log(`⚡ INSTANT: City filter rebuilt with ${cityFilter.options.length} options`);
        
        // Verify Zografou is included
        const hasZografou = Array.from(cityFilter.options).some(opt => 
            opt.value.toLowerCase().includes('zografou')
        );
        console.log(`⚡ INSTANT: Zografou included: ${hasZografou ? '✅ YES' : '❌ NO'}`);
        
        if (hasZografou) {
            const zografouOption = Array.from(cityFilter.options).find(opt => 
                opt.value.toLowerCase().includes('zografou')
            );
            console.log(`   Zografou: "${zografouOption.text}" (${zografouOption.value})`);
        }
    } else {
        console.log('⚡ INSTANT: City filter not found!');
    }
    
    // THERAPY APPROACH FILTER
    const approachFilter = document.getElementById('therapy-approach-filter');
    if (approachFilter) {
        console.log(`⚡ INSTANT: Approach filter found, replacing...`);
        approachFilter.innerHTML = '<option value="">All Approaches</option>';
        
        Array.from(uniqueData.approaches).sort().forEach(approachData => {
            const [key, display] = approachData.split('|');
            const option = document.createElement('option');
            option.value = key;
            option.textContent = display;
            approachFilter.appendChild(option);
        });
        
        console.log(`⚡ INSTANT: Approach filter rebuilt with ${approachFilter.options.length} options`);
        
        // Verify Systemic Therapy is included
        const hasSystemic = Array.from(approachFilter.options).some(opt => 
            opt.text.toLowerCase().includes('systemic')
        );
        console.log(`⚡ INSTANT: Systemic Therapy included: ${hasSystemic ? '✅ YES' : '❌ NO'}`);
    }
    
    // LANGUAGE FILTER
    const languageFilter = document.getElementById('language-filter');
    if (languageFilter) {
        languageFilter.innerHTML = '<option value="">All Languages</option>';
        
        Array.from(uniqueData.languages).sort().forEach(langData => {
            const [key, display] = langData.split('|');
            const option = document.createElement('option');
            option.value = key;
            option.textContent = display;
            languageFilter.appendChild(option);
        });
        
        console.log(`⚡ INSTANT: Language filter rebuilt with ${languageFilter.options.length} options`);
    }
    
    // TITLE FILTER
    const titleFilter = document.getElementById('title-filter');
    if (titleFilter) {
        titleFilter.innerHTML = '<option value="">All Titles</option>';
        
        Array.from(uniqueData.titles).sort().forEach(title => {
            const option = document.createElement('option');
            option.value = title;
            option.textContent = title;
            titleFilter.appendChild(option);
        });
        
        console.log(`⚡ INSTANT: Title filter rebuilt with ${titleFilter.options.length} options`);
    }
    
    // GENDER FILTER
    const genderFilter = document.getElementById('gender-filter');
    if (genderFilter) {
        genderFilter.innerHTML = '<option value="">All Genders</option>';
        
        Array.from(uniqueData.genders).sort().forEach(gender => {
            const option = document.createElement('option');
            option.value = gender;
            option.textContent = gender.charAt(0).toUpperCase() + gender.slice(1);
            genderFilter.appendChild(option);
        });
        
        console.log(`⚡ INSTANT: Gender filter rebuilt with ${genderFilter.options.length} options`);
    }
    
    console.log('⚡ INSTANT: All filters overridden successfully!');
    return true;
}

// Run immediately when script loads
setTimeout(INSTANT_OVERRIDE_FILTERS, 100);

// Run again after a delay to ensure override
setTimeout(INSTANT_OVERRIDE_FILTERS, 500);
setTimeout(INSTANT_OVERRIDE_FILTERS, 1000);
setTimeout(INSTANT_OVERRIDE_FILTERS, 2000);

// Override when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(INSTANT_OVERRIDE_FILTERS, 100);
    });
} else {
    setTimeout(INSTANT_OVERRIDE_FILTERS, 100);
}

// Make it available globally for manual testing
window.INSTANT_OVERRIDE_FILTERS = INSTANT_OVERRIDE_FILTERS;

// Also override the navigation to run this
const existingNavigation = window.navigateToTherapistStepThreeCriteria;
window.navigateToTherapistStepThreeCriteria = function() {
    console.log('⚡ INSTANT: Navigation to criteria - running instant override...');
    
    // Do normal navigation
    try {
        if (existingNavigation && typeof existingNavigation === 'function') {
            existingNavigation.apply(this, arguments);
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
        console.log('⚡ INSTANT: Navigation error:', error);
    }
    
    // Run instant override immediately
    setTimeout(() => {
        console.log('⚡ INSTANT: Running filter override after navigation...');
        INSTANT_OVERRIDE_FILTERS();
    }, 100);
    
    setTimeout(() => {
        console.log('⚡ INSTANT: Running filter override again...');
        INSTANT_OVERRIDE_FILTERS();
    }, 500);
};

console.log('⚡ INSTANT FILTER OVERRIDE LOADED');
console.log('💡 Manual test: window.INSTANT_OVERRIDE_FILTERS()'); 
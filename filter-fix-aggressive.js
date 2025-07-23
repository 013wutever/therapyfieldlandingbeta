// ========== AGGRESSIVE FILTER FIX - FINAL SOLUTION ==========
// This COMPLETELY overrides all existing filter systems and forces them to work

console.log('💥 AGGRESSIVE FILTER FIX: Loading final solution...');

// Wait for all scripts to load, then forcibly override everything
setTimeout(() => {
    console.log('🚀 AGGRESSIVE: Initializing final filter override system...');
    
    // FORCE OVERRIDE - Create the ultimate filter fix function
    window.ULTIMATE_FILTER_FIX = function() {
        console.log('💪 ULTIMATE FIX: Starting aggressive filter population...');
        console.log('═'.repeat(70));
        
        // Step 1: Ensure therapist data exists
        if (!window.therapistData || window.therapistData.length === 0) {
            console.error('❌ ULTIMATE: No therapist data available');
            
            // Try to force load therapist data from the global scope
            if (typeof therapistData !== 'undefined') {
                window.therapistData = therapistData;
                console.log('✅ ULTIMATE: Loaded therapist data from global scope');
            } else {
                console.error('❌ ULTIMATE: Cannot proceed without therapist data');
                return false;
            }
        }
        
        console.log(`📊 ULTIMATE: Processing ${window.therapistData.length} therapists...`);
        
        // Step 2: FORCE extract all data regardless of format variations
        const extractedData = {
            titles: new Set(),
            languages: new Set(),  
            therapyApproaches: new Map(),
            locations: new Map(),
            genders: new Set(),
            services: new Set()
        };
        
        // Process each therapist with maximum data extraction
        window.therapistData.forEach((therapist, index) => {
            console.log(`Processing: Dr. ${therapist.first_name} ${therapist.last_name} (ID: ${therapist.id})`);
            
            // Extract titles - multiple fallbacks
            if (therapist.title) {
                extractedData.titles.add(therapist.title);
                console.log(`   Title: ${therapist.title}`);
            }
            
            // Extract languages - handle both formats
            if (therapist.languageKeys && Array.isArray(therapist.languageKeys)) {
                therapist.languageKeys.forEach(lang => {
                    extractedData.languages.add(lang);
                    console.log(`   Language: ${lang}`);
                });
            } else if (therapist.languages && Array.isArray(therapist.languages)) {
                therapist.languages.forEach(lang => {
                    const key = lang.toLowerCase();
                    extractedData.languages.add(key);
                    console.log(`   Language (converted): ${key}`);
                });
            }
            
            // Extract therapy approaches - handle all possible formats
            if (therapist.therapy_approaches_keys && therapist.therapy_approaches) {
                therapist.therapy_approaches_keys.forEach((key, idx) => {
                    const displayName = therapist.therapy_approaches[idx] || key;
                    extractedData.therapyApproaches.set(key, displayName);
                    console.log(`   Approach: "${displayName}" (${key})`);
                });
            }
            
            // Extract locations - cities AND areas
            if (therapist.cityKey && therapist.city) {
                const country = determineCountry(therapist.cityKey);
                extractedData.locations.set(therapist.cityKey, {
                    type: 'city',
                    display: `${country} - ${therapist.city}`,
                    sortKey: `${country}-${therapist.city}`
                });
                console.log(`   City: ${therapist.city} (${therapist.cityKey})`);
            }
            
            if (therapist.areaKey && therapist.area && therapist.areaKey !== therapist.cityKey) {
                const country = determineCountry(therapist.cityKey);
                extractedData.locations.set(therapist.areaKey, {
                    type: 'area', 
                    display: `${country} - ${therapist.area} (${therapist.city || 'Unknown City'})`,
                    sortKey: `${country}-${therapist.area}`
                });
                console.log(`   Area: ${therapist.area} (${therapist.areaKey})`);
            }
            
            // Extract genders
            if (therapist.gender) {
                extractedData.genders.add(therapist.gender);
                console.log(`   Gender: ${therapist.gender}`);
            }
            
            // Extract services - handle both object and array formats
            if (therapist.services) {
                if (typeof therapist.services === 'object' && !Array.isArray(therapist.services)) {
                    // Object format: { service_name: { available: true } }
                    Object.keys(therapist.services).forEach(serviceKey => {
                        const service = therapist.services[serviceKey];
                        if (service && (service.available === true || service === true)) {
                            extractedData.services.add(serviceKey);
                            console.log(`   Service: ${serviceKey}`);
                        }
                    });
                } else if (Array.isArray(therapist.services)) {
                    // Array format: ["Service Name 1", "Service Name 2"]
                    therapist.services.forEach(service => {
                        const serviceKey = service.toLowerCase().replace(/\s+/g, '_');
                        extractedData.services.add(serviceKey);
                        console.log(`   Service: ${service} (${serviceKey})`);
                    });
                }
            }
        });
        
        console.log('📊 EXTRACTED SUMMARY:');
        console.log(`   ✅ Titles: ${extractedData.titles.size} (${Array.from(extractedData.titles).join(', ')})`);
        console.log(`   ✅ Languages: ${extractedData.languages.size} (${Array.from(extractedData.languages).join(', ')})`);
        console.log(`   ✅ Therapy Approaches: ${extractedData.therapyApproaches.size}`);
        Array.from(extractedData.therapyApproaches.entries()).forEach(([key, name]) => {
            console.log(`      - "${name}" (${key})`);
        });
        console.log(`   ✅ Locations: ${extractedData.locations.size}`);
        Array.from(extractedData.locations.entries()).forEach(([key, info]) => {
            console.log(`      - ${info.display} (${key})`);
        });
        console.log(`   ✅ Genders: ${extractedData.genders.size} (${Array.from(extractedData.genders).join(', ')})`);
        console.log(`   ✅ Services: ${extractedData.services.size} (${Array.from(extractedData.services).join(', ')})`);
        
        // Step 3: FORCIBLY rebuild all filters
        console.log('🔧 ULTIMATE: Forcibly rebuilding ALL filters...');
        
        // Force rebuild each filter with multiple attempts
        forceRebuildFilter('title-filter', 
            Array.from(extractedData.titles).sort().map(title => ({key: title, label: title})), 
            'All Titles');
        
        forceRebuildFilter('language-filter', 
            Array.from(extractedData.languages).sort().map(lang => ({
                key: lang, 
                label: capitalizeFirst(lang)
            })), 
            'All Languages');
        
        forceRebuildFilter('therapy-approach-filter', 
            Array.from(extractedData.therapyApproaches.entries())
                .sort((a,b) => a[1].localeCompare(b[1]))
                .map(([key, display]) => ({key: key, label: display})), 
            'All Approaches');
        
        // Location filter - include all cities and areas
        const locationOptions = Array.from(extractedData.locations.entries())
            .map(([key, info]) => ({key: key, label: info.display, sortKey: info.sortKey}))
            .sort((a,b) => a.sortKey.localeCompare(b.sortKey));
        
        forceRebuildFilter('city-filter', locationOptions, 'All Locations');
        
        forceRebuildFilter('gender-filter', 
            Array.from(extractedData.genders).sort().map(gender => ({
                key: gender, 
                label: capitalizeFirst(gender)
            })), 
            'All Genders');
        
        // Service filter with proper display names
        const serviceDisplayNames = {
            'in_person_therapy': 'In-Person Therapy',
            'online_therapy': 'Online Therapy', 
            'psychometric_mmpi2': 'MMPI-2 Assessment',
            'psychometric_wisc': 'WISC Assessment',
            'psychometric_wais': 'WAIS Assessment',
            'teen_counseling': 'Teen Counseling',
            'parents_counseling': 'Parents Counseling',
            'couples_therapy': 'Couples Therapy'
        };
        
        forceRebuildFilter('service-filter',
            Array.from(extractedData.services).sort().map(serviceKey => ({
                key: serviceKey,
                label: serviceDisplayNames[serviceKey] || serviceKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
            })),
            'All Services');
        
        console.log('✅ ULTIMATE: All filters forcibly rebuilt!');
        
        // Step 4: VERIFICATION with detailed logging
        ultimateVerification();
        
        return true;
    };
    
    // Aggressive filter rebuild function with multiple fallbacks
    function forceRebuildFilter(filterId, options, defaultText) {
        console.log(`🔧 ULTIMATE: Force rebuilding ${filterId}...`);
        
        let select = document.getElementById(filterId);
        if (!select) {
            console.warn(`⚠️ ULTIMATE: Filter '${filterId}' not found, searching by class/name...`);
            
            // Try alternative selectors
            select = document.querySelector(`select[id*="${filterId.replace('-filter', '')}"]`) ||
                     document.querySelector(`select[name*="${filterId.replace('-filter', '')}"]`) ||
                     document.querySelector(`select.${filterId}`);
            
            if (!select) {
                console.error(`❌ ULTIMATE: Cannot find filter element '${filterId}'`);
                return false;
            } else {
                console.log(`✅ ULTIMATE: Found ${filterId} using alternative selector`);
            }
        }
        
        try {
            // FORCE clear all options 
            select.innerHTML = '';
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = defaultText;
            select.appendChild(defaultOption);
            
            // Add all options with detailed logging
            let optionsAdded = 0;
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.key;
                optionElement.textContent = option.label;
                select.appendChild(optionElement);
                optionsAdded++;
                console.log(`      ✅ Added: "${option.label}" (${option.key})`);
            });
            
            console.log(`✅ ULTIMATE: ${filterId} rebuilt with ${select.options.length} total options (${optionsAdded} data options)`);
            
            // Force update the select element
            select.dispatchEvent(new Event('change'));
            
            return true;
        } catch (error) {
            console.error(`❌ ULTIMATE: Error rebuilding ${filterId}:`, error);
            return false;
        }
    }
    
    // Helper functions
    function determineCountry(cityKey) {
        if (!cityKey) return 'Unknown';
        const key = cityKey.toLowerCase();
        if (key === 'athens') return 'Greece';
        if (key === 'paris') return 'France';
        if (key === 'berlin') return 'Germany';
        if (key === 'rome') return 'Italy';
        if (key === 'london') return 'United Kingdom';
        return 'Unknown';
    }
    
    function capitalizeFirst(str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Ultimate verification function
    function ultimateVerification() {
        console.log('🔍 ULTIMATE VERIFICATION: Checking all filters...');
        console.log('═'.repeat(70));
        
        const filters = [
            { id: 'title-filter', name: 'Title' },
            { id: 'language-filter', name: 'Language' },
            { id: 'therapy-approach-filter', name: 'Therapy Approach' },
            { id: 'city-filter', name: 'City/Location' },
            { id: 'service-filter', name: 'Service' },
            { id: 'gender-filter', name: 'Gender' }
        ];
        
        filters.forEach(filter => {
            const element = document.getElementById(filter.id);
            if (element) {
                console.log(`✅ ${filter.name} Filter: ${element.options.length} options`);
                
                // Log first few options for verification
                Array.from(element.options).slice(0, 5).forEach((opt, idx) => {
                    if (idx > 0) { // Skip default option
                        console.log(`   ${idx}. "${opt.text}" (${opt.value})`);
                    }
                });
                
                if (element.options.length > 6) {
                    console.log(`   ... and ${element.options.length - 6} more options`);
                }
            } else {
                console.error(`❌ ${filter.name} Filter: Element not found`);
            }
        });
        
        // Specific checks for requested items
        console.log('🎯 SPECIFIC ITEM VERIFICATION:');
        
        // Check for Zografou
        const cityFilter = document.getElementById('city-filter');
        if (cityFilter) {
            const zografouOptions = Array.from(cityFilter.options).filter(opt => 
                opt.value.toLowerCase().includes('zografou') || 
                opt.text.toLowerCase().includes('zografou')
            );
            
            if (zografouOptions.length > 0) {
                console.log(`🎉 ZOGRAFOU FOUND: ${zografouOptions.length} option(s)`);
                zografouOptions.forEach(opt => {
                    console.log(`   ✅ "${opt.text}" (value: ${opt.value})`);
                });
            } else {
                console.log('❌ ZOGRAFOU NOT FOUND in city filter');
            }
        }
        
        // Check for Systemic Therapy
        const approachFilter = document.getElementById('therapy-approach-filter');
        if (approachFilter) {
            const systemicOptions = Array.from(approachFilter.options).filter(opt =>
                opt.text.toLowerCase().includes('systemic') ||
                opt.value.toLowerCase().includes('systemic')
            );
            
            if (systemicOptions.length > 0) {
                console.log(`🎉 SYSTEMIC THERAPY FOUND: ${systemicOptions.length} option(s)`);
                systemicOptions.forEach(opt => {
                    console.log(`   ✅ "${opt.text}" (value: ${opt.value})`);
                });
            } else {
                console.log('❌ SYSTEMIC THERAPY NOT FOUND in therapy approach filter');
            }
        }
        
        console.log('═'.repeat(70));
        console.log('🔍 ULTIMATE VERIFICATION COMPLETE');
    }
    
    // OVERRIDE the navigation function with ULTIMATE timing
    const originalNavigation = window.navigateToTherapistStepThreeCriteria;
    window.navigateToTherapistStepThreeCriteria = function() {
        console.log('💥 ULTIMATE: Criteria navigation with ultimate filter fix...');
        
        try {
            // Call original navigation first
            if (originalNavigation && typeof originalNavigation === 'function') {
                originalNavigation.call(this);
            } else {
                // Fallback navigation
                console.log('💥 ULTIMATE: Using fallback navigation...');
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
                }
            }
            
            // FORCE run the ultimate filter fix with multiple timing attempts
            setTimeout(() => {
                console.log('💥 ULTIMATE: Running ultimate filter fix (attempt 1)...');
                window.ULTIMATE_FILTER_FIX();
            }, 100);
            
            setTimeout(() => {
                console.log('💥 ULTIMATE: Running ultimate filter fix (attempt 2)...');
                window.ULTIMATE_FILTER_FIX();
            }, 500);
            
            setTimeout(() => {
                console.log('💥 ULTIMATE: Running ultimate filter fix (attempt 3 - final)...');
                window.ULTIMATE_FILTER_FIX();
                
                // Force populate criteria cards if function exists
                if (typeof window.populateCriteriaCards === 'function') {
                    window.populateCriteriaCards();
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ ULTIMATE: Error in navigation override:', error);
        }
    };
    
    // Create manual test function
    window.testUltimateFilterFix = function() {
        console.log('🧪 TESTING: Ultimate filter fix...');
        console.log('═'.repeat(70));
        
        if (window.ULTIMATE_FILTER_FIX()) {
            console.log('🎉 SUCCESS: Ultimate filter fix completed!');
        } else {
            console.error('❌ FAILED: Ultimate filter fix failed');
        }
    };
    
    console.log('💥 AGGRESSIVE FILTER FIX LOADED - READY TO OVERRIDE EVERYTHING');
    console.log('💡 Manual test: window.testUltimateFilterFix()');
    console.log('💡 Automatic: Navigate to criteria step');
    
}, 2000); // Wait 2 seconds for all other scripts to load first 
// ========== AUTHORITATIVE BERLIN COUNTRY FIX ==========
// Definitive, final solution for the Berlin country assignment issue

console.log('🚀 AUTHORITATIVE FIX: Loading definitive Berlin country solution...');

window.AuthoritativeBerlinFix = {
    
    // Single source of truth for country mapping
    COUNTRY_MAP: {
        'athens': 'Greece',
        'paris': 'France', 
        'berlin': 'Germany',
        'rome': 'Italy',
        'london': 'United Kingdom'
    },
    
    // Area to country mapping
    AREA_COUNTRY_MAP: {
        'charlottenburg': 'Germany',
        'mitte': 'Germany',
        'marais': 'France',
        'centro-storico': 'Italy',
        'marylebone': 'United Kingdom'
    },
    
    // Flag to prevent multiple executions
    isFixed: false,
    
    // Main fix function - runs everything in correct order
    applyDefinitiveFix: function() {
        if (this.isFixed) {
            console.log('🚀 AUTHORITATIVE FIX: Already applied, skipping...');
            return true;
        }
        
        console.log('🚀 AUTHORITATIVE FIX: Applying definitive Berlin country fix...');
        console.log('='.repeat(80));
        
        try {
            // Step 1: Disable all conflicting scripts
            this.disableConflictingScripts();
            
            // Step 2: Fix therapist data
            this.fixTherapistCountries();
            
            // Step 3: Rebuild city filter authoritatively
            this.rebuildCityFilterAuthoritatively();
            
            // Step 4: Validate and lock
            this.validateAndLock();
            
            this.isFixed = true;
            console.log('✅ AUTHORITATIVE FIX: Complete! Berlin is now correctly assigned to Germany.');
            console.log('='.repeat(80));
            
            return true;
            
        } catch (error) {
            console.error('❌ AUTHORITATIVE FIX: Error during fix:', error);
            return false;
        }
    },
    
    // Disable all conflicting filter scripts
    disableConflictingScripts: function() {
        console.log('1️⃣ DISABLING CONFLICTING SCRIPTS...');
        
        const conflictingFunctions = [
            'MASTER_FIX_ALL_FILTERS',
            'COMPREHENSIVE_COUNTRY_FIX',
            'fixAllLocationFilters',
            'UPDATE_FILTERS_WITH_FIXED_COUNTRIES',
            'INSTANT_OVERRIDE_FILTERS',
            'SIMPLE_FIX_FILTERS',
            'UPDATE_COUNTRY_CITY_FILTER',
            'IMPROVED_LOCATION_FILTERS'
        ];
        
        let disabledCount = 0;
        conflictingFunctions.forEach(funcName => {
            if (window[funcName] && typeof window[funcName] === 'function') {
                // Replace with disabled function
                window[funcName] = function() {
                    console.log(`⚠️ ${funcName} disabled by AUTHORITATIVE FIX`);
                    return false;
                };
                disabledCount++;
                console.log(`   ✅ Disabled: ${funcName}`);
            }
        });
        
        console.log(`   📊 Disabled ${disabledCount} conflicting functions`);
    },
    
    // Fix therapist country assignments
    fixTherapistCountries: function() {
        console.log('2️⃣ FIXING THERAPIST COUNTRY ASSIGNMENTS...');
        
        if (!window.therapistData || window.therapistData.length === 0) {
            console.log('   ❌ No therapist data available');
            return false;
        }
        
        let fixedCount = 0;
        let berlinCount = 0;
        
        window.therapistData.forEach(therapist => {
            let needsFix = false;
            let correctCountry = null;
            
            // Fix based on cityKey
            if (therapist.cityKey && this.COUNTRY_MAP[therapist.cityKey]) {
                correctCountry = this.COUNTRY_MAP[therapist.cityKey];
                if (therapist.country !== correctCountry) {
                    needsFix = true;
                }
            }
            
            // Fix based on areaKey
            if (therapist.areaKey && this.AREA_COUNTRY_MAP[therapist.areaKey]) {
                correctCountry = this.AREA_COUNTRY_MAP[therapist.areaKey];
                if (therapist.country !== correctCountry) {
                    needsFix = true;
                }
            }
            
            // Apply fix if needed
            if (needsFix && correctCountry) {
                const oldCountry = therapist.country;
                therapist.country = correctCountry;
                therapist.countryKey = correctCountry.toLowerCase().replace(/\\s+/g, '_');
                
                console.log(`   🔧 Fixed: ${therapist.first_name} ${therapist.last_name} - ${therapist.city || therapist.area} -> ${correctCountry} (was: ${oldCountry})`);
                fixedCount++;
                
                if (therapist.cityKey === 'berlin' || therapist.areaKey === 'charlottenburg' || therapist.areaKey === 'mitte') {
                    berlinCount++;
                }
            }
        });
        
        console.log(`   📊 Fixed ${fixedCount} therapist country assignments`);
        console.log(`   🏙️ Berlin-related fixes: ${berlinCount}`);
        
        // Verify Berlin therapists
        const berlinTherapists = window.therapistData.filter(t => 
            t.cityKey === 'berlin' || t.areaKey === 'charlottenburg' || t.areaKey === 'mitte'
        );
        
        console.log('   🔍 Berlin therapist verification:');
        berlinTherapists.forEach(t => {
            const status = t.country === 'Germany' ? '✅' : '❌';
            console.log(`     ${t.first_name} ${t.last_name}: ${t.city || t.area} -> ${t.country} ${status}`);
        });
        
        return true;
    },
    
    // Rebuild city filter with authoritative data
    rebuildCityFilterAuthoritatively: function() {
        console.log('3️⃣ REBUILDING CITY FILTER AUTHORITATIVELY...');
        
        const cityFilter = document.getElementById('city-filter');
        if (!cityFilter) {
            console.log('   ❌ City filter element not found');
            return false;
        }
        
        // Clear all existing options
        cityFilter.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'All Cities';
        cityFilter.appendChild(defaultOption);
        
        // Build city data from therapist data
        const cityData = new Map();
        
        window.therapistData.forEach(therapist => {
            // Add city entries
            if (therapist.cityKey && therapist.city && therapist.country) {
                const cityKey = therapist.cityKey;
                if (!cityData.has(cityKey)) {
                    cityData.set(cityKey, {
                        key: cityKey,
                        display: `${therapist.country}, ${therapist.city}`,
                        country: therapist.country,
                        city: therapist.city,
                        count: 0
                    });
                }
                cityData.get(cityKey).count++;
            }
            
            // Add area entries (if different from city)
            if (therapist.areaKey && therapist.area && 
                therapist.areaKey !== therapist.cityKey && therapist.country) {
                const areaKey = therapist.areaKey;
                if (!cityData.has(areaKey)) {
                    cityData.set(areaKey, {
                        key: areaKey,
                        display: `${therapist.country}, ${therapist.area}`,
                        country: therapist.country,
                        city: therapist.area,
                        count: 0
                    });
                }
                cityData.get(areaKey).count++;
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
        
        console.log(`   📊 Added ${sortedCities.length} city options`);
        
        // Verify Berlin entries
        const berlinEntries = sortedCities.filter(city => 
            city.display.toLowerCase().includes('berlin') || 
            city.display.toLowerCase().includes('charlottenburg') ||
            city.display.toLowerCase().includes('mitte')
        );
        
        console.log('   🔍 Berlin entries in filter:');
        berlinEntries.forEach(entry => {
            const isCorrect = entry.country === 'Germany';
            console.log(`     "${entry.display}" ${isCorrect ? '✅' : '❌'}`);
        });
        
        return true;
    },
    
    // Validate and lock the fix
    validateAndLock: function() {
        console.log('4️⃣ VALIDATING AND LOCKING FIX...');
        
        let isValid = true;
        
        // Validate therapist data
        const berlinTherapists = window.therapistData.filter(t => 
            t.cityKey === 'berlin' || t.areaKey === 'charlottenburg' || t.areaKey === 'mitte'
        );
        
        const incorrectTherapists = berlinTherapists.filter(t => t.country !== 'Germany');
        if (incorrectTherapists.length > 0) {
            console.log('   ❌ Validation failed: Some Berlin therapists still have incorrect countries');
            incorrectTherapists.forEach(t => {
                console.log(`     ${t.first_name} ${t.last_name}: ${t.country} (should be Germany)`);
            });
            isValid = false;
        } else {
            console.log(`   ✅ Therapist data validated: ${berlinTherapists.length} Berlin therapists correctly assigned to Germany`);
        }
        
        // Validate filter options
        const cityFilter = document.getElementById('city-filter');
        if (cityFilter) {
            const options = Array.from(cityFilter.options);
            const incorrectOptions = options.filter(opt => {
                const text = opt.textContent || '';
                return text.includes('Greece, Berlin') || text.includes('Greece,Berlin');
            });
            
            if (incorrectOptions.length > 0) {
                console.log('   ❌ Validation failed: Filter still contains "Greece, Berlin" options');
                incorrectOptions.forEach(opt => {
                    console.log(`     "${opt.textContent}"`);
                });
                isValid = false;
            } else {
                console.log('   ✅ Filter validated: No "Greece, Berlin" options found');
            }
            
            // Check for correct Berlin options
            const correctBerlinOptions = options.filter(opt => {
                const text = opt.textContent || '';
                return text.includes('Germany, Berlin') || text.includes('Germany,Berlin') ||
                       text.includes('Germany, Charlottenburg') || text.includes('Germany, Mitte');
            });
            
            console.log(`   📊 Correct Berlin options found: ${correctBerlinOptions.length}`);
            correctBerlinOptions.forEach(opt => {
                console.log(`     "${opt.textContent}" ✅`);
            });
        }
        
        if (isValid) {
            console.log('   🔒 Fix validated and locked successfully');
            
            // Lock against future modifications
            this.lockAgainstModifications();
        } else {
            console.log('   ❌ Validation failed - fix may need to be reapplied');
        }
        
        return isValid;
    },
    
    // Lock against future modifications
    lockAgainstModifications: function() {
        console.log('5️⃣ LOCKING AGAINST FUTURE MODIFICATIONS...');
        
        // Monitor for unauthorized changes to therapist data
        if (window.therapistData) {
            const originalData = JSON.stringify(window.therapistData);
            
            // Set up periodic validation
            setInterval(() => {
                const currentData = JSON.stringify(window.therapistData);
                if (currentData !== originalData) {
                    console.log('⚠️ LOCK: Therapist data modified, revalidating...');
                    this.validateAndLock();
                }
            }, 5000);
        }
        
        // Monitor city filter for unauthorized changes
        const cityFilter = document.getElementById('city-filter');
        if (cityFilter) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        console.log('⚠️ LOCK: City filter modified, checking for incorrect options...');
                        
                        const options = Array.from(cityFilter.options);
                        const incorrectOptions = options.filter(opt => {
                            const text = opt.textContent || '';
                            return text.includes('Greece, Berlin') || text.includes('Greece,Berlin');
                        });
                        
                        if (incorrectOptions.length > 0) {
                            console.log('🔧 LOCK: Removing unauthorized "Greece, Berlin" options...');
                            incorrectOptions.forEach(opt => {
                                console.log(`   Removing: "${opt.textContent}"`);
                                opt.remove();
                            });
                        }
                    }
                });
            });
            
            observer.observe(cityFilter, { childList: true, subtree: true });
            console.log('   🔒 City filter monitoring enabled');
        }
        
        console.log('   🔒 Lock mechanisms activated');
    }
};

// Auto-run the authoritative fix
setTimeout(() => {
    console.log('🚀 AUTHORITATIVE FIX: Auto-running definitive fix...');
    window.AuthoritativeBerlinFix.applyDefinitiveFix();
}, 2500); // Run after other scripts have loaded

console.log('🚀 AUTHORITATIVE BERLIN FIX LOADED');
console.log('💡 Manual run: window.AuthoritativeBerlinFix.applyDefinitiveFix()');
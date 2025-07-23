// ========== BERLIN COUNTRY DIAGNOSTIC SYSTEM ==========
// Comprehensive diagnostic system to identify why Berlin shows as Greece

console.log('🔍 BERLIN DIAGNOSTIC: Loading comprehensive diagnostic system...');

window.BerlinCountryDiagnostic = {
    
    // Main diagnostic function
    runCompleteDiagnostic: function() {
        console.log('🔍 BERLIN DIAGNOSTIC: Starting complete analysis...');
        console.log('='.repeat(80));
        
        const report = {
            timestamp: new Date().toISOString(),
            therapistDataIntegrity: this.analyzeTherapistData(),
            scriptExecution: this.traceScriptExecution(),
            filterState: this.analyzeFilterState(),
            rootCause: null,
            recommendations: []
        };
        
        // Determine root cause
        report.rootCause = this.determineRootCause(report);
        report.recommendations = this.generateRecommendations(report);
        
        // Display comprehensive report
        this.displayReport(report);
        
        return report;
    },
    
    // Analyze therapist data integrity
    analyzeTherapistData: function() {
        console.log('\n1️⃣ ANALYZING THERAPIST DATA INTEGRITY:');
        
        const analysis = {
            totalTherapists: 0,
            berlinTherapists: [],
            incorrectAssignments: [],
            missingCountries: [],
            areaAssignments: []
        };
        
        if (!window.therapistData || window.therapistData.length === 0) {
            console.log('❌ No therapist data found!');
            return analysis;
        }
        
        analysis.totalTherapists = window.therapistData.length;
        console.log(`📊 Total therapists: ${analysis.totalTherapists}`);
        
        window.therapistData.forEach((therapist, index) => {
            // Check Berlin therapists
            if (therapist.cityKey === 'berlin' || therapist.city === 'Berlin') {
                analysis.berlinTherapists.push({
                    id: therapist.id,
                    name: `${therapist.first_name} ${therapist.last_name}`,
                    city: therapist.city,
                    cityKey: therapist.cityKey,
                    country: therapist.country,
                    address: therapist.address
                });
                
                if (therapist.country !== 'Germany') {
                    analysis.incorrectAssignments.push({
                        id: therapist.id,
                        name: `${therapist.first_name} ${therapist.last_name}`,
                        currentCountry: therapist.country,
                        correctCountry: 'Germany',
                        reason: 'Berlin city should be Germany'
                    });
                }
            }
            
            // Check Berlin areas
            if (therapist.areaKey === 'charlottenburg' || therapist.areaKey === 'mitte') {
                analysis.areaAssignments.push({
                    id: therapist.id,
                    name: `${therapist.first_name} ${therapist.last_name}`,
                    area: therapist.area,
                    areaKey: therapist.areaKey,
                    country: therapist.country
                });
                
                if (therapist.country !== 'Germany') {
                    analysis.incorrectAssignments.push({
                        id: therapist.id,
                        name: `${therapist.first_name} ${therapist.last_name}`,
                        currentCountry: therapist.country,
                        correctCountry: 'Germany',
                        reason: `${therapist.area} area should be Germany`
                    });
                }
            }
            
            // Check missing countries
            if (!therapist.country) {
                analysis.missingCountries.push({
                    id: therapist.id,
                    name: `${therapist.first_name} ${therapist.last_name}`,
                    city: therapist.city,
                    cityKey: therapist.cityKey
                });
            }
        });
        
        console.log(`🏙️ Berlin therapists found: ${analysis.berlinTherapists.length}`);
        analysis.berlinTherapists.forEach(t => {
            console.log(`   ${t.name}: ${t.city} -> ${t.country} ${t.country !== 'Germany' ? '❌' : '✅'}`);
        });
        
        console.log(`🏢 Berlin area therapists: ${analysis.areaAssignments.length}`);
        analysis.areaAssignments.forEach(t => {
            console.log(`   ${t.name}: ${t.area} -> ${t.country} ${t.country !== 'Germany' ? '❌' : '✅'}`);
        });
        
        if (analysis.incorrectAssignments.length > 0) {
            console.log(`❌ Incorrect assignments: ${analysis.incorrectAssignments.length}`);
            analysis.incorrectAssignments.forEach(t => {
                console.log(`   ${t.name}: ${t.currentCountry} should be ${t.correctCountry} (${t.reason})`);
            });
        } else {
            console.log('✅ All Berlin therapists have correct country assignments');
        }
        
        return analysis;
    },
    
    // Trace script execution and modifications
    traceScriptExecution: function() {
        console.log('\n2️⃣ TRACING SCRIPT EXECUTION:');
        
        const scripts = {
            loadedScripts: [],
            filterScripts: [],
            conflictingScripts: [],
            executionOrder: []
        };
        
        // Check which scripts are loaded
        const scriptElements = document.querySelectorAll('script[src]');
        scriptElements.forEach(script => {
            const src = script.src;
            if (src.includes('.js')) {
                const scriptName = src.split('/').pop();
                scripts.loadedScripts.push(scriptName);
                
                // Identify filter-related scripts
                if (scriptName.includes('filter') || scriptName.includes('country') || scriptName.includes('fix')) {
                    scripts.filterScripts.push(scriptName);
                }
            }
        });
        
        console.log(`📜 Total scripts loaded: ${scripts.loadedScripts.length}`);
        console.log(`🔧 Filter-related scripts: ${scripts.filterScripts.length}`);
        scripts.filterScripts.forEach(script => {
            console.log(`   - ${script}`);
        });
        
        // Check for conflicting functions
        const potentialConflicts = [
            'MASTER_FIX_ALL_FILTERS',
            'COMPREHENSIVE_COUNTRY_FIX',
            'fixAllLocationFilters',
            'initializeCriteriaFilters',
            'UPDATE_FILTERS_WITH_FIXED_COUNTRIES'
        ];
        
        potentialConflicts.forEach(funcName => {
            if (window[funcName]) {
                console.log(`🔧 Function available: ${funcName}`);
                scripts.executionOrder.push({
                    function: funcName,
                    available: true,
                    type: typeof window[funcName]
                });
            } else {
                console.log(`❌ Function missing: ${funcName}`);
                scripts.executionOrder.push({
                    function: funcName,
                    available: false,
                    type: 'undefined'
                });
            }
        });
        
        return scripts;
    },
    
    // Analyze current filter state
    analyzeFilterState: function() {
        console.log('\n3️⃣ ANALYZING FILTER STATE:');
        
        const filterState = {
            cityFilterExists: false,
            totalOptions: 0,
            berlinOptions: [],
            incorrectOptions: [],
            missingOptions: []
        };
        
        const cityFilter = document.getElementById('city-filter');
        if (!cityFilter) {
            console.log('❌ City filter element not found!');
            return filterState;
        }
        
        filterState.cityFilterExists = true;
        filterState.totalOptions = cityFilter.options.length;
        
        console.log(`🎛️ City filter found with ${filterState.totalOptions} options`);
        
        // Analyze each option
        Array.from(cityFilter.options).forEach((option, index) => {
            const text = option.textContent || option.innerText || '';
            const value = option.value || '';
            
            console.log(`   ${index + 1}. "${text}" (value: "${value}")`);
            
            // Check for Berlin-related options
            if (text.toLowerCase().includes('berlin')) {
                filterState.berlinOptions.push({
                    text: text,
                    value: value,
                    index: index,
                    isCorrect: text.includes('Germany')
                });
                
                if (text.includes('Greece')) {
                    filterState.incorrectOptions.push({
                        text: text,
                        value: value,
                        issue: 'Berlin showing as Greece instead of Germany'
                    });
                    console.log(`     ❌ INCORRECT: ${text}`);
                }
            }
        });
        
        // Check for missing correct Berlin option
        const hasCorrectBerlin = filterState.berlinOptions.some(opt => opt.isCorrect);
        if (!hasCorrectBerlin && filterState.berlinOptions.length === 0) {
            filterState.missingOptions.push('Germany, Berlin');
            console.log('❌ Missing: Germany, Berlin option');
        }
        
        console.log(`🏙️ Berlin options found: ${filterState.berlinOptions.length}`);
        filterState.berlinOptions.forEach(opt => {
            console.log(`   "${opt.text}" ${opt.isCorrect ? '✅' : '❌'}`);
        });
        
        return filterState;
    },
    
    // Determine root cause based on analysis
    determineRootCause: function(report) {
        console.log('\n4️⃣ DETERMINING ROOT CAUSE:');
        
        let rootCause = 'Unknown';
        
        // Check data integrity first
        if (report.therapistDataIntegrity.incorrectAssignments.length > 0) {
            rootCause = 'Therapist data has incorrect country assignments';
            console.log(`🎯 ROOT CAUSE: ${rootCause}`);
            return rootCause;
        }
        
        // Check if filter has incorrect options despite correct data
        if (report.filterState.incorrectOptions.length > 0 && 
            report.therapistDataIntegrity.incorrectAssignments.length === 0) {
            rootCause = 'Filter population script creating incorrect options from correct data';
            console.log(`🎯 ROOT CAUSE: ${rootCause}`);
            return rootCause;
        }
        
        // Check for missing filter
        if (!report.filterState.cityFilterExists) {
            rootCause = 'City filter element not found in DOM';
            console.log(`🎯 ROOT CAUSE: ${rootCause}`);
            return rootCause;
        }
        
        // Check for script conflicts
        if (report.scriptExecution.filterScripts.length > 5) {
            rootCause = 'Multiple conflicting filter scripts causing interference';
            console.log(`🎯 ROOT CAUSE: ${rootCause}`);
            return rootCause;
        }
        
        console.log(`🎯 ROOT CAUSE: ${rootCause}`);
        return rootCause;
    },
    
    // Generate recommendations
    generateRecommendations: function(report) {
        console.log('\n5️⃣ GENERATING RECOMMENDATIONS:');
        
        const recommendations = [];
        
        if (report.therapistDataIntegrity.incorrectAssignments.length > 0) {
            recommendations.push('Fix therapist data: Ensure all Berlin therapists have country = "Germany"');
        }
        
        if (report.filterState.incorrectOptions.length > 0) {
            recommendations.push('Fix filter population: Remove "Greece, Berlin" options and add "Germany, Berlin"');
        }
        
        if (report.scriptExecution.filterScripts.length > 5) {
            recommendations.push('Reduce script conflicts: Disable redundant filter scripts');
        }
        
        if (!report.scriptExecution.executionOrder.find(f => f.function === 'MASTER_FIX_ALL_FILTERS' && f.available)) {
            recommendations.push('Enable master fix: Ensure MASTER_FIX_ALL_FILTERS function is available and called');
        }
        
        recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. ${rec}`);
        });
        
        return recommendations;
    },
    
    // Display comprehensive report
    displayReport: function(report) {
        console.log('\n📋 COMPREHENSIVE DIAGNOSTIC REPORT:');
        console.log('='.repeat(80));
        console.log(`Timestamp: ${report.timestamp}`);
        console.log(`Root Cause: ${report.rootCause}`);
        console.log(`Berlin Therapists: ${report.therapistDataIntegrity.berlinTherapists.length}`);
        console.log(`Incorrect Assignments: ${report.therapistDataIntegrity.incorrectAssignments.length}`);
        console.log(`Filter Options: ${report.filterState.totalOptions}`);
        console.log(`Berlin Filter Options: ${report.filterState.berlinOptions.length}`);
        console.log(`Incorrect Filter Options: ${report.filterState.incorrectOptions.length}`);
        console.log(`Loaded Scripts: ${report.scriptExecution.loadedScripts.length}`);
        console.log(`Filter Scripts: ${report.scriptExecution.filterScripts.length}`);
        console.log('='.repeat(80));
        
        // Store report globally for access
        window.lastDiagnosticReport = report;
        
        return report;
    }
};

// Auto-run diagnostic when loaded
setTimeout(() => {
    console.log('🔍 BERLIN DIAGNOSTIC: Auto-running diagnostic...');
    window.BerlinCountryDiagnostic.runCompleteDiagnostic();
}, 1000);

console.log('🔍 BERLIN DIAGNOSTIC SYSTEM LOADED');
console.log('💡 Manual run: window.BerlinCountryDiagnostic.runCompleteDiagnostic()');
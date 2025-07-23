// ========== ULTIMATE ADDRESS FIXER ==========
// Comprehensive solution that addresses all 10 potential autofill issues

console.log('🛠️ ULTIMATE FIXER: Loading comprehensive address autofill solution...');

class UltimateAddressFixer {
    constructor() {
        this.diagnostics = {
            googleReady: false,
            domReady: false,
            fieldsFound: false,
            listenersAttached: false,
            apiWorking: false
        };
        this.issues = [];
        this.fixes = [];
    }

    // Issue #1-2: Check Google Maps and DOM readiness
    async checkPrerequisites() {
        console.log('🔍 CHECKING: Prerequisites...');
        
        // Check Google Maps API
        if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
            this.issues.push('❌ Google Maps API not loaded');
            await this.waitForGoogle();
        } else {
            this.diagnostics.googleReady = true;
            console.log('✅ Google Maps API ready');
        }

        // Check DOM readiness
        if (document.readyState !== 'complete') {
            this.issues.push('❌ DOM not ready');
            await this.waitForDOM();
        } else {
            this.diagnostics.domReady = true;
            console.log('✅ DOM ready');
        }
    }

    // Issue #3: Check form fields exist and are accessible
    checkFormFields() {
        console.log('🔍 CHECKING: Form fields...');
        
        const fields = {
            address: document.getElementById('officeAddress'),
            country: document.getElementById('country'),
            city: document.getElementById('city'),
            area: document.getElementById('area')
        };

        const missing = [];
        Object.entries(fields).forEach(([name, field]) => {
            if (!field) {
                missing.push(name);
                this.issues.push(`❌ ${name} field not found`);
            } else {
                console.log(`✅ ${name} field found`);
            }
        });

        if (missing.length === 0) {
            this.diagnostics.fieldsFound = true;
        }

        return fields;
    }

    // Issue #4: Check field attributes that might prevent filling
    checkFieldAttributes(fields) {
        console.log('🔍 CHECKING: Field attributes...');
        
        ['country', 'city', 'area'].forEach(fieldName => {
            const field = fields[fieldName];
            if (field) {
                if (field.readOnly) {
                    this.issues.push(`❌ ${fieldName} field is readonly`);
                    field.readOnly = false;
                    this.fixes.push(`✅ Removed readonly from ${fieldName} field`);
                }
                if (field.disabled) {
                    this.issues.push(`❌ ${fieldName} field is disabled`);
                    field.disabled = false;
                    this.fixes.push(`✅ Enabled ${fieldName} field`);
                }
            }
        });
    }

    // Issue #5: Test Google Geocoding API
    async testGoogleAPI() {
        console.log('🔍 CHECKING: Google Geocoding API...');
        
        try {
            const geocoder = new google.maps.Geocoder();
            const testResult = await new Promise((resolve, reject) => {
                geocoder.geocode({ address: 'Berlin, Germany' }, (results, status) => {
                    if (status === 'OK') {
                        resolve(results);
                    } else {
                        reject(new Error(`API test failed: ${status}`));
                    }
                });
            });
            
            this.diagnostics.apiWorking = true;
            console.log('✅ Google Geocoding API working');
            return true;
        } catch (error) {
            this.issues.push(`❌ Google API issue: ${error.message}`);
            return false;
        }
    }

    // Issue #6-7: Enhanced address analysis with multiple fallbacks
    async enhancedAddressAnalysis(address) {
        console.log(`🔍 ANALYZING: "${address}"`);
        
        if (!address || address.length < 3) {
            throw new Error('Address too short');
        }

        const geocoder = new google.maps.Geocoder();
        
        return new Promise((resolve, reject) => {
            geocoder.geocode({ address: address }, (results, status) => {
                console.log(`🌐 Google response: ${status}`);
                
                if (status !== 'OK' || !results || results.length === 0) {
                    reject(new Error(`Geocoding failed: ${status}`));
                    return;
                }

                const place = results[0];
                console.log('🌐 Place details:', place);

                // Enhanced component parsing with multiple fallbacks
                const components = place.address_components;
                let country = null, city = null, area = null;

                console.log('🔍 Parsing components:');
                components.forEach((component, i) => {
                    const types = component.types;
                    const long_name = component.long_name;
                    
                    console.log(`  ${i + 1}. "${long_name}" - [${types.join(', ')}]`);

                    // Country - multiple type checks
                    if (types.includes('country')) {
                        country = long_name;
                        console.log(`    → COUNTRY: ${country}`);
                    }

                    // City - multiple type checks with fallbacks
                    if (types.includes('locality') || 
                        types.includes('administrative_area_level_3') ||
                        types.includes('administrative_area_level_2')) {
                        if (!city) { // Only set if not already found
                            city = long_name;
                            console.log(`    → CITY: ${city}`);
                        }
                    }

                    // Area - multiple type checks with fallbacks
                    if (types.includes('sublocality') || 
                        types.includes('sublocality_level_1') ||
                        types.includes('sublocality_level_2') ||
                        types.includes('neighborhood') ||
                        types.includes('political')) {
                        if (!area && long_name !== city && long_name !== country) {
                            area = long_name;
                            console.log(`    → AREA: ${area}`);
                        }
                    }
                });

                // Fallback strategies for missing components
                if (!country) {
                    // Try to extract from formatted address
                    const addressParts = place.formatted_address.split(',').map(s => s.trim());
                    country = addressParts[addressParts.length - 1];
                    console.log(`🔄 Fallback country: ${country}`);
                }

                if (!city && components.length > 0) {
                    // Try administrative areas as fallback
                    const adminArea = components.find(c => 
                        c.types.includes('administrative_area_level_1')
                    );
                    if (adminArea) {
                        city = adminArea.long_name;
                        console.log(`🔄 Fallback city: ${city}`);
                    }
                }

                const result = { country, city, area, originalPlace: place };
                console.log('🎯 Final analysis result:', result);
                
                resolve(result);
            });
        });
    }

    // Issue #8: Bulletproof field filling with visual feedback
    bulletproofFillFields(result, fields) {
        console.log('🎯 FILLING: Fields with enhanced feedback...');
        
        const fillActions = [];

        // Fill country
        if (result.country && fields.country) {
            fields.country.value = result.country;
            fields.country.style.backgroundColor = '#d4edda';
            fields.country.style.borderColor = '#28a745';
            fillActions.push(`Country: ${result.country}`);
            console.log(`✅ Filled country: ${result.country}`);
        } else if (fields.country) {
            fields.country.style.backgroundColor = '#f8d7da';
            fields.country.style.borderColor = '#dc3545';
            console.log('❌ Country not filled');
        }

        // Fill city
        if (result.city && fields.city) {
            fields.city.value = result.city;
            fields.city.style.backgroundColor = '#d4edda';
            fields.city.style.borderColor = '#28a745';
            fillActions.push(`City: ${result.city}`);
            console.log(`✅ Filled city: ${result.city}`);
        } else if (fields.city) {
            fields.city.style.backgroundColor = '#f8d7da';
            fields.city.style.borderColor = '#dc3545';
            console.log('❌ City not filled');
        }

        // Fill area
        if (result.area && fields.area) {
            fields.area.value = result.area;
            fields.area.style.backgroundColor = '#d4edda';
            fields.area.style.borderColor = '#28a745';
            fillActions.push(`Area: ${result.area}`);
            console.log(`✅ Filled area: ${result.area}`);
        } else if (fields.area) {
            fields.area.style.backgroundColor = '#f8d7da';
            fields.area.style.borderColor = '#dc3545';
            console.log('❌ Area not filled');
        }

        // Show comprehensive status message
        this.showStatusMessage(fillActions, fields.address);

        return fillActions;
    }

    // Visual status message
    showStatusMessage(fillActions, addressField) {
        if (!addressField || !addressField.parentNode) return;

        // Remove existing messages
        const existingMsg = document.getElementById('ultimate-status');
        if (existingMsg) existingMsg.remove();

        // Create new status message
        const statusMsg = document.createElement('div');
        statusMsg.id = 'ultimate-status';
        statusMsg.style.cssText = `
            margin-top: 10px; 
            padding: 12px; 
            border-radius: 6px; 
            font-size: 14px; 
            font-weight: 500;
            ${fillActions.length > 0 ? 
                'background: #d4edda; border: 1px solid #c3e6cb; color: #155724;' : 
                'background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;'
            }
        `;
        
        if (fillActions.length > 0) {
            statusMsg.innerHTML = `✅ <strong>Auto-filled:</strong> ${fillActions.join(' • ')}`;
        } else {
            statusMsg.innerHTML = `❌ <strong>Could not auto-fill address components</strong> - please fill manually`;
        }

        addressField.parentNode.appendChild(statusMsg);

        // Auto-hide after 8 seconds
        setTimeout(() => {
            if (statusMsg.parentNode) {
                statusMsg.style.transition = 'opacity 0.5s ease';
                statusMsg.style.opacity = '0';
                setTimeout(() => {
                    if (statusMsg.parentNode) statusMsg.remove();
                }, 500);
            }
        }, 8000);
    }

    // Issue #9: Robust event handling
    attachRobustListeners(fields) {
        console.log('🔍 ATTACHING: Robust event listeners...');
        
        if (!fields.address) {
            this.issues.push('❌ Cannot attach listeners - address field missing');
            return;
        }

        // Remove existing listeners by cloning
        const newAddressField = fields.address.cloneNode(true);
        fields.address.parentNode.replaceChild(newAddressField, fields.address);
        fields.address = newAddressField;

        // Debounced processing to avoid too many API calls
        let debounceTimer;
        const debouncedProcess = (address) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => this.processAddressWithDiagnostics(address), 500);
        };

        // Multiple event types for maximum compatibility
        const events = ['blur', 'change', 'keyup'];
        events.forEach(eventType => {
            newAddressField.addEventListener(eventType, (e) => {
                const address = e.target.value.trim();
                if (address.length > 5) {
                    console.log(`🎯 Event: ${eventType} - processing address`);
                    if (eventType === 'blur' || eventType === 'change') {
                        this.processAddressWithDiagnostics(address);
                    } else {
                        debouncedProcess(address);
                    }
                }
            });
        });

        // Special Enter key handling
        newAddressField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const address = e.target.value.trim();
                if (address.length > 5) {
                    console.log('🎯 Enter key - processing address');
                    this.processAddressWithDiagnostics(address);
                }
            }
        });

        this.diagnostics.listenersAttached = true;
        console.log('✅ Robust listeners attached');
    }

    // Main processing function with full diagnostics
    async processAddressWithDiagnostics(address) {
        console.log(`🎯 PROCESSING: "${address}"`);
        
        try {
            // Show loading state
            this.showLoadingState();
            
            // Get fresh field references
            const fields = this.checkFormFields();
            
            // Enhanced analysis
            const result = await this.enhancedAddressAnalysis(address);
            
            // Bulletproof filling
            const fillActions = this.bulletproofFillFields(result, fields);
            
            // Log success
            console.log('🎉 ULTIMATE FIXER: Processing complete!');
            console.log(`   Filled: ${fillActions.length} fields`);
            
        } catch (error) {
            console.log('❌ ULTIMATE FIXER: Error:', error.message);
            this.showErrorState(error.message);
        }
    }

    // Loading and error states
    showLoadingState() {
        const addressField = document.getElementById('officeAddress');
        if (!addressField) return;

        let loadingMsg = document.getElementById('ultimate-loading');
        if (!loadingMsg) {
            loadingMsg = document.createElement('div');
            loadingMsg.id = 'ultimate-loading';
            loadingMsg.style.cssText = 'margin-top: 8px; padding: 8px; background: #e3f2fd; border: 1px solid #90caf9; border-radius: 4px; color: #0d47a1; font-size: 14px;';
            addressField.parentNode.appendChild(loadingMsg);
        }
        loadingMsg.innerHTML = '🔄 <strong>Analyzing address...</strong> Please wait...';
    }

    showErrorState(error) {
        const addressField = document.getElementById('officeAddress');
        if (!addressField) return;

        // Remove loading message
        const loadingMsg = document.getElementById('ultimate-loading');
        if (loadingMsg) loadingMsg.remove();

        // Show error
        let errorMsg = document.getElementById('ultimate-error');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.id = 'ultimate-error';
            errorMsg.style.cssText = 'margin-top: 8px; padding: 8px; background: #ffebee; border: 1px solid #f8bbd9; border-radius: 4px; color: #c62828; font-size: 14px;';
            addressField.parentNode.appendChild(errorMsg);
        }
        errorMsg.innerHTML = `❌ <strong>Analysis failed:</strong> ${error}`;

        // Auto-hide error after 5 seconds
        setTimeout(() => {
            if (errorMsg.parentNode) errorMsg.remove();
        }, 5000);
    }

    // Utility functions
    waitForGoogle() {
        return new Promise((resolve) => {
            const check = () => {
                if (window.google && window.google.maps && window.google.maps.Geocoder) {
                    this.diagnostics.googleReady = true;
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                this.diagnostics.domReady = true;
                resolve();
            } else {
                window.addEventListener('load', () => {
                    this.diagnostics.domReady = true;
                    resolve();
                });
            }
        });
    }

    // Issue #10: Comprehensive diagnostic report
    generateDiagnosticReport() {
        console.log('\n📊 ULTIMATE FIXER: DIAGNOSTIC REPORT');
        console.log('=====================================');
        console.log('Prerequisites:', this.diagnostics);
        
        if (this.issues.length > 0) {
            console.log('\n❌ Issues Found:');
            this.issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
        }

        if (this.fixes.length > 0) {
            console.log('\n✅ Fixes Applied:');
            this.fixes.forEach((fix, i) => console.log(`  ${i + 1}. ${fix}`));
        }

        console.log('\n💡 Manual Test Command:');
        console.log('   window.ULTIMATE_TEST("88 Kurfürstendamm, Berlin, Germany")');
        console.log('=====================================\n');
    }

    // Main initialization
    async initialize() {
        console.log('🛠️ ULTIMATE FIXER: Initializing comprehensive solution...');
        
        try {
            // Step 1: Check prerequisites
            await this.checkPrerequisites();
            
            // Step 2: Check fields and attributes
            const fields = this.checkFormFields();
            this.checkFieldAttributes(fields);
            
            // Step 3: Test Google API
            await this.testGoogleAPI();
            
            // Step 4: Attach robust listeners
            this.attachRobustListeners(fields);
            
            // Step 5: Generate diagnostic report
            this.generateDiagnosticReport();
            
            console.log('🎉 ULTIMATE FIXER: Initialization complete!');
            
        } catch (error) {
            console.log('❌ ULTIMATE FIXER: Initialization failed:', error.message);
        }
    }
}

// Global instance and functions
window.ultimateAddressFixer = new UltimateAddressFixer();

// Global test function
window.ULTIMATE_TEST = async function(address) {
    if (!address) {
        address = document.getElementById('officeAddress')?.value;
    }
    if (!address) {
        console.log('❌ No address provided for testing');
        return;
    }
    
    console.log('🧪 ULTIMATE TEST: Starting manual test...');
    await window.ultimateAddressFixer.processAddressWithDiagnostics(address);
};

// Auto-initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => window.ultimateAddressFixer.initialize(), 1000);
    });
} else {
    setTimeout(() => window.ultimateAddressFixer.initialize(), 1000);
}

console.log('🛠️ ULTIMATE ADDRESS FIXER LOADED');
console.log('💡 Manual test: window.ULTIMATE_TEST("Your Address Here")'); 
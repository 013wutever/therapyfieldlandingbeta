// ========== BULLETPROOF ADDRESS FIXER ==========
// Comprehensive solution that fixes all possible issues

console.log('🛡️ BULLETPROOF ADDRESS FIXER: Loading comprehensive solution...');

class BulletproofAddressFixer {
    constructor() {
        this.isReady = false;
        this.geocoder = null;
        this.debugMode = true;
        this.initializeWhenReady();
    }

    // Wait for everything to be ready
    async initializeWhenReady() {
        console.log('🛡️ Waiting for Google Maps to be ready...');
        
        // Wait for Google Maps
        await this.waitForGoogle();
        
        // Initialize geocoder
        this.geocoder = new google.maps.Geocoder();
        
        // Wait for DOM
        await this.waitForDOM();
        
        this.isReady = true;
        console.log('✅ Bulletproof address fixer ready!');
    }

    // Wait for Google Maps API
    waitForGoogle() {
        return new Promise((resolve) => {
            const checkGoogle = () => {
                if (typeof google !== 'undefined' && google.maps && google.maps.Geocoder) {
                    console.log('✅ Google Maps API ready');
                    resolve();
                } else {
                    console.log('⏳ Waiting for Google Maps...');
                    setTimeout(checkGoogle, 500);
                }
            };
            checkGoogle();
        });
    }

    // Wait for DOM to be ready
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    // Bulletproof address analysis
    async analyzeAddress(address) {
        console.log(`🛡️ BULLETPROOF: Analyzing "${address}"`);
        
        if (!this.isReady) {
            console.log('⏳ Not ready yet, waiting...');
            await this.initializeWhenReady();
        }

        if (!address || address.length < 3) {
            throw new Error('Address too short');
        }

        try {
            // Method 1: Try geocoding
            const geocodeResult = await this.tryGeocode(address);
            if (geocodeResult.success) {
                console.log('✅ Geocoding successful');
                return geocodeResult;
            }

            // Method 2: Try Places service
            console.log('🔄 Geocoding failed, trying Places...');
            const placesResult = await this.tryPlacesService(address);
            if (placesResult.success) {
                console.log('✅ Places service successful');
                return placesResult;
            }

            // Method 3: Fallback parsing
            console.log('🔄 Places failed, using fallback...');
            return this.fallbackParsing(address);

        } catch (error) {
            console.log('❌ All methods failed:', error);
            return this.fallbackParsing(address);
        }
    }

    // Try Google Geocoding
    async tryGeocode(address) {
        try {
            const results = await new Promise((resolve, reject) => {
                this.geocoder.geocode(
                    { address: address },
                    (results, status) => {
                        if (status === 'OK' && results && results.length > 0) {
                            resolve(results);
                        } else {
                            reject(new Error(`Geocoding status: ${status}`));
                        }
                    }
                );
            });

            const place = results[0];
            console.log('🛡️ Geocoding result:', place);

            const components = this.parseGoogleComponents(place.address_components);
            
            return {
                success: true,
                method: 'geocoding',
                country: components.country,
                city: components.city,
                area: components.area,
                postalCode: components.postalCode,
                formattedAddress: place.formatted_address
            };

        } catch (error) {
            console.log('❌ Geocoding failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Try Places service as backup
    async tryPlacesService(address) {
        try {
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            
            const results = await new Promise((resolve, reject) => {
                service.textSearch(
                    { query: address },
                    (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                            resolve(results);
                        } else {
                            reject(new Error(`Places status: ${status}`));
                        }
                    }
                );
            });

            const place = results[0];
            console.log('🛡️ Places result:', place);

            // Get detailed info
            const details = await new Promise((resolve, reject) => {
                service.getDetails(
                    { placeId: place.place_id },
                    (place, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            resolve(place);
                        } else {
                            reject(new Error(`Place details status: ${status}`));
                        }
                    }
                );
            });

            const components = this.parseGoogleComponents(details.address_components);
            
            return {
                success: true,
                method: 'places',
                country: components.country,
                city: components.city,
                area: components.area,
                postalCode: components.postalCode,
                formattedAddress: details.formatted_address
            };

        } catch (error) {
            console.log('❌ Places service failed:', error);
            return { success: false, error: error.message };
        }
    }

    // Comprehensive Google component parsing
    parseGoogleComponents(addressComponents) {
        console.log('🛡️ Parsing address components...');
        
        const components = {
            country: null,
            city: null,
            area: null,
            postalCode: null
        };

        // Log all components for debugging
        if (this.debugMode) {
            console.log('🛡️ All components:');
            addressComponents.forEach((component, index) => {
                console.log(`  ${index + 1}. "${component.long_name}" - [${component.types.join(', ')}]`);
            });
        }

        addressComponents.forEach((component) => {
            const types = component.types;
            const longName = component.long_name;

            // Country - highest priority
            if (types.includes('country')) {
                components.country = longName;
                console.log(`🛡️ SET COUNTRY: ${longName}`);
            }

            // City - try multiple types in order of preference
            else if (types.includes('locality') && !components.city) {
                components.city = longName;
                console.log(`🛡️ SET CITY (locality): ${longName}`);
            }
            else if (types.includes('sublocality_level_1') && !components.city) {
                components.city = longName;
                console.log(`🛡️ SET CITY (sublocality_1): ${longName}`);
            }
            else if (types.includes('administrative_area_level_3') && !components.city) {
                components.city = longName;
                console.log(`🛡️ SET CITY (admin_3): ${longName}`);
            }
            else if (types.includes('administrative_area_level_2') && !components.city) {
                components.city = longName;
                console.log(`🛡️ SET CITY (admin_2): ${longName}`);
            }

            // Area - try multiple types
            else if (types.includes('sublocality') && !components.area) {
                components.area = longName;
                console.log(`🛡️ SET AREA (sublocality): ${longName}`);
            }
            else if (types.includes('sublocality_level_1') && !components.area && components.city !== longName) {
                components.area = longName;
                console.log(`🛡️ SET AREA (sublocality_1): ${longName}`);
            }
            else if (types.includes('sublocality_level_2') && !components.area) {
                components.area = longName;
                console.log(`🛡️ SET AREA (sublocality_2): ${longName}`);
            }
            else if (types.includes('neighborhood') && !components.area) {
                components.area = longName;
                console.log(`🛡️ SET AREA (neighborhood): ${longName}`);
            }
            else if (types.includes('administrative_area_level_4') && !components.area) {
                components.area = longName;
                console.log(`🛡️ SET AREA (admin_4): ${longName}`);
            }
            else if (types.includes('administrative_area_level_5') && !components.area) {
                components.area = longName;
                console.log(`🛡️ SET AREA (admin_5): ${longName}`);
            }

            // Postal code
            else if (types.includes('postal_code') && !components.postalCode) {
                components.postalCode = longName;
                console.log(`🛡️ SET POSTAL CODE: ${longName}`);
            }
        });

        console.log('🛡️ Final components:', components);
        return components;
    }

    // Fallback parsing using patterns
    fallbackParsing(address) {
        console.log('🛡️ Using fallback parsing...');
        
        const addressLower = address.toLowerCase();
        const parts = address.split(',').map(p => p.trim());

        // Basic patterns
        const patterns = {
            'germany': { country: 'Germany', cities: ['berlin', 'hamburg', 'munich'] },
            'greece': { country: 'Greece', cities: ['athens', 'thessaloniki'] },
            'italy': { country: 'Italy', cities: ['rome', 'milan', 'naples'] },
            'france': { country: 'France', cities: ['paris', 'lyon', 'marseille'] },
            'united kingdom': { country: 'United Kingdom', cities: ['london', 'manchester'] }
        };

        let detectedCountry = null;
        let detectedCity = null;
        let detectedArea = null;

        // Detect country and city
        for (const [key, data] of Object.entries(patterns)) {
            if (addressLower.includes(key)) {
                detectedCountry = data.country;
                
                // Find city
                for (const city of data.cities) {
                    if (addressLower.includes(city)) {
                        detectedCity = city.charAt(0).toUpperCase() + city.slice(1);
                        break;
                    }
                }
                break;
            }
        }

        // Try to extract area
        if (parts.length >= 3 && detectedCity) {
            const cityLower = detectedCity.toLowerCase();
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i].trim();
                if (part.toLowerCase().includes(cityLower)) {
                    // Area might be before the city
                    if (i > 0) {
                        const potentialArea = parts[i - 1].trim();
                        if (!potentialArea.match(/^\d+/) && potentialArea.length < 30) {
                            detectedArea = potentialArea;
                        }
                    }
                    break;
                }
            }
        }

        return {
            success: detectedCountry !== null,
            method: 'fallback',
            country: detectedCountry,
            city: detectedCity,
            area: detectedArea,
            postalCode: null,
            formattedAddress: address
        };
    }

    // Bulletproof form filling
    async fillFormFields(analysis) {
        console.log('🛡️ Filling form fields...');
        
        if (!analysis.success) {
            console.log('❌ Analysis failed, cannot fill fields');
            return false;
        }

        // Wait for fields to exist
        const fields = await this.waitForFormFields();
        
        if (!fields.country || !fields.city || !fields.area) {
            console.log('❌ Some form fields not found');
            return false;
        }

        try {
            // Fill with animation and feedback
            if (analysis.country) {
                fields.country.value = analysis.country;
                fields.country.style.backgroundColor = '#F0FDF4';
                fields.country.style.transition = 'background-color 0.3s ease';
                console.log(`✅ Filled country: ${analysis.country}`);
            }

            if (analysis.city) {
                fields.city.value = analysis.city;
                fields.city.style.backgroundColor = '#F0FDF4';
                fields.city.style.transition = 'background-color 0.3s ease';
                console.log(`✅ Filled city: ${analysis.city}`);
            }

            if (analysis.area) {
                fields.area.value = analysis.area;
                fields.area.style.backgroundColor = '#F0FDF4';
                fields.area.style.transition = 'background-color 0.3s ease';
                console.log(`✅ Filled area: ${analysis.area}`);
            }

            // Show success message
            this.showSuccessMessage(analysis);
            
            return true;

        } catch (error) {
            console.log('❌ Error filling fields:', error);
            return false;
        }
    }

    // Wait for form fields to exist
    async waitForFormFields() {
        return new Promise((resolve) => {
            const checkFields = () => {
                const country = document.getElementById('country');
                const city = document.getElementById('city');
                const area = document.getElementById('area');
                
                if (country && city && area) {
                    console.log('✅ All form fields found');
                    resolve({ country, city, area });
                } else {
                    console.log('⏳ Waiting for form fields...');
                    setTimeout(checkFields, 100);
                }
            };
            checkFields();
        });
    }

    // Show success message
    showSuccessMessage(analysis) {
        let msg = document.getElementById('bulletproof-success');
        if (!msg) {
            msg = document.createElement('div');
            msg.id = 'bulletproof-success';
            msg.className = 'mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700';
            document.getElementById('officeAddress').parentNode.appendChild(msg);
        }

        msg.innerHTML = `
            <div class="flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span><strong>🛡️ Bulletproof analysis complete!</strong> ${analysis.country}${analysis.city ? ', ' + analysis.city : ''}${analysis.area ? ', ' + analysis.area : ''} (${analysis.method})</span>
            </div>
        `;

        // Auto-hide
        setTimeout(() => {
            if (msg.parentNode) {
                msg.style.opacity = '0';
                setTimeout(() => msg.remove(), 500);
            }
        }, 8000);
    }
}

// Global instance
window.bulletproofAddressFixer = new BulletproofAddressFixer();

// Main function to analyze and fill
window.BULLETPROOF_ANALYZE_AND_FILL = async function(address) {
    console.log('🛡️ BULLETPROOF: Starting comprehensive analysis...');
    
    try {
        const analysis = await window.bulletproofAddressFixer.analyzeAddress(address);
        const filled = await window.bulletproofAddressFixer.fillFormFields(analysis);
        
        console.log('🛡️ BULLETPROOF: Complete!');
        console.log(`   Success: ${analysis.success}`);
        console.log(`   Country: ${analysis.country || 'NOT FOUND'}`);
        console.log(`   City: ${analysis.city || 'NOT FOUND'}`);
        console.log(`   Area: ${analysis.area || 'NOT FOUND'}`);
        console.log(`   Fields filled: ${filled}`);
        
        return analysis;
        
    } catch (error) {
        console.log('❌ BULLETPROOF error:', error);
        return { success: false, error: error.message };
    }
};

// Test function
window.testBulletproofFixer = async function() {
    console.log('🧪 TESTING: Bulletproof address fixer...');
    
    const testAddresses = [
        "88 Kurfürstendamm, Charlottenburg, Berlin 10709, Germany",
        "15 Irinis Street, Zografou, Athens 15772, Greece",
        "Via del Corso 45, Centro Storico, Rome 00186, Italy"
    ];
    
    for (const address of testAddresses) {
        console.log(`\n🧪 Testing: "${address}"`);
        await window.BULLETPROOF_ANALYZE_AND_FILL(address);
    }
};

console.log('🛡️ BULLETPROOF ADDRESS FIXER LOADED');
console.log('💡 Test: await window.testBulletproofFixer()');
console.log('💡 Analyze: await window.BULLETPROOF_ANALYZE_AND_FILL("your address")'); 
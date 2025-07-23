// ========== GOOGLE-ENHANCED ADDRESS EXTRACTOR ==========
// Uses Google's Geocoding API for reliable address component extraction

console.log('🌐 GOOGLE-ENHANCED ADDRESS EXTRACTOR: Loading Google-powered address analysis...');

class GoogleEnhancedAddressExtractor {
    constructor() {
        this.geocoder = null;
        this.initializeGeocoder();
    }

    // Initialize Google Geocoder
    initializeGeocoder() {
        if (typeof google !== 'undefined' && google.maps) {
            this.geocoder = new google.maps.Geocoder();
            console.log('✅ Google Geocoder initialized');
        } else {
            console.log('⚠️ Google Maps not available, retrying...');
            setTimeout(() => this.initializeGeocoder(), 1000);
        }
    }

    // Main extraction method using Google Geocoding API
    async extractAddressComponents(address) {
        console.log(`🌐 GOOGLE EXTRACTION: Analyzing "${address}"`);
        
        if (!address || address.trim().length < 5) {
            return {
                success: false,
                error: 'Address too short',
                country: null,
                city: null,
                area: null,
                postalCode: null
            };
        }

        if (!this.geocoder) {
            console.log('⚠️ Google Geocoder not ready, trying fallback...');
            return this.fallbackExtraction(address);
        }

        try {
            // Use Google Geocoding API
            const results = await this.geocodeAddress(address);
            
            if (!results || results.length === 0) {
                console.log('❌ No results from Google Geocoding');
                return this.fallbackExtraction(address);
            }

            const place = results[0];
            console.log('🌐 Google result:', place);

            // Extract components from Google's detailed response
            const components = this.parseGoogleComponents(place.address_components);
            
            console.log('🌐 Parsed components:', components);

            return {
                success: true,
                error: null,
                country: components.country,
                city: components.city,
                area: components.area,
                postalCode: components.postalCode,
                formattedAddress: place.formatted_address,
                coordinates: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                }
            };

        } catch (error) {
            console.log('❌ Google geocoding error:', error);
            return this.fallbackExtraction(address);
        }
    }

    // Promise wrapper for Google Geocoding
    geocodeAddress(address) {
        return new Promise((resolve, reject) => {
            this.geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK') {
                    resolve(results);
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });
    }

    // Parse Google's address components into our format
    parseGoogleComponents(addressComponents) {
        console.log('🌐 Parsing Google address components...');
        
        const components = {
            country: null,
            city: null,
            area: null,
            postalCode: null
        };

        addressComponents.forEach(component => {
            const types = component.types;
            const longName = component.long_name;
            const shortName = component.short_name;
            
            console.log(`   Component: "${longName}" - Types: ${types.join(', ')}`);

            // Country
            if (types.includes('country')) {
                components.country = longName;
            }
            
            // City - multiple possible types
            else if (types.includes('locality')) {
                components.city = longName;
            }
            else if (types.includes('administrative_area_level_3') && !components.city) {
                components.city = longName;
            }
            
            // Area/Neighborhood - multiple possible types  
            else if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
                components.area = longName;
            }
            else if (types.includes('neighborhood')) {
                components.area = longName;
            }
            else if (types.includes('administrative_area_level_4')) {
                components.area = longName;
            }
            else if (types.includes('administrative_area_level_5')) {
                components.area = longName;
            }
            
            // Postal Code
            else if (types.includes('postal_code')) {
                components.postalCode = longName;
            }
            
            // If no city found yet, try administrative areas
            else if (types.includes('administrative_area_level_2') && !components.city) {
                components.city = longName;
            }
            else if (types.includes('administrative_area_level_1') && !components.city && !components.area) {
                // Sometimes this might be state/region, but could be city in some countries
                if (longName.length < 30) { // Reasonable city name length
                    components.city = longName;
                }
            }
        });

        console.log(`🌐 Final parsed components:`, components);
        return components;
    }

    // Fallback extraction using basic patterns (for when Google fails)
    fallbackExtraction(address) {
        console.log('🔧 Using fallback extraction...');
        
        const addressLower = address.toLowerCase();
        
        // Basic city detection
        const cityPatterns = {
            'Athens': 'Greece',
            'Berlin': 'Germany', 
            'Rome': 'Italy',
            'Paris': 'France',
            'London': 'United Kingdom'
        };
        
        let detectedCity = null;
        let detectedCountry = null;
        
        for (const [city, country] of Object.entries(cityPatterns)) {
            if (addressLower.includes(city.toLowerCase())) {
                detectedCity = city;
                detectedCountry = country;
                break;
            }
        }
        
        // Try to extract area from address parts
        const parts = address.split(',').map(p => p.trim());
        let detectedArea = null;
        
        if (parts.length >= 3 && detectedCity) {
            // Usually area is before the city
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i].trim();
                if (part.toLowerCase() === detectedCity.toLowerCase()) {
                    // Area might be the previous part
                    if (i > 0 && !parts[i-1].match(/^\d+/)) { // Not a street number
                        detectedArea = parts[i-1].trim();
                    }
                    break;
                }
            }
        }
        
        return {
            success: detectedCountry !== null,
            error: detectedCountry ? null : 'Could not extract location components',
            country: detectedCountry,
            city: detectedCity,
            area: detectedArea,
            postalCode: null,
            formattedAddress: address
        };
    }
}

// Global instance
window.googleEnhancedAddressExtractor = new GoogleEnhancedAddressExtractor();

// Enhanced analyze function for registration forms
window.analyzeAddressWithGoogle = async function(address) {
    console.log('🌐 GOOGLE ENHANCED: Starting address analysis...');
    
    if (!address || address.length < 5) {
        return {
            success: false,
            error: 'Address too short'
        };
    }
    
    try {
        const result = await window.googleEnhancedAddressExtractor.extractAddressComponents(address);
        
        console.log('🌐 GOOGLE ENHANCED: Analysis complete');
        console.log(`   Success: ${result.success}`);
        console.log(`   Country: ${result.country}`);
        console.log(`   City: ${result.city}`);
        console.log(`   Area: ${result.area}`);
        
        return result;
        
    } catch (error) {
        console.log('❌ Enhanced analysis error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Integration with Places Autocomplete
window.enhancePlacesAutocomplete = function(autocompleteInstance, addressFieldId) {
    console.log('🌐 GOOGLE ENHANCED: Enhancing Places Autocomplete...');
    
    if (!autocompleteInstance) {
        console.log('⚠️ No autocomplete instance provided');
        return;
    }
    
    autocompleteInstance.addListener('place_changed', async function() {
        const place = autocompleteInstance.getPlace();
        
        console.log('🌐 Places autocomplete selection:', place);
        
        if (place.address_components) {
            // Use detailed components from Places API
            const components = window.googleEnhancedAddressExtractor.parseGoogleComponents(place.address_components);
            
            const result = {
                success: true,
                error: null,
                country: components.country,
                city: components.city,
                area: components.area,
                postalCode: components.postalCode,
                formattedAddress: place.formatted_address,
                coordinates: place.geometry ? {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                } : null
            };
            
            console.log('🌐 Enhanced Places result:', result);
            
            // Trigger auto-fill event
            const addressField = document.getElementById(addressFieldId);
            if (addressField) {
                // Create custom event with enhanced data
                const enhancedEvent = new CustomEvent('enhancedAddressAnalyzed', {
                    detail: result
                });
                addressField.dispatchEvent(enhancedEvent);
            }
            
            return result;
        } else if (place.formatted_address) {
            // Fallback to geocoding if components not available
            console.log('🌐 Places result incomplete, using geocoding fallback...');
            return await window.analyzeAddressWithGoogle(place.formatted_address);
        }
    });
};

// Test function
window.testGoogleAddressExtraction = async function() {
    console.log('🧪 TESTING: Google-enhanced address extraction...');
    
    const testAddresses = [
        "88 Kurfürstendamm, Charlottenburg, Berlin 10709, Germany",
        "Via del Corso 45, Centro Storico, Rome 00186, Italy", 
        "25 Skoufa Street, Kolonaki, Athens 10673, Greece",
        "15 Irinis Street, Zografou, Athens 15772, Greece",
        "123 Champs-Élysées, 8th Arrondissement, Paris 75008, France"
    ];
    
    for (const address of testAddresses) {
        console.log(`\n🧪 Testing: "${address}"`);
        const result = await window.analyzeAddressWithGoogle(address);
        console.log(`   Result: ${result.country}, ${result.city}, ${result.area}`);
        console.log(`   Success: ${result.success}`);
    }
};

console.log('🌐 GOOGLE-ENHANCED ADDRESS EXTRACTOR LOADED');
console.log('💡 Test: window.testGoogleAddressExtraction()');
console.log('💡 Analyze: await window.analyzeAddressWithGoogle("your address")');
console.log('💡 Enhance autocomplete: window.enhancePlacesAutocomplete(autocomplete, "fieldId")'); 
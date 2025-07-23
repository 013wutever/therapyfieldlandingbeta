// ========== REGISTRATION ADDRESS EXTRACTOR ==========
// Automatically extracts Country, City, and Area during therapist registration

console.log('📝 REGISTRATION ADDRESS EXTRACTOR: Loading smart address analysis for registration...');

// Address analysis service for registration
class RegistrationAddressAnalyzer {
    constructor() {
        this.countryPatterns = {
            'Greece': {
                cities: ['athens', 'thessaloniki', 'patras', 'piraeus', 'larissa', 'volos', 'heraklion'],
                postalCodes: /\b(1[0-7][0-9]{3}|2[0-9]{4}|3[0-9]{4}|4[0-9]{4}|5[0-9]{4}|6[0-9]{4}|7[0-3][0-9]{3})\b/,
                streetPatterns: ['odos', 'leoforos', 'plateia'],
                language: 'greek'
            },
            'Germany': {
                cities: ['berlin', 'hamburg', 'munich', 'cologne', 'frankfurt', 'düsseldorf', 'dortmund', 'essen', 'leipzig', 'bremen'],
                postalCodes: /\b([0-9]{5})\b/,
                streetPatterns: ['straße', 'strasse', 'platz', 'weg', 'allee', 'gasse'],
                language: 'german'
            },
            'Italy': {
                cities: ['rome', 'milan', 'naples', 'turin', 'florence', 'bologna', 'venice', 'genoa', 'palermo'],
                postalCodes: /\b([0-9]{5})\b/,
                streetPatterns: ['via', 'piazza', 'corso', 'viale', 'largo'],
                language: 'italian'
            },
            'France': {
                cities: ['paris', 'marseille', 'lyon', 'toulouse', 'nice', 'nantes', 'bordeaux', 'lille', 'rennes'],
                postalCodes: /\b([0-9]{5})\b/,
                streetPatterns: ['rue', 'avenue', 'boulevard', 'place', 'quai'],
                language: 'french'
            },
            'United Kingdom': {
                cities: ['london', 'birmingham', 'manchester', 'glasgow', 'liverpool', 'edinburgh', 'cardiff', 'bristol', 'leeds'],
                postalCodes: /\b([A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})\b/i,
                streetPatterns: ['street', 'road', 'avenue', 'lane', 'crescent', 'square'],
                language: 'english'
            }
        };
    }

    // Main extraction method for registration
    extractAddressComponents(fullAddress) {
        console.log(`📝 ANALYZING: "${fullAddress}"`);
        
        if (!fullAddress || fullAddress.trim().length === 0) {
            return {
                country: null,
                city: null,
                area: null,
                postalCode: null,
                error: 'No address provided'
            };
        }

        const addressLower = fullAddress.toLowerCase().trim();
        const addressParts = fullAddress.split(',').map(part => part.trim());
        
        console.log(`📝 Address parts: ${JSON.stringify(addressParts)}`);

        // Step 1: Detect country
        const detectedCountry = this.detectCountry(addressLower, addressParts);
        if (!detectedCountry) {
            return {
                country: null,
                city: null,
                area: null,
                postalCode: null,
                error: 'Could not determine country'
            };
        }

        console.log(`📝 Detected country: ${detectedCountry}`);

        // Step 2: Extract postal code
        const postalCode = this.extractPostalCode(addressLower, detectedCountry);
        console.log(`📝 Postal code: ${postalCode || 'not found'}`);

        // Step 3: Extract city and area
        const cityArea = this.extractCityAndArea(addressParts, detectedCountry);
        console.log(`📝 City: ${cityArea.city}, Area: ${cityArea.area}`);

        return {
            country: detectedCountry,
            city: cityArea.city,
            area: cityArea.area,
            postalCode: postalCode,
            countryKey: detectedCountry.toLowerCase().replace(/\s+/g, '_'),
            cityKey: cityArea.city ? cityArea.city.toLowerCase().replace(/\s+/g, '_') : null,
            areaKey: cityArea.area ? cityArea.area.toLowerCase().replace(/\s+/g, '_') : null,
            error: null
        };
    }

    // Detect country from address
    detectCountry(addressLower, addressParts) {
        // Method 1: Look for explicit country mentions
        for (const [country, patterns] of Object.entries(this.countryPatterns)) {
            if (addressLower.includes(country.toLowerCase())) {
                return country;
            }
        }

        // Method 2: Look for cities
        for (const [country, patterns] of Object.entries(this.countryPatterns)) {
            for (const city of patterns.cities) {
                if (addressLower.includes(city)) {
                    console.log(`📝 Country detected from city "${city}": ${country}`);
                    return country;
                }
            }
        }

        // Method 3: Look for postal code patterns
        for (const [country, patterns] of Object.entries(this.countryPatterns)) {
            if (patterns.postalCodes.test(addressLower)) {
                console.log(`📝 Country detected from postal code pattern: ${country}`);
                return country;
            }
        }

        // Method 4: Look for street patterns
        for (const [country, patterns] of Object.entries(this.countryPatterns)) {
            for (const streetPattern of patterns.streetPatterns) {
                if (addressLower.includes(streetPattern)) {
                    console.log(`📝 Country detected from street pattern "${streetPattern}": ${country}`);
                    return country;
                }
            }
        }

        return null;
    }

    // Extract postal code
    extractPostalCode(addressLower, country) {
        const pattern = this.countryPatterns[country].postalCodes;
        const match = addressLower.match(pattern);
        return match ? match[1] || match[0] : null;
    }

    // Extract city and area from address parts
    extractCityAndArea(addressParts, country) {
        const knownCities = this.countryPatterns[country].cities;
        let detectedCity = null;
        let detectedArea = null;

        // Look for known cities in address parts
        for (const part of addressParts) {
            const partLower = part.toLowerCase().trim();
            
            // Check if this part contains a known city
            for (const city of knownCities) {
                if (partLower.includes(city)) {
                    detectedCity = this.capitalize(city);
                    
                    // If the part has more than just the city, extract the area
                    const cityIndex = partLower.indexOf(city);
                    const beforeCity = partLower.substring(0, cityIndex).trim();
                    const afterCity = partLower.substring(cityIndex + city.length).trim();
                    
                    // Area is usually before the city in European addresses
                    if (beforeCity && !this.isPostalCode(beforeCity)) {
                        detectedArea = this.capitalize(beforeCity);
                    } else if (afterCity && !this.isPostalCode(afterCity)) {
                        detectedArea = this.capitalize(afterCity);
                    }
                    
                    break;
                }
            }
            
            if (detectedCity) break;
        }

        // If no known city found, try to extract from address structure
        if (!detectedCity && addressParts.length >= 2) {
            // Often the last part with postal code contains the city
            const lastPart = addressParts[addressParts.length - 1];
            const cityMatch = lastPart.match(/([a-zA-Z\s]+)\s+\d+/);
            if (cityMatch) {
                detectedCity = this.capitalize(cityMatch[1].trim());
            }
            
            // Area might be in the second-to-last part
            if (addressParts.length >= 3) {
                const areaPart = addressParts[addressParts.length - 2];
                if (!this.isPostalCode(areaPart) && !areaPart.toLowerCase().includes('street') && !areaPart.toLowerCase().includes('avenue')) {
                    detectedArea = this.capitalize(areaPart);
                }
            }
        }

        return {
            city: detectedCity,
            area: detectedArea
        };
    }

    // Helper methods
    capitalize(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    isPostalCode(str) {
        return /^\d+$/.test(str.trim()) || /^[A-Z0-9\s]+$/i.test(str.trim());
    }
}

// Global instance for registration use
window.registrationAddressAnalyzer = new RegistrationAddressAnalyzer();

// Integration with registration form
window.analyzeRegistrationAddress = function(addressInput) {
    console.log('📝 REGISTRATION: Analyzing address for auto-fill...');
    
    const analysis = window.registrationAddressAnalyzer.extractAddressComponents(addressInput);
    
    if (analysis.error) {
        console.log(`❌ Analysis error: ${analysis.error}`);
        return analysis;
    }
    
    console.log('📝 REGISTRATION: Address analysis complete');
    console.log(`   Country: ${analysis.country}`);
    console.log(`   City: ${analysis.city}`);
    console.log(`   Area: ${analysis.area}`);
    console.log(`   Postal Code: ${analysis.postalCode}`);
    
    // Auto-fill the registration form fields
    if (analysis.country) {
        const countryField = document.getElementById('therapist-country') || document.querySelector('[name="country"]');
        if (countryField) {
            countryField.value = analysis.country;
            console.log(`✅ Auto-filled country: ${analysis.country}`);
        }
    }
    
    if (analysis.city) {
        const cityField = document.getElementById('therapist-city') || document.querySelector('[name="city"]');
        if (cityField) {
            cityField.value = analysis.city;
            console.log(`✅ Auto-filled city: ${analysis.city}`);
        }
    }
    
    if (analysis.area) {
        const areaField = document.getElementById('therapist-area') || document.querySelector('[name="area"]');
        if (areaField) {
            areaField.value = analysis.area;
            console.log(`✅ Auto-filled area: ${analysis.area}`);
        }
    }
    
    return analysis;
};

// Auto-analyze when address field changes
window.setupRegistrationAddressAnalysis = function() {
    console.log('📝 REGISTRATION: Setting up auto address analysis...');
    
    const addressField = document.getElementById('therapist-address') || 
                         document.querySelector('[name="address"]') ||
                         document.querySelector('input[placeholder*="address"]');
    
    if (addressField) {
        console.log('📝 Found address field, adding auto-analysis');
        
        // Analyze on blur (when user finishes typing)
        addressField.addEventListener('blur', function() {
            const address = this.value.trim();
            if (address.length > 10) { // Only analyze substantial addresses
                console.log('📝 Address field changed, analyzing...');
                window.analyzeRegistrationAddress(address);
            }
        });
        
        // Also analyze on Enter key
        addressField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const address = this.value.trim();
                if (address.length > 10) {
                    console.log('📝 Enter pressed, analyzing address...');
                    window.analyzeRegistrationAddress(address);
                }
            }
        });
        
        console.log('✅ Auto-analysis setup complete');
    } else {
        console.log('⚠️ Address field not found - manual setup required');
    }
};

// Test function for development
window.testRegistrationAddressExtraction = function() {
    console.log('🧪 TESTING: Registration address extraction...');
    
    const testAddresses = [
        "88 Kurfürstendamm, Charlottenburg, Berlin 10709",
        "Via del Corso 45, Centro Storico, Rome 00186",
        "25 Skoufa Street, Kolonaki, Athens 10673",
        "15 Irinis Street, Zografou, Athens 15772",
        "123 Champs-Élysées, 8th Arrondissement, Paris 75008"
    ];
    
    testAddresses.forEach(address => {
        console.log(`\n🧪 Testing: "${address}"`);
        const result = window.registrationAddressAnalyzer.extractAddressComponents(address);
        console.log(`   Result: ${result.country}, ${result.city}, ${result.area}`);
    });
};

// Auto-setup when page loads (for registration pages)
setTimeout(() => {
    if (document.readyState === 'complete') {
        window.setupRegistrationAddressAnalysis();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            window.setupRegistrationAddressAnalysis();
        });
    }
}, 1000);

console.log('📝 REGISTRATION ADDRESS EXTRACTOR LOADED');
console.log('💡 Test: window.testRegistrationAddressExtraction()');
console.log('💡 Analyze: window.analyzeRegistrationAddress("your address")');
console.log('💡 Setup: window.setupRegistrationAddressAnalysis()'); 
// ========== ADDRESS COMPONENT ANALYZER ==========
// Tests what Google address components are most reliably available

console.log('🔍 ADDRESS ANALYZER: Loading component reliability tester...');

class AddressComponentAnalyzer {
    constructor() {
        this.testAddresses = [
            // Major cities worldwide
            'Berlin, Germany',
            'Paris, France', 
            'London, UK',
            'New York, USA',
            'Tokyo, Japan',
            'Sydney, Australia',
            'Athens, Greece',
            'Rome, Italy',
            'Madrid, Spain',
            'Moscow, Russia',
            'Bangkok, Thailand',
            'Cairo, Egypt',
            'Lagos, Nigeria',
            'São Paulo, Brazil',
            'Mumbai, India',
            'Beijing, China',
            
            // Specific addresses
            '1600 Pennsylvania Avenue, Washington DC, USA',
            '10 Downing Street, London, UK',
            'Champs-Élysées, Paris, France',
            'Times Square, New York, USA',
            'Red Square, Moscow, Russia',
            'Alexanderplatz, Berlin, Germany',
            'Syntagma Square, Athens, Greece',
            'Piazza del Colosseo, Rome, Italy',
            
            // Rural/smaller locations
            'Small Town, Vermont, USA',
            'Rural Road, Countryside, UK',
            'Village, Provence, France',
            'Hamlet, Bavaria, Germany'
        ];
        
        this.componentFrequency = {};
        this.results = [];
    }

    // Test a single address
    async testAddress(address) {
        return new Promise((resolve) => {
            const geocoder = new google.maps.Geocoder();
            
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK' && results && results.length > 0) {
                    const place = results[0];
                    const components = {};
                    
                    place.address_components.forEach(component => {
                        component.types.forEach(type => {
                            components[type] = component.long_name;
                        });
                    });
                    
                    resolve({
                        address: address,
                        success: true,
                        components: components,
                        componentTypes: Object.keys(components)
                    });
                } else {
                    resolve({
                        address: address,
                        success: false,
                        error: status
                    });
                }
            });
        });
    }

    // Test all addresses and analyze frequency
    async analyzeAllAddresses() {
        console.log('🔍 ANALYZER: Testing', this.testAddresses.length, 'addresses...');
        
        this.results = [];
        this.componentFrequency = {};
        
        for (let i = 0; i < this.testAddresses.length; i++) {
            const address = this.testAddresses[i];
            console.log(`${i + 1}/${this.testAddresses.length}: Testing "${address}"`);
            
            try {
                const result = await this.testAddress(address);
                this.results.push(result);
                
                if (result.success) {
                    // Count frequency of each component type
                    result.componentTypes.forEach(type => {
                        this.componentFrequency[type] = (this.componentFrequency[type] || 0) + 1;
                    });
                }
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
                
            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
                this.results.push({
                    address: address,
                    success: false,
                    error: error.message
                });
            }
        }
        
        console.log('✅ ANALYZER: Testing complete!');
        this.generateReport();
    }

    // Generate comprehensive report
    generateReport() {
        const totalAddresses = this.results.filter(r => r.success).length;
        
        console.log('\n📊 ADDRESS COMPONENT RELIABILITY REPORT');
        console.log('==========================================');
        console.log(`✅ Successfully analyzed: ${totalAddresses} addresses`);
        console.log(`❌ Failed: ${this.results.length - totalAddresses} addresses\n`);
        
        // Sort components by frequency (reliability)
        const sortedComponents = Object.entries(this.componentFrequency)
            .sort(([,a], [,b]) => b - a)
            .map(([type, count]) => ({
                type,
                count,
                percentage: Math.round((count / totalAddresses) * 100)
            }));
        
        console.log('📈 COMPONENT RELIABILITY (sorted by frequency):');
        console.log('---------------------------------------------');
        
        sortedComponents.forEach((comp, i) => {
            const reliability = comp.percentage >= 95 ? '🟢 EXCELLENT' :
                              comp.percentage >= 80 ? '🟡 GOOD' :
                              comp.percentage >= 60 ? '🟠 MODERATE' : '🔴 POOR';
            
            console.log(`${i + 1}. ${comp.type.padEnd(30)} ${comp.count}/${totalAddresses} (${comp.percentage}%) ${reliability}`);
        });
        
        console.log('\n🎯 RECOMMENDATIONS:');
        console.log('-------------------');
        
        // Find best options for the third field
        const excellentComponents = sortedComponents.filter(c => c.percentage >= 95);
        const goodComponents = sortedComponents.filter(c => c.percentage >= 80 && c.percentage < 95);
        
        console.log('✅ MOST RELIABLE (95%+):');
        excellentComponents.forEach(comp => {
            console.log(`   • ${comp.type} (${comp.percentage}%)`);
        });
        
        console.log('\n🟡 GOOD OPTIONS (80-94%):');
        goodComponents.forEach(comp => {
            console.log(`   • ${comp.type} (${comp.percentage}%)`);
        });
        
        // Specific recommendations for the third field
        console.log('\n💡 RECOMMENDED THIRD FIELD OPTIONS:');
        
        const recommendations = [
            { type: 'administrative_area_level_1', name: 'State/Province', description: 'Best for major regions' },
            { type: 'administrative_area_level_2', name: 'County/Region', description: 'Good fallback option' },
            { type: 'postal_code', name: 'Postal Code', description: 'Very reliable but less user-friendly' },
            { type: 'sublocality_level_1', name: 'District/Neighborhood', description: 'Good for urban areas' },
            { type: 'route', name: 'Street Name', description: 'Always available but too specific' }
        ];
        
        recommendations.forEach(rec => {
            const freq = this.componentFrequency[rec.type] || 0;
            const percentage = Math.round((freq / totalAddresses) * 100);
            const status = percentage >= 80 ? '✅' : percentage >= 60 ? '🟡' : '❌';
            
            console.log(`   ${status} ${rec.name.padEnd(20)} ${percentage}% - ${rec.description}`);
        });
        
        console.log('\n🔧 BEST STRATEGY:');
        console.log('Use a fallback hierarchy: Try State → County → District → Postal Code');
        console.log('==========================================\n');
    }

    // Helper function to suggest the best field strategy
    suggestBestStrategy() {
        const strategy = this.findBestFallbackStrategy();
        
        console.log('🎯 SUGGESTED IMPLEMENTATION:');
        console.log('----------------------------');
        console.log('1. Primary: administrative_area_level_1 (State/Province)');
        console.log('2. Fallback 1: administrative_area_level_2 (County/Region)');  
        console.log('3. Fallback 2: sublocality_level_1 (District)');
        console.log('4. Fallback 3: postal_code (Postal Code)');
        console.log('\nThis ensures maximum coverage while maintaining useful information.');
    }

    // Find detailed component breakdown for sample addresses
    showDetailedExamples() {
        console.log('\n📍 DETAILED EXAMPLES:');
        console.log('---------------------');
        
        this.results.slice(0, 5).forEach(result => {
            if (result.success) {
                console.log(`\n📍 ${result.address}:`);
                Object.entries(result.components).forEach(([type, value]) => {
                    console.log(`   ${type.padEnd(25)} → "${value}"`);
                });
            }
        });
    }
}

// Global instance and functions
window.addressComponentAnalyzer = new AddressComponentAnalyzer();

// Test function
window.ANALYZE_ADDRESS_COMPONENTS = async function() {
    console.log('🔍 STARTING: Comprehensive address component analysis...');
    
    // Check if Google is ready
    if (!window.google || !window.google.maps) {
        console.log('❌ Google Maps not loaded - cannot run analysis');
        return;
    }
    
    await window.addressComponentAnalyzer.analyzeAllAddresses();
    window.addressComponentAnalyzer.suggestBestStrategy();
    window.addressComponentAnalyzer.showDetailedExamples();
};

// Quick test with just a few addresses
window.QUICK_COMPONENT_TEST = async function() {
    console.log('⚡ QUICK TEST: Testing a few sample addresses...');
    
    const quickAddresses = [
        'Berlin, Germany',
        'Athens, Greece', 
        'New York, USA',
        'Tokyo, Japan',
        'London, UK'
    ];
    
    for (const address of quickAddresses) {
        const result = await window.addressComponentAnalyzer.testAddress(address);
        if (result.success) {
            console.log(`\n📍 ${address}:`);
            console.log('Available components:', result.componentTypes.join(', '));
        }
    }
};

console.log('🔍 ADDRESS COMPONENT ANALYZER LOADED');
console.log('💡 Run: window.ANALYZE_ADDRESS_COMPONENTS() for full analysis');
console.log('💡 Run: window.QUICK_COMPONENT_TEST() for quick test'); 
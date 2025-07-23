// ========== THERAPY SESSION COST CALCULATOR ==========
// Calculates approximate cost per session based on therapy services average

console.log('💰 COST CALCULATOR: Loading therapy session cost calculator...');

window.TherapySessionCostCalculator = {
    
    // Define which services are considered "therapy sessions"
    THERAPY_SESSION_SERVICES: [
        'in_person_therapy',
        'online_therapy'
    ],
    
    // Main function to update all therapist costs
    updateAllTherapistCosts: function() {
        console.log('💰 COST CALCULATOR: Updating all therapist session costs...');
        
        if (!window.therapistData || window.therapistData.length === 0) {
            console.log('❌ No therapist data available');
            return false;
        }
        
        let updatedCount = 0;
        let errorCount = 0;
        
        window.therapistData.forEach((therapist, index) => {
            try {
                const newCost = this.calculateTherapySessionCost(therapist);
                
                if (newCost !== null) {
                    const oldCost = therapist.cost;
                    therapist.cost = newCost;
                    
                    console.log(`💰 Updated: ${therapist.first_name} ${therapist.last_name} - €${oldCost} → €${newCost}`);
                    updatedCount++;
                } else {
                    console.log(`⚠️ No therapy sessions: ${therapist.first_name} ${therapist.last_name} - keeping original cost €${therapist.cost}`);
                }
            } catch (error) {
                console.error(`❌ Error updating ${therapist.first_name} ${therapist.last_name}:`, error);
                errorCount++;
            }
        });
        
        console.log(`📊 COST UPDATE SUMMARY:`);
        console.log(`   ✅ Updated: ${updatedCount} therapists`);
        console.log(`   ⚠️ No therapy sessions: ${window.therapistData.length - updatedCount - errorCount} therapists`);
        console.log(`   ❌ Errors: ${errorCount} therapists`);
        
        return true;
    },
    
    // Calculate therapy session cost for a single therapist
    calculateTherapySessionCost: function(therapist) {
        if (!therapist.services || typeof therapist.services !== 'object') {
            console.log(`⚠️ No services data for ${therapist.first_name} ${therapist.last_name}`);
            return null;
        }
        
        const availableTherapySessions = [];
        
        // Check each therapy session service
        this.THERAPY_SESSION_SERVICES.forEach(serviceKey => {
            const service = therapist.services[serviceKey];
            
            if (service && service.available === true && service.price && service.price > 0) {
                availableTherapySessions.push({
                    type: serviceKey,
                    price: service.price
                });
            }
        });
        
        if (availableTherapySessions.length === 0) {
            return null; // No therapy sessions available
        }
        
        // Calculate average
        const totalPrice = availableTherapySessions.reduce((sum, session) => sum + session.price, 0);
        const averagePrice = Math.round(totalPrice / availableTherapySessions.length);
        
        console.log(`💰 ${therapist.first_name} ${therapist.last_name}:`);
        availableTherapySessions.forEach(session => {
            const serviceType = session.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            console.log(`   ${serviceType}: €${session.price}`);
        });
        console.log(`   Average: €${averagePrice}`);
        
        return averagePrice;
    },
    
    // Get detailed cost breakdown for a therapist
    getTherapistCostBreakdown: function(therapistId) {
        const therapist = window.therapistData?.find(t => t.id === therapistId);
        if (!therapist) {
            console.log(`❌ Therapist with ID ${therapistId} not found`);
            return null;
        }
        
        const breakdown = {
            therapist: `${therapist.first_name} ${therapist.last_name}`,
            currentCost: therapist.cost,
            currency: therapist.currency || 'EUR',
            therapySessions: [],
            otherServices: [],
            calculatedAverage: null
        };
        
        if (therapist.services) {
            Object.entries(therapist.services).forEach(([serviceKey, service]) => {
                if (service && service.available === true && service.price && service.price > 0) {
                    const serviceInfo = {
                        type: serviceKey,
                        name: serviceKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                        price: service.price,
                        description: service.description || ''
                    };
                    
                    if (this.THERAPY_SESSION_SERVICES.includes(serviceKey)) {
                        breakdown.therapySessions.push(serviceInfo);
                    } else {
                        breakdown.otherServices.push(serviceInfo);
                    }
                }
            });
        }
        
        // Calculate average of therapy sessions
        if (breakdown.therapySessions.length > 0) {
            const total = breakdown.therapySessions.reduce((sum, session) => sum + session.price, 0);
            breakdown.calculatedAverage = Math.round(total / breakdown.therapySessions.length);
        }
        
        return breakdown;
    },
    
    // Display cost breakdown for all therapists
    displayAllCostBreakdowns: function() {
        console.log('💰 COST BREAKDOWN: Displaying all therapist cost breakdowns...');
        console.log('='.repeat(80));
        
        if (!window.therapistData || window.therapistData.length === 0) {
            console.log('❌ No therapist data available');
            return;
        }
        
        window.therapistData.forEach(therapist => {
            const breakdown = this.getTherapistCostBreakdown(therapist.id);
            if (breakdown) {
                console.log(`\n👨‍⚕️ ${breakdown.therapist}:`);
                console.log(`   Current Cost: €${breakdown.currentCost}`);
                
                if (breakdown.therapySessions.length > 0) {
                    console.log(`   Therapy Sessions:`);
                    breakdown.therapySessions.forEach(session => {
                        console.log(`     - ${session.name}: €${session.price}`);
                    });
                    console.log(`   → Calculated Average: €${breakdown.calculatedAverage}`);
                } else {
                    console.log(`   ⚠️ No therapy sessions available`);
                }
                
                if (breakdown.otherServices.length > 0) {
                    console.log(`   Other Services (excluded from average):`);
                    breakdown.otherServices.forEach(service => {
                        console.log(`     - ${service.name}: €${service.price}`);
                    });
                }
            }
        });
        
        console.log('='.repeat(80));
    },
    
    // Validate that all costs are properly calculated
    validateCosts: function() {
        console.log('🔍 COST VALIDATION: Checking all therapist costs...');
        
        let validCount = 0;
        let invalidCount = 0;
        const issues = [];
        
        window.therapistData.forEach(therapist => {
            const calculatedCost = this.calculateTherapySessionCost(therapist);
            
            if (calculatedCost !== null) {
                if (therapist.cost === calculatedCost) {
                    validCount++;
                } else {
                    invalidCount++;
                    issues.push({
                        therapist: `${therapist.first_name} ${therapist.last_name}`,
                        currentCost: therapist.cost,
                        expectedCost: calculatedCost
                    });
                }
            }
        });
        
        console.log(`📊 VALIDATION RESULTS:`);
        console.log(`   ✅ Valid: ${validCount} therapists`);
        console.log(`   ❌ Invalid: ${invalidCount} therapists`);
        
        if (issues.length > 0) {
            console.log(`\n🔧 ISSUES FOUND:`);
            issues.forEach(issue => {
                console.log(`   ${issue.therapist}: Current €${issue.currentCost}, Expected €${issue.expectedCost}`);
            });
        }
        
        return issues.length === 0;
    }
};

// Auto-run cost calculation when loaded
setTimeout(() => {
    console.log('💰 COST CALCULATOR: Auto-running therapy session cost calculation...');
    window.TherapySessionCostCalculator.updateAllTherapistCosts();
    
    // Display breakdown for verification
    window.TherapySessionCostCalculator.displayAllCostBreakdowns();
    
    // Validate results
    window.TherapySessionCostCalculator.validateCosts();
}, 1500);

console.log('💰 THERAPY SESSION COST CALCULATOR LOADED');
console.log('💡 Manual run: window.TherapySessionCostCalculator.updateAllTherapistCosts()');
console.log('💡 View breakdown: window.TherapySessionCostCalculator.displayAllCostBreakdowns()');
console.log('💡 Validate costs: window.TherapySessionCostCalculator.validateCosts()');
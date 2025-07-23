// LOCALSTORAGE INTEGRATION FIX - Ensuring registered therapists appear in find therapist steps
// This file addresses the specific issue where registered therapists don't show up

console.log('🔧 Loading localStorage Integration Fix...');

// STEP 1: Enhanced localStorage loading function with better error handling
window.forceLoadRegisteredTherapists = function() {
    console.log('🔄 FORCE LOADING: Starting enhanced localStorage integration...');
    
    try {
        // Check localStorage data
        const savedData = localStorage.getItem('therapistData');
        const savedCoordinates = localStorage.getItem('therapistCoordinates');
        
        console.log('📥 FORCE LOADING: localStorage check:', {
            therapistData: savedData ? 'EXISTS' : 'EMPTY',
            coordinates: savedCoordinates ? 'EXISTS' : 'EMPTY'
        });
        
        if (!savedData) {
            console.log('ℹ️ FORCE LOADING: No registered therapists found in localStorage');
            return [];
        }
        
        const registeredTherapists = JSON.parse(savedData);
        console.log(`📊 FORCE LOADING: Found ${registeredTherapists.length} registered therapists`);
        
        // Ensure window.therapistData exists
        if (!window.therapistData) {
            console.log('⚠️ FORCE LOADING: window.therapistData not found, initializing...');
            window.therapistData = [];
        }
        
        const originalCount = window.therapistData.length;
        console.log(`📈 FORCE LOADING: Current therapist count: ${originalCount}`);
        
        // Add registered therapists that aren't already in the main data
        let addedCount = 0;
        registeredTherapists.forEach(regTherapist => {
            const exists = window.therapistData.some(existing => existing.id === regTherapist.id);
            if (!exists) {
                // Ensure the therapist has all required fields for display
                const enhancedTherapist = {
                    ...regTherapist,
                    // Add any missing required fields with defaults
                    distance: regTherapist.distance || 0,
                    image: regTherapist.image || 'User Panel Media/therapist1.png',
                    cost: regTherapist.cost || 75,
                    currency: regTherapist.currency || 'EUR',
                    rating: regTherapist.rating || 4.5
                };
                
                window.therapistData.push(enhancedTherapist);
                addedCount++;
                console.log(`➕ FORCE LOADING: Added therapist ${enhancedTherapist.first_name} ${enhancedTherapist.last_name} (ID: ${enhancedTherapist.id})`);
            }
        });
        
        // Handle coordinates
        if (savedCoordinates) {
            const coordinates = JSON.parse(savedCoordinates);
            if (!window.therapistAddressCoordinates) {
                window.therapistAddressCoordinates = {};
            }
            
            Object.keys(coordinates).forEach(therapistId => {
                window.therapistAddressCoordinates[therapistId] = coordinates[therapistId];
            });
            console.log(`📍 FORCE LOADING: Updated coordinates for ${Object.keys(coordinates).length} therapists`);
        }
        
        console.log(`✅ FORCE LOADING: Integration complete - Added ${addedCount} therapists. Total: ${window.therapistData.length}`);
        return registeredTherapists;
        
    } catch (error) {
        console.error('❌ FORCE LOADING: Error during integration:', error);
        return [];
    }
};

// STEP 2: Force populate functions that guarantee cards are displayed
window.forcePopulateLocationStep = function() {
    console.log('🗺️ FORCE POPULATE: Starting location step population...');
    
    // First, force load registered therapists
    window.forceLoadRegisteredTherapists();
    
    const container = document.getElementById('therapist-cards-container');
    if (!container) {
        console.error('❌ FORCE POPULATE: Location container not found');
        return;
    }
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.error('❌ FORCE POPULATE: No therapist data available');
        container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No therapists available</div>';
        return;
    }
    
    console.log(`📊 FORCE POPULATE: Populating location with ${window.therapistData.length} therapists`);
    
    // Clear container
    container.innerHTML = '';
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    
    // Show first 6 therapists
    const therapistsToShow = window.therapistData.slice(0, 6);
    
    therapistsToShow.forEach(therapist => {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all';
        card.style.border = '1px solid #001233';
        
        card.innerHTML = `
            <div class="text-center">
                <img src="${therapist.image || 'User Panel Media/therapist1.png'}" 
                     alt="Dr. ${therapist.first_name} ${therapist.last_name}" 
                     class="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100">
                <h3 class="text-lg font-semibold mb-2" style="color: #0a2342;">
                    Dr. ${therapist.first_name} ${therapist.last_name}
                </h3>
                <p class="text-sm text-blue-600 font-medium mb-2">${therapist.title}</p>
                <p class="text-sm mb-2" style="color: #6b7280;">${therapist.area}, ${therapist.city}</p>
                <p class="text-sm font-medium mb-3" style="color: #6b7280;">
                    ${therapist.distance?.toFixed(1) || '0.0'} km away
                </p>
                <p class="text-xs font-medium mb-4" style="color: #6b7280;">
                    approx. €${therapist.cost || 75}/session
                </p>
                <div class="flex gap-2">
                    <button onclick="window.openTherapistProfile(${therapist.id})" 
                            class="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        Profile
                    </button>
                    <button onclick="window.selectTherapistAndGoToBooking(${therapist.id})" 
                            class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-white hover:opacity-90" 
                            style="background: linear-gradient(135deg, #2A628F, #3A7BA8); border: none;">
                        Select
                    </button>
                </div>
                ${therapist.id >= 1000 ? '<div class="mt-2 text-xs text-green-600 font-semibold">🆕 Recently Registered</div>' : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
    
    console.log(`✅ FORCE POPULATE: Location step populated with ${therapistsToShow.length} therapist cards`);
};

window.forcePopulateCriteriaStep = function() {
    console.log('🎯 FORCE POPULATE: Starting criteria step population...');
    
    // First, force load registered therapists
    window.forceLoadRegisteredTherapists();
    
    // Use the proper criteria pagination function instead of custom pagination-less version
    if (typeof window.populateCriteriaCards === 'function') {
        console.log('🎯 FORCE POPULATE: Using proper criteria pagination function...');
        window.populateCriteriaCards();
    } else {
        console.log('⚠️ FORCE POPULATE: populateCriteriaCards not available, using fallback...');
        
        const container = document.getElementById('criteria-therapist-cards-container');
        if (!container) {
            console.error('❌ FORCE POPULATE: Criteria container not found');
            return;
        }
        
        if (!window.therapistData || window.therapistData.length === 0) {
            console.error('❌ FORCE POPULATE: No therapist data available');
            container.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No therapists available</div>';
            return;
        }
        
        console.log(`📊 FORCE POPULATE: Fallback - populating criteria with ${window.therapistData.length} therapists`);
        
        // Clear container
        container.innerHTML = '';
        container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        
        // Show first 6 therapists as fallback
        const therapistsToShow = window.therapistData.slice(0, 6);
        
        therapistsToShow.forEach(therapist => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all';
            card.style.border = '1px solid #001233';
            
            // Determine service info for criteria step
            let serviceInfo = 'In-person & Online';
            if (therapist.services) {
                const hasInPerson = therapist.services.in_person_therapy?.available;
                const hasOnline = therapist.services.online_therapy?.available;
                
                if (hasInPerson && hasOnline) {
                    serviceInfo = 'In-person & Online';
                } else if (hasInPerson) {
                    serviceInfo = 'In-person Only';
                } else if (hasOnline) {
                    serviceInfo = 'Online Only';
                }
            }
            
            card.innerHTML = `
                <div class="text-center">
                    <img src="${therapist.image || 'User Panel Media/therapist1.png'}" 
                         alt="Dr. ${therapist.first_name} ${therapist.last_name}" 
                         class="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100">
                    <h3 class="text-lg font-semibold mb-2" style="color: #0a2342;">
                        Dr. ${therapist.first_name} ${therapist.last_name}
                    </h3>
                    <p class="text-sm text-blue-600 font-medium mb-2">${therapist.title}</p>
                    <p class="text-sm mb-2" style="color: #6b7280;">${therapist.area}, ${therapist.city}</p>
                    <p class="text-sm font-medium mb-3" style="color: #6b7280;">
                        ${serviceInfo}
                    </p>
                    <p class="text-xs font-medium mb-4" style="color: #6b7280;">
                        approx. €${therapist.cost || 75}/session
                    </p>
                    <div class="flex gap-2">
                        <button onclick="window.openTherapistProfile(${therapist.id})" 
                                class="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            Profile
                        </button>
                        <button onclick="window.selectTherapistAndGoToBooking(${therapist.id})" 
                                class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-white hover:opacity-90" 
                                style="background: linear-gradient(135deg, #2A628F, #3A7BA8); border: none;">
                            Select
                        </button>
                    </div>
                    ${therapist.id >= 1000 ? '<div class="mt-2 text-xs text-green-600 font-semibold">🆕 Recently Registered</div>' : ''}
                </div>
            `;
            
            container.appendChild(card);
        });
        
        console.log(`✅ FORCE POPULATE: Fallback criteria populated with ${therapistsToShow.length} therapist cards`);
    }
};

// STEP 3: Override navigation functions to force populate after navigation
window.enhancedNavigateToLocation = function() {
    console.log('🗺️ ENHANCED: Navigating to location step with forced population...');
    
    // Hide other steps
    const step1 = document.getElementById('therapist-step-1');
    const step2 = document.getElementById('therapist-step-2');
    const step3Location = document.getElementById('therapist-step-3-location');
    const step3Criteria = document.getElementById('therapist-step-3-criteria');
    const step3Quiz = document.getElementById('therapist-step-3-quiz');
    
    [step1, step2, step3Criteria, step3Quiz].forEach(step => {
        if (step) {
            step.style.display = 'none';
            step.classList.add('hidden');
        }
    });
    
    // Show location step
    if (step3Location) {
        step3Location.style.display = 'block';
        step3Location.classList.remove('hidden');
        step3Location.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Force populate after a short delay
        setTimeout(() => {
            window.forcePopulateLocationStep();
        }, 300);
    }
};

window.enhancedNavigateToCriteria = function() {
    console.log('🎯 ENHANCED: Navigating to criteria step with forced population...');
    
    // Hide other steps
    const step1 = document.getElementById('therapist-step-1');
    const step2 = document.getElementById('therapist-step-2');
    const step3Location = document.getElementById('therapist-step-3-location');
    const step3Criteria = document.getElementById('therapist-step-3-criteria');
    const step3Quiz = document.getElementById('therapist-step-3-quiz');
    
    [step1, step2, step3Location, step3Quiz].forEach(step => {
        if (step) {
            step.style.display = 'none';
            step.classList.add('hidden');
        }
    });
    
    // Show criteria step
    if (step3Criteria) {
        step3Criteria.style.display = 'block';
        step3Criteria.classList.remove('hidden');
        step3Criteria.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Force populate after a short delay
        setTimeout(() => {
            window.forcePopulateCriteriaStep();
        }, 300);
    }
};

// STEP 4: Apply enhanced navigation to buttons
function applyEnhancedNavigation() {
    console.log('🔧 ENHANCED: Applying enhanced navigation to buttons...');
    
    // Find location buttons
    const locationBtns = document.querySelectorAll('.location-gradient, [onclick*="navigateToTherapistStepThree"]');
    locationBtns.forEach((btn, index) => {
        btn.onclick = function(e) {
            e.preventDefault();
            console.log(`📍 ENHANCED: Location button ${index + 1} clicked`);
            window.enhancedNavigateToLocation();
            return false;
        };
        console.log(`✅ ENHANCED: Location button ${index + 1} enhanced`);
    });
    
    // Find criteria buttons
    const criteriaBtns = document.querySelectorAll('.criteria-gradient, [onclick*="navigateToTherapistStepThreeCriteria"]');
    criteriaBtns.forEach((btn, index) => {
        btn.onclick = function(e) {
            e.preventDefault();
            console.log(`🎯 ENHANCED: Criteria button ${index + 1} clicked`);
            window.enhancedNavigateToCriteria();
            return false;
        };
        console.log(`✅ ENHANCED: Criteria button ${index + 1} enhanced`);
    });
    
    console.log(`✅ ENHANCED: Applied enhanced navigation to ${locationBtns.length} location and ${criteriaBtns.length} criteria buttons`);
}

// STEP 5: Test function for manual debugging
window.testStorageIntegration = function() {
    console.log('🧪 MANUAL TEST: Testing localStorage integration...');
    
    // Check localStorage
    const savedData = localStorage.getItem('therapistData');
    console.log('📥 localStorage check:', savedData ? `${JSON.parse(savedData).length} therapists` : 'EMPTY');
    
    // Force load
    const loaded = window.forceLoadRegisteredTherapists();
    console.log('🔄 Force loaded:', loaded.length, 'therapists');
    
    // Check current data
    console.log('📊 Current window.therapistData:', window.therapistData ? window.therapistData.length : 'NOT FOUND');
    
    // Force populate both steps
    window.forcePopulateLocationStep();
    window.forcePopulateCriteriaStep();
    
    return `✅ Test complete - ${window.therapistData ? window.therapistData.length : 0} therapists loaded`;
};

// STEP 6: Auto-apply on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ENHANCED: localStorage Integration Fix loaded');
    
    // Apply enhanced navigation after a short delay
    setTimeout(() => {
        applyEnhancedNavigation();
        
        // Force load on page load
        window.forceLoadRegisteredTherapists();
        
        console.log('✅ ENHANCED: Integration fix applied successfully');
        console.log('💡 ENHANCED: Test manually with: window.testStorageIntegration()');
    }, 1000);
});

console.log('✅ localStorage Integration Fix loaded - Enhanced navigation and forced population enabled'); 
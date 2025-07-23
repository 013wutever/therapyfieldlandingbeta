// Smooth transition navigation functions
window.smoothNavigateToStepTwo = function() {
    console.log("🎬 Starting smooth transition to Step 2");
    const step1 = document.getElementById("therapist-step-1");
    const step2 = document.getElementById("therapist-step-2");
    
    if (step1 && step2) {
        // Step 1: Slide out current step to left
        step1.classList.add('step-slide-out-left');
        
        // Step 2: Prepare next step (visible but off-screen right)
        step2.style.display = 'block';
        step2.classList.remove('hidden');
        step2.classList.add('step-slide-out-right');
        
        // Step 3: After short delay, slide in from right
        setTimeout(() => {
            step2.classList.remove('step-slide-out-right');
            step2.classList.add('step-slide-in-left');
        }, 50);
        
        // Step 4: After transition completes, clean up
        setTimeout(() => {
            step1.style.display = 'none';
            step1.classList.add('hidden');
            step1.classList.remove('step-slide-out-left');
            step2.classList.remove('step-slide-in-left');
        }, 550);
    }
};

window.smoothNavigateToStepOne = function() {
    console.log("🎬 Starting smooth transition to Step 1");
    const step1 = document.getElementById("therapist-step-1");
    const step2 = document.getElementById("therapist-step-2");
    
    if (step1 && step2) {
        // Step 1: Slide out current step to right
        step2.classList.add('step-slide-out-right');
        
        // Step 2: Prepare next step (visible but off-screen left)
        step1.style.display = 'block';
        step1.classList.remove('hidden');
        step1.classList.add('step-slide-out-left');
        
        // Step 3: After short delay, slide in from left
        setTimeout(() => {
            step1.classList.remove('step-slide-out-left');
            step1.classList.add('step-slide-in-right');
        }, 50);
        
        // Step 4: After transition completes, clean up
        setTimeout(() => {
            step2.style.display = 'none';
            step2.classList.add('hidden');
            step2.classList.remove('step-slide-out-right');
            step1.classList.remove('step-slide-in-right');
            
            // Scroll to top
            step1.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 550);
    }
};

// Replace the existing navigation functions
window.navigateToTherapistStepTwo = window.smoothNavigateToStepTwo; 
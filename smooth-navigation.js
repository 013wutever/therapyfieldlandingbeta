// Simple Fade Navigation - Clean & Fast with Persistent Override
console.log("🎬 Loading persistent simple fade navigation system...");

// Add CSS styles for simple fade transitions
if (!document.getElementById('smooth-step-styles')) {
    const styles = document.createElement('style');
    styles.id = 'smooth-step-styles';
    styles.innerHTML = `
        #therapist-step-1, #therapist-step-2 {
            transition: opacity 0.3s ease-in-out !important;
            opacity: 1;
        }
        .step-fade-out {
            opacity: 0 !important;
            pointer-events: none;
        }
        .step-fade-in {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(styles);
}

// Simple Step 1 to Step 2 navigation with fade
function simpleFadeToStepTwo() {
    console.log("🎬 Simple fade to Step 2");
    
    try {
        const step1 = document.getElementById("therapist-step-1");
        const step2 = document.getElementById("therapist-step-2");
        const step3 = document.getElementById("therapist-step-3-location");
        
        if (step1 && step2) {
            // Hide step 3 if visible
            if (step3) {
                step3.classList.add("hidden");
                step3.style.display = "none";
            }
            
            // Fade out step 1
            step1.classList.add('step-fade-out');
            
            // After fade out completes, show step 2
            setTimeout(() => {
                step1.style.display = 'none';
                step1.classList.add('hidden');
                
                // Show step 2 and fade in
                step2.style.display = 'block';
                step2.classList.remove('hidden');
                step2.classList.add('step-fade-out'); // Start invisible
                
                // Fade in step 2
                setTimeout(() => {
                    step2.classList.remove('step-fade-out');
                    step2.classList.add('step-fade-in');
                }, 50);
                
                // Clean up
                setTimeout(() => {
                    step1.classList.remove('step-fade-out');
                    step2.classList.remove('step-fade-in');
                    console.log("✅ Simple fade to Step 2 complete");
                }, 350);
            }, 300);
        }
    } catch (error) {
        console.error("❌ Error in simple fade navigation:", error);
    }
}

// Simple Step 2 to Step 1 navigation with fade
function simpleFadeToStepOne() {
    console.log("🎬 Simple fade to Step 1");
    
    const step1 = document.getElementById("therapist-step-1");
    const step2 = document.getElementById("therapist-step-2");
    
    if (step1 && step2) {
        // Fade out step 2
        step2.classList.add('step-fade-out');
        
        // After fade out completes, show step 1
        setTimeout(() => {
            step2.style.display = 'none';
            step2.classList.add('hidden');
            
            // Show step 1 and fade in
            step1.style.display = 'block';
            step1.classList.remove('hidden');
            step1.classList.add('step-fade-out'); // Start invisible
            
            // Fade in step 1
            setTimeout(() => {
                step1.classList.remove('step-fade-out');
                step1.classList.add('step-fade-in');
            }, 50);
            
            // Clean up and scroll
            setTimeout(() => {
                step2.classList.remove('step-fade-out');
                step1.classList.remove('step-fade-in');
                step1.scrollIntoView({ behavior: 'smooth', block: 'start' });
                console.log("✅ Simple fade to Step 1 complete");
            }, 350);
        }, 300);
    }
}

// AGGRESSIVE override strategy - keep overriding persistently
function aggressiveOverride() {
    // Override window function
    window.navigateToTherapistStepTwo = simpleFadeToStepTwo;
    
    // Override button directly if it exists
    const findBtn = document.getElementById('find-therapist-btn');
    if (findBtn) {
        findBtn.onclick = function(e) {
            e.preventDefault();
            simpleFadeToStepTwo();
            console.log('🎬 Aggressive override: Find Therapist clicked');
            return false;
        };
        // Also try setting the attribute
        findBtn.setAttribute('onclick', 'window.navigateToTherapistStepTwo(); return false;');
    }
    
    // Update back button
    const backBtn = document.getElementById('working-back-to-therapists-btn');
    if (backBtn) {
        backBtn.onclick = function(e) {
            e.preventDefault();
            simpleFadeToStepOne();
            return false;
        };
    }
}

// Apply override immediately
aggressiveOverride();

// Keep applying override every 200ms for the first 10 seconds to beat any other scripts
let overrideCount = 0;
const overrideInterval = setInterval(() => {
    aggressiveOverride();
    overrideCount++;
    
    if (overrideCount > 50) { // Stop after 10 seconds (50 * 200ms)
        clearInterval(overrideInterval);
        console.log("✅ Aggressive override completed - navigation should be persistent");
    }
}, 200);

// Also apply on DOM changes
const observer = new MutationObserver(() => {
    aggressiveOverride();
});

// Start observing when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });
} else {
    observer.observe(document.body, { childList: true, subtree: true });
}

console.log("✅ Persistent simple fade navigation system loaded"); 
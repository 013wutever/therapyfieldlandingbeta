// Emergency Quiz Navigation Fix
console.log('🆘 Loading quiz navigation fix...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, setting up quiz fix...');
    
    // Emergency quiz navigation function
    window.emergencyQuizFix = function() {
        console.log('🆘 Emergency quiz fix activated');
        
        try {
            // Hide all other steps
            const steps = ['therapist-step-1', 'therapist-step-2', 'therapist-step-3-location', 'therapist-step-3-criteria'];
            steps.forEach(stepId => {
                const element = document.getElementById(stepId);
                if (element) {
                    element.style.display = 'none';
                    element.classList.add('hidden');
                    console.log(`✅ Hidden: ${stepId}`);
                }
            });
            
            // Show quiz step
            const quizStep = document.getElementById('therapist-step-3-quiz');
            if (quizStep) {
                console.log('✅ Quiz step found, showing...');
                quizStep.style.display = 'block';
                quizStep.classList.remove('hidden');
                quizStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Update progress bar to show first question
                const progressBar = document.getElementById('quiz-progress-bar');
                const progressText = document.getElementById('quiz-progress-text');
                if (progressBar) progressBar.style.width = '16.67%'; // 1/6
                if (progressText) progressText.textContent = 'Question 1 of 6';
                
                console.log('✅ Quiz should now be visible');
                return true;
            } else {
                console.error('❌ Quiz step not found');
                return false;
            }
        } catch (error) {
            console.error('❌ Error in emergency quiz fix:', error);
            return false;
        }
    };
    
    // Override the navigation function
    window.navigateToTherapistStepThreeQuiz = function() {
        console.log('🧩 FIXED: Navigating to Therapist Step 3 - Quiz');
        return window.emergencyQuizFix();
    };
    
    // Find and fix quiz button
    setTimeout(() => {
        const quizButtons = document.querySelectorAll('[onclick*="navigateToTherapistStepThreeQuiz"]');
        console.log(`🔍 Found ${quizButtons.length} quiz buttons`);
        
        quizButtons.forEach((button, index) => {
            console.log(`🔧 Fixing quiz button ${index + 1}`);
            
            // Remove existing onclick and add our fixed version
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`🖱️ Quiz button ${index + 1} clicked`);
                window.emergencyQuizFix();
            });
        });
        
        // Also look for buttons with the quiz text
        const quizTextButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
            btn.textContent.toLowerCase().includes('quiz') || 
            btn.textContent.toLowerCase().includes('personalized')
        );
        
        quizTextButtons.forEach((button, index) => {
            if (!button.onclick && !button.getAttribute('onclick')) {
                console.log(`🔧 Adding click handler to quiz text button ${index + 1}`);
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log(`🖱️ Quiz text button ${index + 1} clicked`);
                    window.emergencyQuizFix();
                });
            }
        });
        
    }, 1000);
    
    // Test function
    window.testQuizFix = function() {
        console.log('🧪 Testing quiz fix...');
        return window.emergencyQuizFix();
    };
    
    console.log('✅ Quiz navigation fix loaded successfully!');
    console.log('🧪 Call window.testQuizFix() to test navigation');
});

// Immediate override in case DOM is already loaded
if (document.readyState === 'loading') {
    console.log('⏳ DOM still loading, waiting...');
} else {
    console.log('⚡ DOM already loaded, setting up immediately...');
    setTimeout(() => {
        // Set up emergency function
        window.emergencyQuizFix = function() {
            console.log('🆘 Immediate emergency quiz fix');
            
            const quizStep = document.getElementById('therapist-step-3-quiz');
            if (quizStep) {
                // Hide others
                ['therapist-step-1', 'therapist-step-2', 'therapist-step-3-location', 'therapist-step-3-criteria'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.display = 'none';
                        el.classList.add('hidden');
                    }
                });
                
                // Show quiz
                quizStep.style.display = 'block';
                quizStep.classList.remove('hidden');
                quizStep.scrollIntoView({ behavior: 'smooth' });
                return true;
            }
            return false;
        };
        
        window.navigateToTherapistStepThreeQuiz = window.emergencyQuizFix;
    }, 100);
} 
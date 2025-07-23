// ========== COMPREHENSIVE QUIZ FIX ==========
// This fixes all common issues preventing quiz navigation

(function() {
    'use strict';
    
    console.log('🔧 COMPREHENSIVE QUIZ FIX: Starting...');
    
    // 1. Define the emergency quiz navigation function
    function emergencyQuizNavigation() {
        console.log('🆘 Emergency quiz navigation activated');
        
        try {
            // Find and hide all other steps
            const stepsToHide = [
                'therapist-step-1',
                'therapist-step-2', 
                'therapist-step-3-location',
                'therapist-step-3-criteria'
            ];
            
            stepsToHide.forEach(stepId => {
                const element = document.getElementById(stepId);
                if (element) {
                    element.style.display = 'none';
                    element.classList.add('hidden');
                    console.log(`✅ Hidden: ${stepId}`);
                } else {
                    console.warn(`⚠️ Element not found: ${stepId}`);
                }
            });
            
            // Find and show quiz step
            const quizStep = document.getElementById('therapist-step-3-quiz');
            if (quizStep) {
                console.log('✅ Quiz step found, showing...');
                quizStep.style.display = 'block';
                quizStep.style.visibility = 'visible';
                quizStep.classList.remove('hidden');
                quizStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Update progress bar
                const progressBar = document.getElementById('quiz-progress-bar');
                const progressText = document.getElementById('quiz-progress-text');
                if (progressBar) {
                    progressBar.style.width = '16.67%';
                    console.log('✅ Progress bar updated');
                }
                if (progressText) {
                    progressText.textContent = 'Question 1 of 6';
                    console.log('✅ Progress text updated');
                }
                
                console.log('✅ Quiz navigation successful!');
                return true;
            } else {
                console.error('❌ Quiz step element not found with ID: therapist-step-3-quiz');
                
                // List all available elements with therapist-step in ID
                const allSteps = document.querySelectorAll('[id*="therapist-step"]');
                console.log('🔍 Available therapist step elements:', 
                    Array.from(allSteps).map(el => el.id));
                return false;
            }
        } catch (error) {
            console.error('❌ Error in emergency quiz navigation:', error);
            return false;
        }
    }
    
    // 2. Override/define the navigation function globally
    window.navigateToTherapistStepThreeQuiz = emergencyQuizNavigation;
    
    // 3. Set up multiple fallback mechanisms
    function setupQuizButton() {
        console.log('🔧 Setting up quiz button...');
        
        // Method 1: Find buttons with onclick attribute
        const onclickButtons = document.querySelectorAll('[onclick*="navigateToTherapistStepThreeQuiz"]');
        console.log(`🔍 Found ${onclickButtons.length} buttons with onclick`);
        
        onclickButtons.forEach((button, index) => {
            console.log(`🔧 Fixing onclick button ${index + 1}`);
            
            // Remove broken onclick and add working event listener
            button.removeAttribute('onclick');
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🖱️ Onclick button ${index + 1} clicked`);
                emergencyQuizNavigation();
            });
        });
        
        // Method 2: Find buttons by text content
        const allButtons = document.querySelectorAll('button, .cursor-pointer, [role="button"]');
        const quizButtons = Array.from(allButtons).filter(button => {
            const text = button.textContent.toLowerCase();
            return text.includes('quiz') || 
                   text.includes('personalized') ||
                   text.includes('matching') ||
                   text.includes('perfect match');
        });
        
        console.log(`🔍 Found ${quizButtons.length} buttons with quiz-related text`);
        
        quizButtons.forEach((button, index) => {
            console.log(`🔧 Adding click handler to text button ${index + 1}: "${button.textContent.trim()}"`);
            
            // Add event listener (multiple handlers won't hurt)
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`🖱️ Text button ${index + 1} clicked`);
                emergencyQuizNavigation();
            });
        });
        
        // Method 3: Find by specific classes or attributes
        const possibleSelectors = [
            '.quiz-button',
            '[data-quiz]',
            '[data-step="quiz"]',
            '.therapist-option:nth-child(3)',
            'button:contains("Quiz")'
        ];
        
        possibleSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    console.log(`🔍 Found ${elements.length} elements with selector: ${selector}`);
                    elements.forEach(el => {
                        el.addEventListener('click', emergencyQuizNavigation);
                    });
                }
            } catch (e) {
                // Ignore invalid selectors
            }
        });
    }
    
    // 4. Test function for manual testing
    window.testQuizNavigation = function() {
        console.log('🧪 Testing quiz navigation...');
        const result = emergencyQuizNavigation();
        if (result) {
            console.log('✅ Quiz test PASSED');
        } else {
            console.log('❌ Quiz test FAILED');
        }
        return result;
    };
    
    // 5. Multiple initialization attempts
    function initialize() {
        console.log('🚀 Initializing comprehensive quiz fix...');
        
        try {
            setupQuizButton();
            
            // Also try to find the quiz container and verify it exists
            const quizContainer = document.getElementById('therapist-step-3-quiz');
            if (quizContainer) {
                console.log('✅ Quiz container found and ready');
                
                // Make sure it has the question container
                const questionContainer = document.getElementById('quiz-question-container');
                if (questionContainer) {
                    console.log('✅ Question container found');
                } else {
                    console.warn('⚠️ Question container not found');
                }
            } else {
                console.error('❌ Quiz container not found');
            }
            
            console.log('✅ Comprehensive quiz fix initialization complete');
            console.log('🧪 Call window.testQuizNavigation() to test');
            
        } catch (error) {
            console.error('❌ Error during initialization:', error);
        }
    }
    
    // 6. Multiple initialization triggers
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM already loaded
        initialize();
    }
    
    // Also try after a delay in case of dynamic content
    setTimeout(initialize, 1000);
    setTimeout(initialize, 3000);
    
    console.log('🔧 COMPREHENSIVE QUIZ FIX: Loaded successfully');
    
})(); 
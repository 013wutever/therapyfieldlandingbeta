// ========== COMPREHENSIVE QUIZ SYSTEM ==========
// Therapist Matching Quiz Implementation

// Initialize quiz system
window.initializeComprehensiveQuiz = function() {
    console.log("🧩 Initializing Comprehensive Quiz System");
    try {
        // Reset quiz state
        window.currentQuizQuestion = 0;
        window.quizAnswers = {};
        window.quizUserLocation = null;
        
        // Start with first question
        window.showComprehensiveQuizQuestion(0);
    } catch (error) {
        console.error("❌ Error initializing quiz:", error);
    }
};

// Comprehensive Quiz Questions
window.comprehensiveQuizQuestions = [
    {
        id: 1,
        type: "language",
        question: "In which language would you like your therapist to communicate?",
        options: [] // Will be populated dynamically from therapist data
    },
    {
        id: 2,
        type: "age_group",
        question: "Is this therapy for a child or an adult?",
        options: [
            { value: "child", text: "Child (under 18)" },
            { value: "adult", text: "Adult (18+)" }
        ]
    },
    {
        id: 3,
        type: "service_type",
        question: "Which type of service are you looking for?",
        options: [] // Will be populated based on age group selection
    },
    {
        id: 4,
        type: "location_request",
        question: "To find therapists near you, we need access to your location. Is that okay?",
        options: [
            { value: "allow", text: "Allow location access" },
            { value: "deny", text: "Skip location (online services only)" }
        ],
        conditional: true // Only show for certain services
    },
    {
        id: 5,
        type: "therapy_approach",
        question: "Do you have any particular therapeutic approach preference?",
        options: [] // Will be populated from therapist data
    },
    {
        id: 6,
        type: "availability",
        question: "What is your preferred time for sessions?",
        options: [
            { value: "morning", text: "Morning (8AM - 12PM)" },
            { value: "noon", text: "Noon (12PM - 2PM)" },
            { value: "afternoon", text: "Afternoon (2PM - 5PM)" },
            { value: "evening", text: "Evening (5PM - 8PM)" },
            { value: "night", text: "Night (8PM - 10PM)" }
        ]
    }
];

// Generate dynamic options for questions
window.generateComprehensiveQuizOptions = function() {
    console.log("🔧 Generating dynamic quiz options from therapist data");
    
    if (!window.therapistData || window.therapistData.length === 0) {
        console.error("❌ No therapist data available for quiz options");
        return;
    }
    
    // Extract unique languages
    const uniqueLanguages = [...new Set(window.therapistData.flatMap(t => t.languages || []))];
    window.comprehensiveQuizQuestions[0].options = uniqueLanguages.map(lang => ({
        value: lang.toLowerCase(),
        text: lang
    }));
    
    // Extract unique therapy approaches
    const uniqueApproaches = [...new Set(window.therapistData.flatMap(t => t.therapy_approaches || []))];
    window.comprehensiveQuizQuestions[4].options = [
        { value: "no_preference", text: "No Preference" },
        ...uniqueApproaches.map(approach => ({
            value: approach.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            text: approach
        }))
    ];
    
    console.log("✅ Dynamic quiz options generated");
};

// Check if question should be skipped
window.shouldSkipComprehensiveQuizQuestion = function(questionIndex) {
    const question = window.comprehensiveQuizQuestions[questionIndex];
    
    if (question.type === "location_request") {
        // Skip location request for online therapy
        const serviceAnswer = window.quizAnswers[2]; // Service type question
        return serviceAnswer && serviceAnswer.answer === "online_therapy";
    }
    
    if (question.type === "therapy_approach") {
        // Skip therapy approach for psychometric evaluations
        const serviceAnswer = window.quizAnswers[2];
        return serviceAnswer && (
            serviceAnswer.answer === "psychometric_wisc" || 
            serviceAnswer.answer === "psychometric_wais" || 
            serviceAnswer.answer === "psychometric_mmpi2"
        );
    }
    
    return false;
};

// Update service options based on age group
window.updateComprehensiveServiceOptions = function(question) {
    const ageGroupAnswer = window.quizAnswers[1];
    if (!ageGroupAnswer) return;
    
    if (ageGroupAnswer.answer === "child") {
        question.options = [
            { value: "in_person_therapy", text: "In-Person Therapy" },
            { value: "online_therapy", text: "Online Therapy" },
            { value: "psychometric_wisc", text: "Psychometric Evaluation WISC" },
            { value: "teen_counseling", text: "Teen Counseling" },
            { value: "parents_counseling", text: "Parents Counseling" }
        ];
    } else {
        question.options = [
            { value: "in_person_therapy", text: "In-Person Therapy" },
            { value: "online_therapy", text: "Online Therapy" },
            { value: "psychometric_wais", text: "Psychometric Evaluation WAIS" },
            { value: "psychometric_mmpi2", text: "Psychometric Evaluation MMPI2" },
            { value: "couples_therapy", text: "Couples Therapy" },
            { value: "parents_counseling", text: "Parents Counseling" }
        ];
    }
};

// Show quiz question
window.showComprehensiveQuizQuestion = function(questionIndex) {
    try {
        console.log(`🧩 Showing quiz question ${questionIndex + 1}`);
        
        // Generate dynamic options if not done yet
        if (questionIndex === 0 && (!window.comprehensiveQuizQuestions[0].options || window.comprehensiveQuizQuestions[0].options.length === 0)) {
            window.generateComprehensiveQuizOptions();
        }
        
        const question = window.comprehensiveQuizQuestions[questionIndex];
        const questionContainer = document.getElementById("quiz-question-container");
        const progressBar = document.getElementById("quiz-progress-bar");
        const progressText = document.getElementById("quiz-progress-text");
        
        if (!question || !questionContainer) return;
        
        // Check if this question should be skipped based on previous answers
        if (window.shouldSkipComprehensiveQuizQuestion(questionIndex)) {
            console.log(`⏭️ Skipping question ${questionIndex + 1}`);
            window.nextComprehensiveQuizQuestion(questionIndex);
            return;
        }
        
        // Update progress
        const totalQuestions = window.comprehensiveQuizQuestions.filter((q, i) => !window.shouldSkipComprehensiveQuizQuestion(i)).length;
        const currentQuestionNum = window.comprehensiveQuizQuestions.slice(0, questionIndex + 1).filter((q, i) => !window.shouldSkipComprehensiveQuizQuestion(i)).length;
        const progress = (currentQuestionNum / totalQuestions) * 100;
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Question ${currentQuestionNum} of ${totalQuestions}`;
        
        // Handle service type question dynamically
        if (question.type === "service_type") {
            window.updateComprehensiveServiceOptions(question);
        }
        
        // Generate question HTML
        const questionHTML = `
            <div class="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
                <h3 class="text-2xl font-semibold text-gray-800 mb-6 text-center">${question.question}</h3>
                <div class="space-y-3">
                    ${question.options.map(option => `
                        <button 
                            onclick="selectComprehensiveQuizAnswer(${questionIndex}, '${option.value}')" 
                            class="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:shadow-md"
                        >
                            <span class="font-medium text-gray-800">${option.text}</span>
                        </button>
                    `).join("")}
                </div>
            </div>
        `;
        
        questionContainer.innerHTML = questionHTML;
        
    } catch (error) {
        console.error("❌ Error showing quiz question:", error);
    }
};

// Select quiz answer
window.selectComprehensiveQuizAnswer = function(questionIndex, answer) {
    try {
        const question = window.comprehensiveQuizQuestions[questionIndex];
        const selectedOption = question.options.find(opt => opt.value === answer);
        
        if (selectedOption) {
            window.quizAnswers[questionIndex] = {
                question: question.question,
                answer: answer,
                type: question.type,
                selectedText: selectedOption.text
            };
            
            console.log(`✅ Quiz answer recorded: ${question.type} = ${answer}`);
            
            // Handle special cases
            if (question.type === "location_request" && answer === "allow") {
                window.requestComprehensiveQuizGeolocation(() => {
                    window.nextComprehensiveQuizQuestion(questionIndex);
                });
                return;
            }
            
            // Move to next question or show results
            window.nextComprehensiveQuizQuestion(questionIndex);
        }
    } catch (error) {
        console.error("❌ Error selecting quiz answer:", error);
    }
};

// Move to next question
window.nextComprehensiveQuizQuestion = function(currentIndex) {
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < window.comprehensiveQuizQuestions.length) {
        setTimeout(() => {
            window.showComprehensiveQuizQuestion(nextIndex);
        }, 500);
    } else {
        setTimeout(() => {
            window.showComprehensiveQuizResults();
        }, 500);
    }
};

// Request geolocation
window.requestComprehensiveQuizGeolocation = function(callback) {
    console.log("📍 Requesting user location for therapist matching");
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                window.quizUserLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log("✅ Location obtained:", window.quizUserLocation);
                callback();
            },
            function(error) {
                console.warn("⚠️ Geolocation error:", error.message);
                // Use Athens as fallback
                window.quizUserLocation = { lat: 37.9838, lng: 23.7275 };
                callback();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        console.error("❌ Geolocation not supported");
        window.quizUserLocation = { lat: 37.9838, lng: 23.7275 };
        callback();
    }
};

// Calculate therapist matches based on quiz answers
window.calculateComprehensiveTherapistMatches = function() {
    try {
        console.log("🔍 Calculating therapist matches based on quiz answers");
        
        if (!window.therapistData || window.therapistData.length === 0) {
            console.error("❌ No therapist data available for matching");
            return [];
        }
        
        const matchedTherapists = window.therapistData.map(therapist => {
            let score = 0;
            let totalWeight = 0;
            
            // Language matching (highest priority)
            const languageAnswer = window.quizAnswers[0];
            if (languageAnswer && therapist.languageKeys) {
                const therapistLanguages = therapist.languageKeys.map(lang => lang.toLowerCase());
                if (therapistLanguages.includes(languageAnswer.answer.toLowerCase())) {
                    score += 25; // Very high weight for language match
                }
                totalWeight += 25;
            }
            
            // Age group matching (for child vs adult therapists)
            const ageGroupAnswer = window.quizAnswers[1];
            if (ageGroupAnswer && therapist.title) {
                const isChildTherapist = therapist.title.toLowerCase().includes('child');
                const needsChildTherapist = ageGroupAnswer.answer === 'child';
                if (isChildTherapist === needsChildTherapist) {
                    score += 20; // High weight for age group match
                }
                totalWeight += 20;
            }
            
            // Service matching (very important)
            const serviceAnswer = window.quizAnswers[2];
            if (serviceAnswer && therapist.services) {
                let hasService = false;
                if (typeof therapist.services === 'object' && therapist.services[serviceAnswer.answer]) {
                    if (typeof therapist.services[serviceAnswer.answer] === 'object') {
                        hasService = therapist.services[serviceAnswer.answer].available;
                    } else {
                        hasService = therapist.services[serviceAnswer.answer] === true;
                    }
                }
                if (hasService) {
                    score += 20; // High weight for service availability
                }
                totalWeight += 20;
            }
            
            // Therapy approach matching
            const approachAnswer = window.quizAnswers[4];
            if (approachAnswer && approachAnswer.answer !== 'no_preference' && therapist.therapy_approaches_keys) {
                const approachKey = approachAnswer.answer.toLowerCase().replace(/[^a-z0-9]/g, '_');
                if (therapist.therapy_approaches_keys.some(key => key.toLowerCase().includes(approachKey) || approachKey.includes(key.toLowerCase()))) {
                    score += 15; // Medium weight for approach match
                }
                totalWeight += 15;
            }
            
            // Availability matching
            const availabilityAnswer = window.quizAnswers[5];
            if (availabilityAnswer && therapist.availabilityKey) {
                if (therapist.availabilityKey.toLowerCase() === availabilityAnswer.answer.toLowerCase()) {
                    score += 10; // Lower weight for availability
                }
                totalWeight += 10;
            }
            
            // Location proximity (if location was provided)
            if (window.quizUserLocation && therapist.distance !== undefined) {
                // Bonus for closer therapists (within 5km)
                if (therapist.distance <= 5) {
                    score += 10;
                } else if (therapist.distance <= 10) {
                    score += 5;
                }
                totalWeight += 10;
            }
            
            // Calculate final match percentage
            const matchPercentage = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 50;
            
            return {
                ...therapist,
                matchScore: score,
                totalWeight: totalWeight,
                matchPercentage: matchPercentage
            };
        });
        
        // Sort by match score and return top 6
        const sortedMatches = matchedTherapists.sort((a, b) => b.matchScore - a.matchScore);
        const topMatches = sortedMatches.slice(0, 6);
        
        console.log(`✅ Found ${topMatches.length} top matches`);
        return topMatches;
        
    } catch (error) {
        console.error("❌ Error calculating therapist matches:", error);
        return [];
    }
};

// Generate therapist card for quiz results
window.generateComprehensiveMatchedTherapistCard = function(therapist) {
    try {
        const fullName = `Dr. ${therapist.first_name} ${therapist.last_name}`;
        const locationInfo = `${therapist.area}, ${therapist.city}`;
        const approaches = therapist.therapy_approaches && therapist.therapy_approaches.length > 0 
            ? therapist.therapy_approaches[0] 
            : "General Therapy";
        
        // Generate star rating
        const rating = therapist.rating || 4.5;
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) starsHTML += '★';
        if (hasHalfStar) starsHTML += '☆';
        for (let i = 0; i < emptyStars; i++) starsHTML += '☆';
        
        return `
            <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                <div class="flex flex-col items-center text-center">
                    <img src="${therapist.image || therapist.photo || 'User Panel Media/therapist1.png'}" 
                         alt="${fullName}" 
                         class="w-20 h-20 rounded-full object-cover mb-4 border-4 border-blue-100">
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">${fullName}</h3>
                    <p class="text-sm text-gray-600 mb-2">${approaches}</p>
                    <p class="text-xs text-gray-500 mb-3">${locationInfo}</p>
                    <div class="flex items-center mb-2">
                        <span class="text-yellow-400">${starsHTML}</span>
                        <span class="text-sm text-gray-600 ml-2">${rating}</span>
                    </div>
                    <div class="text-sm text-green-600 font-bold mb-4">${therapist.matchPercentage}% Match</div>
                    <div class="flex gap-2 w-full">
                        <button onclick="window.selectTherapistAndGoToBooking('${therapist.id}')" 
                                class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Book Session
                        </button>
                        <button onclick="window.viewTherapistProfile('${therapist.id}')" 
                                class="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                            Profile
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("❌ Error generating matched therapist card:", error);
        return '';
    }
};

// Show quiz results with matching therapists
window.showComprehensiveQuizResults = function() {
    try {
        console.log("🎯 Showing quiz results with matched therapists");
        
        // Calculate therapist matches
        const matchedTherapists = window.calculateComprehensiveTherapistMatches();
        
        // Display results
        const questionContainer = document.getElementById("quiz-question-container");
        const progressContainer = document.getElementById("quiz-progress-container");
        
        if (progressContainer) progressContainer.classList.add("hidden");
        
        const resultsHTML = `
            <div class="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
                <div class="text-center mb-8">
                    <h3 class="text-3xl font-bold text-gray-800 mb-4">Your Perfect Matches</h3>
                    <p class="text-lg text-gray-600">Based on your preferences, here are the top therapists for you:</p>
                </div>
                
                <!-- Navigation buttons -->
                <div class="flex justify-center gap-4 mb-8">
                    <button onclick="window.navigateToTherapistStepThreeCriteria()" 
                            class="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        🔍 Try Criteria Search
                    </button>
                    <button onclick="window.navigateToTherapistStepThree()" 
                            class="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        📍 Try Location Search
                    </button>
                </div>
                
                <!-- Matched therapists -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${matchedTherapists.map(match => window.generateComprehensiveMatchedTherapistCard(match)).join('')}
                </div>
            </div>
        `;
        
        questionContainer.innerHTML = resultsHTML;
        
    } catch (error) {
        console.error("❌ Error showing quiz results:", error);
    }
};

// Override the original initializeQuiz to use comprehensive version
window.initializeQuiz = window.initializeComprehensiveQuiz;

// Debug function
window.testQuizSystem = function() {
    console.log("🧪 Testing Quiz System");
    console.log("initializeQuiz function:", typeof window.initializeQuiz);
    console.log("comprehensiveQuizQuestions:", window.comprehensiveQuizQuestions ? window.comprehensiveQuizQuestions.length : "undefined");
    console.log("therapistData:", window.therapistData ? window.therapistData.length : "undefined");
    
    // Try to manually trigger quiz
    try {
        console.log("🚀 Manually triggering quiz...");
        window.initializeQuiz();
    } catch (error) {
        console.error("❌ Error testing quiz:", error);
    }
};

console.log("✅ Comprehensive Quiz System loaded successfully!");
console.log("📱 Call window.testQuizSystem() in browser console to debug"); 
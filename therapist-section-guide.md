# Therapy Field User Portal - Therapy Section Functionality Guide

## Overview
The Therapy section is a 4-step process that allows users to find and book therapy sessions through three different pathways: Location-based search, Criteria-based filtering, and Personalized quiz matching.

## Navigation Flow

### Step 1: Therapist Gallery (Landing)
**Location**: `therapist-step-1`
**Purpose**: Introduction to available therapists with visual gallery

**Elements**:
- Landing therapist cards displaying 3 sample therapists:
  - Dr. Emily Davis (Family Therapist, Paris)
  - Dr. Sarah Johnson (Clinical Psychologist, Athens)  
  - Dr. Michael Chen (Behavioral Therapist, Manhattan)
- Each card shows: Photo, Name, Specialty, Location, Rating
- "Find Therapist" button to proceed to Step 2

**JavaScript Function**: `navigateToTherapistStepTwo()`

### Step 2: Selection Options
**Location**: `therapist-step-2`
**Purpose**: User chooses their preferred search method

**Three Options**:

#### 1. Location Button
- **Icon**: Location pin icon
- **Text**: "Location - Find therapists near you"
- **Function**: `navigateToTherapistStepThree()`
- **Leads to**: Step 3 - Location-based search

#### 2. Criteria Button  
- **Icon**: Filter/criteria icon
- **Text**: "Criteria - Filter by specialties"
- **Function**: `navigateToTherapistStepThreeCriteria()`
- **Leads to**: Step 3 - Criteria-based search

#### 3. Quiz Button
- **Icon**: Quiz/question icon
- **Text**: "Quiz - Personalized matching"
- **Function**: `navigateToTherapistStepThreeQuiz()`
- **Leads to**: Step 3 - Quiz-based matching

**Navigation**:
- "Back" button returns to Step 1
- All option buttons have hover effects and animations

## Step 3: Search Methods

### Step 3A: Location-Based Search
**Location**: `therapist-step-3-location`

**Features**:
- Interactive map showing therapist locations
- Therapist cards with distance information
- Grid layout: 1 column mobile, 2 columns tablet, 3 columns desktop
- Each card includes "Book Session" button

**JavaScript Functions**:
- Map initialization and location services
- Distance calculation
- Card population based on user location

### Step 3B: Criteria-Based Search  
**Location**: `therapist-step-3-criteria`

**Filter Options**:
1. **City**: Paris, Athens, Manhattan, Berlin, Rome, London
2. **Area**: Downtown, City Center, Residential, Suburbs
3. **Language**: English, French, German, Greek, Italian
4. **Specialty**: Family, Clinical, Behavioral, Cognitive, Couples, Anxiety
5. **Gender**: Female, Male
6. **Experience**: 1-5 years, 5-10 years, 10-15 years, 15+ years
7. **Availability**: Morning, Afternoon, Evening, Weekend

**Functionality**:
- Real-time filtering as user changes selections
- Results counter showing "X therapists found"
- "Clear All Filters" button to reset
- Same therapist card layout as location search

**JavaScript Functions**:
- `initializeCriteriaFilters()`: Sets up filter event listeners
- `filterTherapistCards()`: Applies filters and updates display
- `clearAllFilters()`: Resets all filter dropdowns

**Sample Data** (6 therapists):
1. Dr. Emily Davis - Family, Paris, French, Female, 10-15 years, Morning
2. Dr. Sarah Johnson - Clinical, Athens, Greek, Female, 15+ years, Afternoon  
3. Dr. Michael Chen - Behavioral, Manhattan, English, Male, 5-10 years, Evening
4. Dr. Anna Mueller - Cognitive, Berlin, German, Female, 1-5 years, Weekend
5. Dr. Marco Rossi - Couples, Rome, Italian, Male, 10-15 years, Morning
6. Dr. Lisa Thompson - Anxiety, London, English, Female, 15+ years, Afternoon

### Step 3C: Quiz-Based Matching
**Location**: `therapist-step-3-quiz`

**Quiz Structure** (5 Questions):

1. **Therapy Type Preference**
   - Family Therapy (family: 3, clinical: 1)
   - Clinical Psychology (clinical: 3, behavioral: 1)  
   - Behavioral Therapy (behavioral: 3, cognitive: 1)
   - Cognitive Therapy (cognitive: 3, anxiety: 1)
   - Couples Therapy (couples: 3, family: 1)
   - Anxiety/Stress Management (anxiety: 3, clinical: 1)

2. **Session Time Preference**
   - Morning (8AM-12PM) 
   - Afternoon (12PM-5PM)
   - Evening (5PM-8PM)
   - Weekend

3. **Gender Preference**
   - Female
   - Male  
   - No Preference

4. **Experience Level Preference**
   - 1-5 years
   - 5-10 years
   - 10-15 years
   - 15+ years

5. **Language Preference**
   - English, French, German, Greek, Italian

**Progress Tracking**:
- Progress bar showing current question (e.g., "Question 2 of 5")
- Visual progress indicator updates with each answer

**Scoring System**:
- Each answer has weighted values for different therapist attributes
- Algorithm calculates compatibility percentage for each therapist
- Results show top 6 matches sorted by score

**JavaScript Functions**:
- `initializeQuiz()`: Starts quiz from question 1
- `showQuizQuestion(index)`: Displays specific question
- `selectQuizAnswer(questionIndex, answer)`: Records answer and advances
- `calculateTherapistScores()`: Computes compatibility scores
- `showQuizResults()`: Displays top 6 matches with percentages

## Step 4: Booking System
**Location**: `therapist-step-4-booking` (dynamically created)

**Triggered by**: Clicking "Book Session" from any Step 3 variant

**Sections**:

### 1. Therapist Information
- Photo, name, specialty, location, rating
- Confirmation of selected therapist

### 2. Date & Time Selection  
**Calendar Component**:
- Current month view with clickable dates
- Past dates disabled/grayed out
- Today highlighted
- Selected date highlighted in blue

**Time Slots**:
- Generated based on therapist availability:
  - Morning: 9:00 AM, 10:00 AM, 11:00 AM, 12:00 PM
  - Afternoon: 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM  
  - Evening: 5:00 PM, 6:00 PM, 7:00 PM, 8:00 PM
  - Weekend: 10:00 AM, 11:00 AM, 2:00 PM, 3:00 PM, 4:00 PM

### 3. Session Details
**Session Type**:
- Individual Session (50 min) - Default
- Couple Session (60 min)
- Family Session (60 min)

**Session Format**:
- Online Session - Default
- In-Person Session

**Additional Notes**: Optional textarea for user concerns/topics

### 4. Booking Summary
- Appears when both date and time are selected
- Shows: Therapist, Date, Time, Duration, Format, Total Cost ($120)
- Updates dynamically as user changes selections

### 5. Action Buttons
- "Back to Search": Returns to Step 2 (options)
- "Confirm Booking": Finalizes appointment (requires date + time)

**JavaScript Functions**:
- `navigateToBookingStep(therapistId)`: Creates booking interface
- `createBookingStep(therapistId)`: Generates HTML for booking form
- `generateTimeSlots(availability)`: Creates time options based on therapist schedule
- `initializeBookingCalendar()`: Sets up interactive calendar
- `selectDate(day)`: Handles date selection
- `selectTimeSlot(time)`: Handles time selection  
- `updateSessionDetails()`: Updates summary when options change
- `confirmBooking()`: Processes final booking and shows confirmation

## Navigation & Back Buttons

### Consistent Back Navigation
Each step includes responsive back buttons:
- **Mobile**: Smaller padding (`px-4`, `py-2`), smaller text (`text-sm`), smaller icons (`text-lg`)
- **Desktop**: Larger padding (`px-8`, `py-3`), larger text (`text-base`), larger icons (`text-xl`)

### Button Hierarchy
1. Step 2 → Step 1: "Back"
2. Step 3 → Step 2: "Back to Options"  
3. Step 4 → Step 2: "Back to Search"

## Visual Design

### Button Styling
**Option Buttons** (Step 2):
- Background: Light grey (`bg-gray-100`)
- Border: Black border with hover effects
- Hover: Darker grey (`bg-gray-200`)
- Icons: Black color, consistent sizing
- Animations: Scale and translate effects on hover

### Card Layout
**Therapist Cards**:
- White background with shadow
- Rounded corners (`rounded-2xl`)
- 20px photos with blue border
- Star ratings in yellow
- Action buttons: Blue primary, grey secondary

### Responsive Design
- Grid layouts adapt: 1 column mobile → 2 tablet → 3 desktop
- Button sizes scale appropriately
- Text sizes adjust for readability

## Error Handling

### JavaScript Error Management
- All functions wrapped in try-catch blocks
- Console logging for debugging
- Graceful fallbacks when elements not found
- User-friendly error messages

### Data Validation
- Booking form requires both date and time selection
- Quiz requires answer to proceed
- Form validation with visual feedback

## Technical Implementation

### Key JavaScript Variables
- `window.quizAnswers = {}`: Stores quiz responses
- `window.currentQuizQuestion = 0`: Tracks quiz progress
- `window.quizQuestions = [...]`: Question data with weights

### Event Listeners
- Filter dropdowns auto-update results
- Calendar day clicks select dates
- Time slot buttons toggle selection
- Session detail changes update summary

### Data Flow
1. User selection triggers navigation function
2. Function hides current step, shows target step
3. Initialization function sets up interactive elements
4. User interactions update state and UI
5. Final selection leads to booking or results

## Testing Checklist

### Functionality Tests
- [ ] All three option buttons navigate correctly
- [ ] Criteria filters work and update results count
- [ ] Quiz progresses through all 5 questions
- [ ] Quiz shows top 6 results with scores
- [ ] Booking calendar allows date selection
- [ ] Time slots populate based on availability
- [ ] Booking summary updates dynamically
- [ ] All back buttons return to correct steps

### Visual Tests  
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Hover effects function on all interactive elements
- [ ] Loading states display appropriately
- [ ] Error states show helpful messages

### Browser Compatibility
- [ ] Chrome, Firefox, Safari functionality
- [ ] Mobile browser performance
- [ ] Touch interactions work properly

## Known Issues & Solutions

### Common Problems
1. **Buttons not responding**: Check JavaScript syntax errors in console
2. **Filters not updating**: Verify event listeners are attached
3. **Calendar not showing**: Ensure DOM elements exist before initialization
4. **Quiz not progressing**: Check question data structure and scoring logic

### Debug Tools
- Browser console for JavaScript errors
- Network tab for failed resource loads
- Elements inspector for CSS issues
- Responsive design mode for layout testing

## Future Enhancements

### Potential Improvements
1. **Advanced Filtering**: Price range, insurance acceptance, reviews
2. **Calendar Integration**: Sync with external calendar apps
3. **Payment Processing**: Secure payment gateway integration
4. **Video Calls**: Built-in telehealth capabilities
5. **Therapist Profiles**: Detailed bio pages with credentials
6. **Review System**: Client feedback and rating system
7. **Availability Updates**: Real-time therapist schedule sync
8. **Multiple Locations**: Support for therapist offices in different cities

---

## Implementation Priority

### Phase 1 (Current) ✅
- Basic navigation between steps
- Three search methods functional
- Simple booking interface

### Phase 2 (Next)
- Enhanced error handling
- Mobile optimization
- Performance improvements

### Phase 3 (Future)
- Advanced features
- Integration with external systems
- Analytics and tracking 
# How to Add Smooth Transitions

## Quick Fix: Add this line to user-panel.html

Find this line in your `user-panel.html` file (around line 18):
```html
<script src="quiz-system.js"></script>
```

Add this line immediately after it:
```html
<script src="smooth-navigation.js"></script>
```

So it looks like:
```html
<script src="quiz-system.js"></script>
<script src="smooth-navigation.js"></script>
<link rel="stylesheet" href="landing-therapist-cards.css"/>
```

## What this does:
- ✅ Overrides `navigateToTherapistStepTwo()` with smooth sliding transitions
- ✅ Updates the Back button to use smooth transitions  
- ✅ Adds CSS for 0.5s slide animations (left/right movement)
- ✅ Automatically loads when the page opens

## Test it:
1. Add the script line to user-panel.html
2. Open user-panel.html in your browser
3. Click "Find Therapist" → smooth slide left to right
4. Click "Back" → smooth slide right to left

The transitions will be professional and smooth! 
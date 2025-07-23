# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Therapy Field is a comprehensive mental health platform connecting users with therapists and providing mental wellness tools. Built with vanilla JavaScript, HTML5, and CSS3, it serves three main user types: clients (patients), therapists, and businesses.

## Interconnected Documentation Structure

This file references the following documentation hierarchy:
- **[PROJECT-TODO.md](./PROJECT-TODO.md)** - Main project roadmap and scope
- **[GREY-ZONES-ANALYSIS.md](./GREY-ZONES-ANALYSIS.md)** - Critical gaps and ambiguities
- **[PRICING-STRATEGY.md](./PRICING-STRATEGY.md)** - Free vs paid features breakdown
- **[DATABASE-ARCHITECTURE.md](./DATABASE-ARCHITECTURE.md)** - Complete database specifications
- **[INTEGRATION-MAP.md](./INTEGRATION-MAP.md)** - System connections and data flow
- **[MISSING-COMPONENTS.md](./MISSING-COMPONENTS.md)** - Components to be implemented

## Development Commands

### Local Development Server
```bash
# Start the Python HTTP server with CORS enabled
python3 start-server.py
# OR
./start-server.sh

# Server runs on http://localhost:8000
# Automatically opens in default browser
```

### Testing & Debugging Rules
```bash
# Before making changes, always:
1. Read relevant .md documentation files
2. Check PROJECT-TODO.md for current sprint tasks
3. Verify changes against GREY-ZONES-ANALYSIS.md
4. Update SPRINT-TODO.md with progress
5. Run manual tests (no test suite yet)

# Debug checklist:
- Console for errors: F12 → Console
- Check localStorage: F12 → Application → Local Storage
- Network requests: F12 → Network
- Responsive design: F12 → Toggle device toolbar
```

### Critical Update Rules
When updating code:
1. **Always check dependencies** in PROJECT-TODO.md
2. **Update all related documentation** when changing features
3. **Add to SPRINT-TODO.md** for any new tasks discovered
4. **Document grey zones** discovered in GREY-ZONES-ANALYSIS.md
5. **Never break existing localStorage** structures without migration

## High-Level Architecture

### Page Structure
```
Landing Page (index.html) → Entry point
├── User Panel (user-panel.html) → Client dashboard [85% complete]
├── Therapist Registration (therapist-registration.html) → Onboarding [90% complete]
├── [TODO] Login System (login.html) → Multi-role authentication
├── [TODO] Therapist Dashboard → Practice management
└── [TODO] Business Portal → Corporate wellness management
```

### Core Modules in User Panel
1. **Dashboard** - Central hub aggregating data from all modules
2. **Therapy/Sessions** - 4-step therapist booking flow
3. **Emotia** - Mood tracking with wave visualizations
4. **Journalia** - Digital journaling with categories
5. **Momentum** - Goal and habit tracking system

### Data Flow Architecture
```
Browser LocalStorage
├── therapistData (array of therapist profiles)
├── emotiaData (mood tracking history)
├── journalEntries (journaling data)
├── goals (habit tracking)
└── userPreferences (settings, language)

All modules → Dashboard (aggregated statistics)
```

### Critical Integration Points

#### Authentication System (Not Implemented)
- See [AUTHENTICATION-SYSTEM-PLAN.md](./AUTHENTICATION-SYSTEM-PLAN.md)
- Required for all pages
- Should handle: Login, Registration, Session management
- Connect to backend API

#### Navigation Flow
```
index.html
├── "Σύνδεση" → Login system
├── "Προγραμματισμός Θεραπείας" → user-panel.html
├── Service cards → user-panel.html#therapist-step-2
└── "Βρείτε Θεραπευτή" → user-panel.html#therapist-search

user-panel.html
├── Bottom nav → Section switching
├── Therapist cards → Booking flow
└── Settings → Logout → index.html

therapist-registration.html
└── Submit → [Future] Therapist dashboard
```

#### Google Maps Integration
- API key required in `therapist-registration.html`
- Used for: Location search, Address autocomplete
- Libraries: places, maps

## Key JavaScript Patterns

### Module Initialization
```javascript
// Each module has init function
initializeDashboard();
initializeEmotiaMoodTracker();
initializeJournalia();
initializeMomentum();

// Navigation between sections
function navigateToSection(sectionId) {
    document.querySelectorAll('[id$="-sections"]').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}
```

### State Management
```javascript
// LocalStorage pattern used throughout
const data = JSON.parse(localStorage.getItem('dataKey') || '[]');
data.push(newItem);
localStorage.setItem('dataKey', JSON.stringify(data));
```

### Therapist Search Flow
```javascript
navigateToTherapistStepTwo() → Choose search method
├── navigateToTherapistStepThreeLocation() → Map-based search
├── navigateToTherapistStepThreeCriteria() → Filter-based search
└── navigateToTherapistStepThreeQuiz() → Quiz matching
    └── createBookingStep() → Calendar booking
```

## Priority Tasks & Dependencies

See [PROJECT-TODO.md](./PROJECT-TODO.md) for the complete roadmap.

### Immediate Priorities
1. **Split 30k line HTML** into components
2. **Implement authentication** system
3. **Connect navigation** between pages
4. **Create backend API** structure
5. **Migrate to database** from localStorage

## Testing Procedures

### Manual Testing Checklist
- [ ] All navigation links work
- [ ] LocalStorage data persists
- [ ] Responsive on mobile devices
- [ ] Forms validate properly
- [ ] Error states display correctly

### Browser Testing Matrix
- Chrome (latest) - Primary
- Firefox (latest) - Secondary
- Safari (latest) - Secondary
- Mobile Chrome/Safari - Critical

## Debugging Guide

### Common Issues
1. **LocalStorage Full**: Clear old data or implement cleanup
2. **API Key Missing**: Add Google Maps API key
3. **Navigation Broken**: Check section ID naming
4. **Data Not Saving**: Verify localStorage key names

### Debug Functions
```javascript
// Add to console for debugging
window.debugTherapyField = {
    clearAllData: () => localStorage.clear(),
    showTherapists: () => console.table(JSON.parse(localStorage.getItem('therapistData'))),
    showMoodData: () => console.log(JSON.parse(localStorage.getItem('emotiaData'))),
    navigateTo: (section) => navigateToSection(section)
};
```

## Performance Optimization Rules

1. **Lazy Load Modules**: Don't initialize all modules on page load
2. **Optimize Images**: Use WebP format, lazy loading
3. **Minify Assets**: CSS/JS minification before production
4. **Cache API Calls**: Implement caching for therapist data
5. **Debounce Search**: Add debouncing to search inputs

## Security Considerations

- **No server-side validation** currently - critical gap
- **API keys exposed** in client code - needs proxy
- **No data encryption** in localStorage - implement encryption
- **No user authentication** - highest priority
- **XSS vulnerabilities** - sanitize all user inputs

## Code Style Guidelines

1. **Use ES6+** features (const, let, arrow functions)
2. **Consistent naming**: camelCase for functions/variables
3. **Comment complex logic** but avoid obvious comments
4. **Error handling**: Always catch and display user-friendly errors
5. **Async/await** over promises when possible

## Documentation Update Protocol

When making changes:
1. Update relevant feature documentation
2. Add tasks to appropriate TODO files
3. Document any new grey zones discovered
4. Update integration points if modified
5. Keep all interconnected docs in sync

Remember: This is a living document system. Always check for updates and maintain consistency across all documentation files.
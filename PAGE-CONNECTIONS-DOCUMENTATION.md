# Therapy Field - Page Connections & Navigation Documentation

## Overview
This document maps all current pages, their links, and required connections to create a seamless user experience across the Therapy Field platform.

## Current Pages Inventory

### 1. Landing Page (`index.html`)
**Status**: 95% Complete  
**Purpose**: Main entry point showcasing services and directing users to appropriate sections

#### Existing Links That Need Connection:

##### Navigation Bar
- **Logo** → Should stay on landing page (currently works)
- **Σχετικά** (About) → Needs about section or scroll to about content
- **Υπηρεσίες** (Services) → Needs services page or scroll to services section
- **Πλατφόρμες** (Platforms) → Needs platforms overview page
- **Επικοινωνία** (Contact) → Needs contact form/page
- **Σύνδεση** (Login) → `login.html` (needs creation)

##### Hero Section
- **"Προγραμματισμός Θεραπείας"** (Schedule Therapy) → `user-panel.html`
- **"Είμαι Θεραπευτής"** (I'm a Therapist) → `therapist-registration.html`

##### Services Section Cards
- **"Επιλογή"** buttons on service cards → `user-panel.html#therapist-step-2` with service preselected:
  - Διαζώσης (In-person) → `user-panel.html?service=in-person`
  - Διαδικτυακή (Online) → `user-panel.html?service=online`
  - Ψυχομετρική (Psychometric) → `user-panel.html?service=evaluation`
  - Έφηβοι/Γονείς (Teen/Parent) → `user-panel.html?service=counseling`

##### Quick Selection Section
- **"Ξεκινήστε τώρα"** (Start now) → `user-panel.html#therapist-step-2`

##### Platform Features Grid
- **"Σύνδεση στις Πλατφόρμες"** (Connect to Platforms) → `login.html`

##### Footer (Needs Creation)
- Privacy Policy → `privacy-policy.html`
- Terms of Service → `terms-of-service.html`
- Cookie Policy → `cookie-policy.html`
- Contact → `contact.html`

### 2. User Panel (`user-panel.html`)
**Status**: 85% Complete  
**Purpose**: Main client dashboard with therapy booking and wellness tools

#### Internal Navigation (Working)
- Dashboard tab → Dashboard section
- Therapy tab → Sessions section
- Emotia tab → Emotia section
- Journalia tab → Journalia section
- Momentum tab → Momentum section

#### External Links Needed:
- **Settings Menu**:
  - Profile → `user-profile.html` (needs creation)
  - Logout → Clear session → `index.html`
  
- **Therapist Cards**:
  - "View Profile" → `therapist-profile.html?id={therapist_id}` (needs creation)
  
- **Booking Confirmation**:
  - After booking → Show confirmation → Update sessions history
  - Email confirmation → Trigger email service
  
- **Empty Sections**:
  - Sessions History → Needs implementation in same page
  - Courses → `courses.html` or implement in same page
  - Insights → Analytics dashboard in same page

### 3. Therapist Registration (`therapist-registration.html`)
**Status**: 90% Complete  
**Purpose**: Onboarding new therapists to the platform

#### Links Needed:
- **Header Logo** → `index.html`
- **"Already have an account?"** → `login.html?role=therapist`
- **After Successful Registration** → `therapist-dashboard.html` (needs creation)
- **Terms of Service checkbox** → `therapist-terms.html` (needs creation)
- **Privacy Policy checkbox** → `privacy-policy.html`

### 4. Required New Pages

#### 4.1 Login Page (`login.html`)
**Purpose**: Unified login for all user types

**Required Elements**:
- Email/password fields
- "Remember me" checkbox
- "Forgot password?" → `reset-password.html`
- Social login buttons (Google, Facebook)
- Toggle between Client/Therapist login
- "Sign up" links:
  - For clients → `signup.html`
  - For therapists → `therapist-registration.html`
- After login redirect:
  - Clients → `user-panel.html`
  - Therapists → `therapist-dashboard.html`
  - Business → `business-dashboard.html`

#### 4.2 Client Signup (`signup.html`)
**Purpose**: New client registration

**Required Elements**:
- Basic info form (name, email, password)
- Email verification flow
- Terms acceptance
- After signup → `user-panel.html`

#### 4.3 Therapist Dashboard (`therapist-dashboard.html`)
**Purpose**: Therapist's practice management hub

**Required Sections**:
- Appointment calendar
- Client list
- Session notes
- Analytics
- Profile settings → `therapist-profile-edit.html`
- Logout → `index.html`

#### 4.4 Therapist Profile View (`therapist-profile.html`)
**Purpose**: Public view of therapist profile

**Required Elements**:
- Full therapist info display
- Booking button → `user-panel.html#booking?therapist={id}`
- Back to search → `user-panel.html#therapist-search`
- Contact therapist → Opens contact modal

#### 4.5 Legal Pages
- `privacy-policy.html`
- `terms-of-service.html`
- `cookie-policy.html`
- `therapist-terms.html`

#### 4.6 Support Pages
- `contact.html` - Contact form
- `help.html` - FAQ and support
- `about.html` - About Therapy Field

## Navigation Flow Diagrams

### Client Journey
```
Landing Page
    ↓ (Click "Προγραμματισμός Θεραπείας")
Login Page (if not logged in)
    ↓ (Login or Signup)
User Panel
    ↓ (Select Therapy tab)
Therapist Search
    ↓ (Choose search method)
Therapist Results
    ↓ (Select therapist)
Booking Calendar
    ↓ (Confirm booking)
Confirmation & Sessions History
```

### Therapist Journey
```
Landing Page
    ↓ (Click "Είμαι Θεραπευτής")
Therapist Registration
    ↓ (Complete registration)
Email Verification
    ↓ (Verify email)
Therapist Dashboard
    ↓ (Manage practice)
```

### Return User Flow
```
Landing Page
    ↓ (Click "Σύνδεση")
Login Page
    ↓ (Enter credentials)
Dashboard (User Panel or Therapist Dashboard based on role)
```

## URL Parameter Handling

### User Panel Parameters
- `?service={type}` - Preselect service type
- `?therapist={id}` - Direct to specific therapist
- `#therapist-step-2` - Jump to therapist search
- `#booking?therapist={id}` - Direct to booking for specific therapist

### Therapist Profile Parameters
- `?id={therapist_id}` - Load specific therapist
- `?back=search` - Show back to search button
- `?back=booking` - Show back to booking button

### Login Page Parameters
- `?role=therapist` - Show therapist login tab
- `?role=client` - Show client login tab
- `?redirect={url}` - Redirect after login
- `?signup=true` - Show signup form

## Implementation Priority

### Phase 1 - Critical Connections (Week 1)
1. Create `login.html` with basic functionality
2. Connect landing page CTAs to user panel
3. Connect service cards to therapist search with parameters
4. Implement logout functionality

### Phase 2 - Authentication Flow (Week 2)
1. Create `signup.html` for clients
2. Implement login/logout across all pages
3. Add session management
4. Create password reset flow

### Phase 3 - Therapist Features (Week 3)
1. Create `therapist-dashboard.html`
2. Create `therapist-profile.html`
3. Connect registration to dashboard
4. Implement therapist data display

### Phase 4 - Legal & Support (Week 4)
1. Create all legal pages
2. Create contact and help pages
3. Add footer to all pages
4. Implement cookie consent banner

## Technical Implementation Notes

### Session Management
```javascript
// Check login status on page load
const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    if (!token && requiresAuth) {
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }
};

// Role-based redirection
const redirectByRole = (role) => {
    switch(role) {
        case 'client':
            window.location.href = '/user-panel.html';
            break;
        case 'therapist':
            window.location.href = '/therapist-dashboard.html';
            break;
        case 'business':
            window.location.href = '/business-dashboard.html';
            break;
    }
};
```

### URL Parameter Handling
```javascript
// Parse URL parameters
const urlParams = new URLSearchParams(window.location.search);
const service = urlParams.get('service');
const therapistId = urlParams.get('therapist');

// Apply parameters
if (service) {
    preselectService(service);
}
if (therapistId) {
    loadTherapistProfile(therapistId);
}
```

### Navigation State Preservation
```javascript
// Save navigation state
const saveNavigationState = () => {
    const state = {
        lastPage: window.location.pathname,
        lastSection: getCurrentSection(),
        timestamp: Date.now()
    };
    localStorage.setItem('navigationState', JSON.stringify(state));
};

// Restore navigation state
const restoreNavigationState = () => {
    const state = JSON.parse(localStorage.getItem('navigationState') || '{}');
    if (state.lastSection && Date.now() - state.timestamp < 3600000) { // 1 hour
        navigateToSection(state.lastSection);
    }
};
```

## Testing Checklist

### Navigation Testing
- [ ] All landing page links work correctly
- [ ] Service selection passes correct parameters
- [ ] Login redirects to appropriate dashboard
- [ ] Logout clears session and redirects to landing
- [ ] Back buttons maintain proper flow
- [ ] Deep links work with authentication

### User Flow Testing
- [ ] Complete client journey from landing to booking
- [ ] Complete therapist journey from registration to dashboard
- [ ] Test return user login flow
- [ ] Test password reset flow
- [ ] Test session timeout handling

### Cross-Page Data
- [ ] Service selection carries through to booking
- [ ] User preferences persist across pages
- [ ] Therapist data displays correctly
- [ ] Session state maintains across navigation

This documentation provides a complete map of all page connections and navigation requirements for the Therapy Field platform.
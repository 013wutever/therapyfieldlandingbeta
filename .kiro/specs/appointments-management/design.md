# Design Document

## Overview

The appointments management system will replace the existing separate appointment containers with a unified, tabbed interface that provides comprehensive appointment management functionality. The design follows Apple's design principles with clean lines, appropriate white space, and subtle blue accents.

## Architecture

### Component Structure
```
Appointments Container
├── Header Section
│   ├── Container Title ("Appointments")
│   └── Tab Navigation (Upcoming | Previous)
├── Content Area
│   ├── Upcoming Tab Content
│   │   ├── Appointment Cards
│   │   └── Empty State (if no appointments)
│   └── Previous Tab Content
│       ├── Session Cards
│       └── Empty State (if no sessions)
└── Action Modals (Reschedule, Contact, Rating)
```

### Data Models

#### Appointment Model
```javascript
{
  id: string,
  therapistId: string,
  therapistName: string,
  therapistImage: string,
  service: string,
  date: Date,
  time: string,
  duration: number,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  location: string | null, // null for online sessions
  meetingLink: string | null, // for online sessions
  cost: number,
  notes: string
}
```

#### Session Model (Previous Appointments)
```javascript
{
  id: string,
  therapistId: string,
  therapistName: string,
  therapistImage: string,
  service: string,
  date: Date,
  time: string,
  duration: number,
  cost: number,
  userRating: number | null,
  isMainTherapist: boolean,
  sessionNotes: string
}
```

## Components and Interfaces

### 1. Container Header
- **Title**: "Appointments" with consistent typography
- **Tab Navigation**: Segmented control style with "Upcoming" and "Previous"
- **Active State**: Blue background for active tab, subtle animation on switch

### 2. Upcoming Appointments Tab

#### Appointment Card Design
```
┌─────────────────────────────────────────────────────────┐
│ [Therapist Photo] Dr. Name                    [Status]  │
│                   Service Type                          │
│                   📅 Date • 🕐 Time • ⏱️ Duration      │
│                   📍 Location / 💻 Online              │
│                                                         │
│ [Reschedule] [Call] [Email]                   €Cost     │
└─────────────────────────────────────────────────────────┘
```

#### Action Buttons
- **Reschedule**: Opens calendar modal for new date/time selection
- **Call**: Displays therapist phone number with click-to-call
- **Email**: Opens email composition or displays therapist email

#### Status Indicators
- **Pending**: Orange dot with "Pending Confirmation"
- **Confirmed**: Green dot with "Confirmed"
- **Today**: Blue highlight with "Today" badge

### 3. Previous Sessions Tab

#### Session Card Design
```
┌─────────────────────────────────────────────────────────┐
│ [Therapist Photo] Dr. Name                              │
│                   Service Type                          │
│                   📅 Date • 🕐 Time                     │
│                                                         │
│ [★★★★☆ Rate] [Make Main Therapist]          €Cost      │
└─────────────────────────────────────────────────────────┘
```

#### Interactive Elements
- **Rating System**: 5-star rating with hover effects
- **Main Therapist**: Toggle button to set as primary therapist
- **Session Details**: Expandable section for notes/summary

### 4. Empty States

#### No Upcoming Appointments
```
🗓️
No upcoming appointments
Book your first session to get started
[Find Therapist]
```

#### No Previous Sessions
```
📋
No previous sessions
Your completed sessions will appear here
```

## Error Handling

### Network Errors
- Display retry button with error message
- Maintain offline state for critical appointment information
- Show loading states during data fetching

### Validation Errors
- Inline validation for reschedule requests
- Clear error messages for failed actions
- Confirmation dialogs for destructive actions

### Data Consistency
- Optimistic updates with rollback on failure
- Real-time sync with backend appointment system
- Conflict resolution for concurrent modifications

## Testing Strategy

### Unit Tests
- Component rendering with different appointment states
- Tab switching functionality
- Action button interactions
- Rating system functionality

### Integration Tests
- Appointment data loading and display
- Reschedule workflow end-to-end
- Contact therapist functionality
- Rating submission and persistence

### Visual Tests
- Responsive design across screen sizes
- Dark/light mode compatibility (if applicable)
- Animation and transition smoothness
- Accessibility compliance (WCAG 2.1)

## Design Specifications

### Color Palette
- **Primary Blue**: #3B82F6 (for active states, buttons)
- **Light Blue**: #EFF6FF (for backgrounds, hover states)
- **White**: #FFFFFF (card backgrounds)
- **Gray Scale**: #F9FAFB, #F3F4F6, #E5E7EB, #9CA3AF, #6B7280, #374151

### Typography
- **Headers**: Inter, 18px, font-weight: 600
- **Body Text**: Inter, 14px, font-weight: 400
- **Labels**: Inter, 12px, font-weight: 500
- **Buttons**: Inter, 14px, font-weight: 500

### Spacing
- **Container Padding**: 24px
- **Card Padding**: 20px
- **Element Spacing**: 12px, 16px, 20px (based on hierarchy)
- **Button Padding**: 12px 20px

### Animations
- **Tab Transitions**: 200ms ease-in-out
- **Card Hover**: 150ms ease-out transform and shadow
- **Button Interactions**: 100ms ease-in-out
- **Modal Animations**: 250ms ease-out slide/fade

### Responsive Breakpoints
- **Mobile**: < 768px (single column, stacked buttons)
- **Tablet**: 768px - 1024px (adjusted spacing, two-column where appropriate)
- **Desktop**: > 1024px (full layout with optimal spacing)
# Therapy Field - Authentication & User Management System

## Overview
This document outlines the complete authentication and user management system for Therapy Field, supporting multiple user types (clients, therapists, businesses) with appropriate security measures and user experience considerations.

## User Types & Roles

### 1. Client (Patient)
- **Purpose**: Access therapy booking and wellness tools
- **Permissions**: 
  - Book appointments
  - Access personal wellness data
  - Share data with therapist
  - Manage profile
  - View session history

### 2. Therapist
- **Purpose**: Manage practice and client care
- **Permissions**:
  - Manage appointments
  - Access client shared data
  - Create session notes
  - Manage availability
  - Publish articles
  - Access supervision tools

### 3. Business Admin
- **Purpose**: Manage corporate mental health programs
- **Permissions**:
  - Invite employees
  - View aggregate analytics
  - Manage billing
  - Configure wellness programs
  - Access employee wellness metrics (anonymized)

### 4. Super Admin
- **Purpose**: Platform administration
- **Permissions**:
  - User management
  - Content moderation
  - System configuration
  - Analytics access
  - Support tools

## Authentication Flow

### 1. Registration Process

#### Client Registration
```
Landing Page → "Προγραμματισμός Θεραπείας" → Check Auth → Signup Page
```

**Fields Required**:
- Full name (Όνομα/Επώνυμο)
- Email address
- Password (min 8 chars, 1 uppercase, 1 number)
- Phone number (optional)
- Birth date (for age verification)
- Terms acceptance checkbox
- Marketing consent (optional)

**Process**:
1. Form validation
2. Check email uniqueness
3. Create account (unverified)
4. Send verification email
5. Show verification pending page
6. On verification → Activate account
7. Auto-login → Redirect to user-panel.html

#### Therapist Registration
```
Landing Page → "Είμαι Θεραπευτής" → therapist-registration.html
```

**Additional Fields** (beyond basic):
- Professional license number
- Specializations
- Years of experience
- Office address
- Professional insurance
- Supervisor status
- Bank account (for payments)

**Verification Process**:
1. Email verification (automatic)
2. License verification (manual review)
3. Document upload (credentials, insurance)
4. Admin approval
5. Account activation notification
6. Access to therapist dashboard

#### Business Registration
**Process**:
1. Contact sales team
2. Demo and consultation
3. Contract signing
4. Admin account creation
5. Employee invitation system setup

### 2. Login System

#### Login Page Design (`login.html`)

**Layout**:
```
┌─────────────────────────────────────┐
│        Therapy Field Logo           │
├─────────────────────────────────────┤
│    Καλώς ήρθατε πίσω (Welcome back) │
├─────────────────────────────────────┤
│  [Client] [Therapist] [Business]    │ ← Role tabs
├─────────────────────────────────────┤
│  Email: [___________________]       │
│  Password: [________________]       │
│  □ Remember me for 30 days          │
├─────────────────────────────────────┤
│  [Σύνδεση (Login)]                  │
├─────────────────────────────────────┤
│  Forgot password? | Don't have      │
│                     an account?     │
├─────────────────────────────────────┤
│  ──────── OR ────────               │
│  [G] Continue with Google           │
│  [f] Continue with Facebook         │
└─────────────────────────────────────┘
```

**Features**:
- Role-based login tabs
- Social login options
- Remember me (30 days)
- Password visibility toggle
- Loading states
- Error messages in Greek/English

#### Login Flow
```javascript
async function handleLogin(email, password, role) {
  try {
    // 1. Validate inputs
    if (!validateEmail(email) || !password) {
      throw new Error('Invalid credentials');
    }
    
    // 2. API call
    const response = await api.post('/auth/login', {
      email,
      password,
      role
    });
    
    // 3. Store tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('userRole', response.user.role);
    localStorage.setItem('userId', response.user.id);
    
    // 4. Set cookie if remember me
    if (rememberMe) {
      setCookie('refreshToken', response.refreshToken, 30);
    }
    
    // 5. Redirect by role
    redirectByRole(response.user.role);
    
  } catch (error) {
    showError(error.message);
  }
}
```

### 3. Session Management

#### Token Strategy
- **Access Token**: JWT, 15-minute expiry
- **Refresh Token**: Opaque token, 30-day expiry
- **Storage**: 
  - Access token in memory/sessionStorage
  - Refresh token in httpOnly cookie

#### Token Refresh Flow
```javascript
// Axios interceptor for token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = getCookie('refreshToken');
        const response = await api.post('/auth/refresh', {
          refreshToken
        });
        
        localStorage.setItem('accessToken', response.accessToken);
        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
        
        return axios(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login.html';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 4. Password Management

#### Forgot Password Flow
1. User clicks "Forgot password?"
2. Enter email address
3. Receive reset link (valid for 1 hour)
4. Click link → Reset password page
5. Enter new password (with requirements)
6. Auto-login after reset

#### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character
- Not same as email
- Not in common passwords list

#### Reset Password Email Template
```html
Subject: Επαναφορά κωδικού πρόσβασης - Therapy Field

Γεια σας [Name],

Λάβαμε ένα αίτημα επαναφοράς του κωδικού πρόσβασής σας.
Κάντε κλικ στον παρακάτω σύνδεσμο για να δημιουργήσετε νέο κωδικό:

[Reset Password Button]

Ο σύνδεσμος θα λήξει σε 1 ώρα.

Αν δεν ζητήσατε επαναφορά κωδικού, αγνοήστε αυτό το email.

Με εκτίμηση,
Η ομάδα του Therapy Field
```

### 5. Social Authentication

#### Google OAuth 2.0
```javascript
// Google Sign-In initialization
function initGoogleAuth() {
  google.accounts.id.initialize({
    client_id: 'YOUR_GOOGLE_CLIENT_ID',
    callback: handleGoogleSignIn,
    auto_select: false,
    cancel_on_tap_outside: true,
  });
  
  google.accounts.id.renderButton(
    document.getElementById("googleSignInButton"),
    { 
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left"
    }
  );
}

async function handleGoogleSignIn(response) {
  const { credential } = response;
  
  // Send to backend
  const result = await api.post('/auth/google', {
    idToken: credential,
    role: getCurrentRole()
  });
  
  // Handle login success
  handleLoginSuccess(result);
}
```

#### Facebook Login
```javascript
// Facebook SDK initialization
window.fbAsyncInit = function() {
  FB.init({
    appId: 'YOUR_FACEBOOK_APP_ID',
    cookie: true,
    xfbml: true,
    version: 'v18.0'
  });
};

function handleFacebookLogin() {
  FB.login(function(response) {
    if (response.authResponse) {
      FB.api('/me', {fields: 'name,email'}, async function(userData) {
        const result = await api.post('/auth/facebook', {
          accessToken: response.authResponse.accessToken,
          userData,
          role: getCurrentRole()
        });
        
        handleLoginSuccess(result);
      });
    }
  }, {scope: 'public_profile,email'});
}
```

## Security Measures

### 1. Account Security
- **Two-Factor Authentication** (optional)
  - SMS-based
  - Authenticator app
  - Email codes
  
- **Login Alerts**
  - Email notification for new device
  - Location-based alerts
  - Suspicious activity detection

- **Account Lockout**
  - 5 failed attempts → 15-minute lockout
  - Progressive delays
  - CAPTCHA after 3 attempts

### 2. Data Protection
```javascript
// Encryption for sensitive data
const encryptSensitiveData = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.ENCRYPTION_KEY
  ).toString();
};

// API request signing
const signRequest = (request) => {
  const timestamp = Date.now();
  const signature = generateHMAC(
    request.url + timestamp,
    process.env.API_SECRET
  );
  
  request.headers['X-Timestamp'] = timestamp;
  request.headers['X-Signature'] = signature;
  
  return request;
};
```

### 3. Session Security
- Secure session cookies (httpOnly, secure, sameSite)
- Session fingerprinting
- IP validation (optional)
- Activity timeout (30 minutes)
- Concurrent session limits

## User Profile Management

### 1. Profile Structure
```javascript
// Client Profile
{
  userId: "user_123",
  personalInfo: {
    firstName: "Νίκος",
    lastName: "Παπαδόπουλος",
    email: "nikos@example.com",
    phone: "+30 697 123 4567",
    birthDate: "1990-01-15",
    gender: "male",
    profilePhoto: "https://..."
  },
  preferences: {
    language: "el", // el, en
    timezone: "Europe/Athens",
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      shareDataWithTherapist: true,
      anonymousAnalytics: true
    }
  },
  emergency: {
    contactName: "Μαρία Παπαδοπούλου",
    contactPhone: "+30 697 765 4321",
    relationship: "spouse"
  }
}

// Therapist Profile extends Client Profile
{
  ...clientProfile,
  professionalInfo: {
    licenseNumber: "PSY-12345",
    specializations: ["anxiety", "depression", "couples"],
    education: [{
      degree: "PhD Psychology",
      institution: "University of Athens",
      year: 2010
    }],
    languages: ["el", "en"],
    approaches: ["cbt", "psychodynamic"],
    yearsOfExperience: 15,
    supervisorStatus: true
  },
  practiceInfo: {
    officeName: "Therapy Center Athens",
    officeAddress: {...},
    onlineTherapy: true,
    insuranceAccepted: ["ΕΟΠΥΥ", "Private"],
    sessionRates: {
      individual: 60,
      couples: 80,
      evaluation: 100
    }
  },
  verification: {
    emailVerified: true,
    licenseVerified: true,
    documentsVerified: true,
    verificationDate: "2024-01-10"
  }
}
```

### 2. Profile Management Features
- Edit personal information
- Upload/change profile photo
- Manage notification preferences
- Privacy settings
- Download personal data (GDPR)
- Delete account option

## API Endpoints

### Authentication Endpoints
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/resend-verification
POST   /api/v1/auth/google
POST   /api/v1/auth/facebook
GET    /api/v1/auth/me
```

### User Management Endpoints
```
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
POST   /api/v1/users/change-password
POST   /api/v1/users/upload-photo
DELETE /api/v1/users/account
GET    /api/v1/users/data-export
POST   /api/v1/users/preferences
GET    /api/v1/users/sessions
DELETE /api/v1/users/sessions/:id
```

## Implementation Timeline

### Week 1: Basic Authentication
- [ ] Create login.html page
- [ ] Create signup.html page
- [ ] Implement form validation
- [ ] Design API structure
- [ ] Set up JWT handling

### Week 2: Advanced Features
- [ ] Social login integration
- [ ] Password reset flow
- [ ] Email verification
- [ ] Remember me functionality
- [ ] Session management

### Week 3: Security & Polish
- [ ] Two-factor authentication
- [ ] Account security features
- [ ] Profile management
- [ ] GDPR compliance
- [ ] Testing and optimization

## Testing Checklist

### Functional Testing
- [ ] Registration for all user types
- [ ] Login with email/password
- [ ] Social login (Google, Facebook)
- [ ] Password reset flow
- [ ] Email verification
- [ ] Remember me functionality
- [ ] Logout from all devices
- [ ] Profile updates
- [ ] Role-based redirects

### Security Testing
- [ ] SQL injection attempts
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Brute force protection
- [ ] Session hijacking prevention
- [ ] Token expiration
- [ ] Secure password storage
- [ ] API authentication

### User Experience Testing
- [ ] Form validation messages
- [ ] Loading states
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Accessibility compliance
- [ ] Multi-language support
- [ ] Browser compatibility

This comprehensive authentication system ensures secure, user-friendly access to the Therapy Field platform while maintaining flexibility for future enhancements and compliance requirements.
# PROJECT-TODO.md - Therapy Field Master Roadmap

This is the main project roadmap and scope document. All tasks flow from here to feature-specific TODOs and then to sprint tasks.

## Document Dependencies
- Referenced by: [CLAUDE.md](./CLAUDE.md)
- References: 
  - [FEATURE-AUTH-TODO.md](./FEATURE-AUTH-TODO.md) - Authentication tasks
  - [FEATURE-THERAPIST-TODO.md](./FEATURE-THERAPIST-TODO.md) - Therapist dashboard tasks
  - [FEATURE-BUSINESS-TODO.md](./FEATURE-BUSINESS-TODO.md) - Business portal tasks
  - [SPRINT-TODO.md](./SPRINT-TODO.md) - Current sprint tasks

## Project Scope
A comprehensive mental health platform for the Greek market with three user types:
1. **Clients/Patients** - Book therapy, track wellness
2. **Therapists** - Manage practice, see clients
3. **Businesses** - Employee mental health programs

## Master Timeline (Revised from 5 to 12 months)

### Phase 1: Foundation (Months 1-2)
- [ ] **Architecture Setup**
  - [ ] Choose tech stack (Node.js/Express recommended)
  - [ ] Set up development environment
  - [ ] Create CI/CD pipeline
  - [ ] Initialize Git repository with proper branching
  - [ ] Set up monitoring and logging
  
- [ ] **Database Design**
  - [ ] Implement PostgreSQL schema
  - [ ] Set up Redis for caching
  - [ ] Configure database migrations
  - [ ] Create seed data scripts
  - [ ] Set up backup procedures

- [ ] **Split Frontend**
  - [ ] Break 30k line HTML into components
  - [ ] Implement module loader
  - [ ] Create build process
  - [ ] Set up asset optimization

### Phase 2: Authentication (Month 3)
See [FEATURE-AUTH-TODO.md](./FEATURE-AUTH-TODO.md) for detailed tasks
- [ ] Basic authentication system
- [ ] Social login integration
- [ ] Session management
- [ ] Security implementation

### Phase 3: Core Features (Months 4-6)
- [ ] **Navigation & Routing**
  - [ ] Connect all page links
  - [ ] Implement client-side routing
  - [ ] Create navigation guards
  - [ ] Add breadcrumbs

- [ ] **API Development**
  - [ ] User management endpoints
  - [ ] Therapist search and filtering
  - [ ] Appointment booking system
  - [ ] Wellness data endpoints

- [ ] **Therapist Dashboard**
  See [FEATURE-THERAPIST-TODO.md](./FEATURE-THERAPIST-TODO.md)
  - [ ] Dashboard layout
  - [ ] Appointment management
  - [ ] Client management
  - [ ] Clinical documentation

### Phase 4: Advanced Features (Months 7-9)
- [ ] **Payment Integration**
  - [ ] Research Greek payment providers
  - [ ] Implement payment flow
  - [ ] Add subscription billing
  - [ ] Create invoice system

- [ ] **Business Portal**
  See [FEATURE-BUSINESS-TODO.md](./FEATURE-BUSINESS-TODO.md)
  - [ ] Employee management
  - [ ] Analytics dashboard
  - [ ] Wellness programs
  - [ ] Billing management

- [ ] **Communication System**
  - [ ] In-app messaging
  - [ ] Email notifications
  - [ ] SMS integration
  - [ ] Video consultation setup

### Phase 5: Polish & Compliance (Months 10-11)
- [ ] **Security & Compliance**
  - [ ] GDPR implementation
  - [ ] Greek healthcare compliance
  - [ ] Security audit
  - [ ] Penetration testing

- [ ] **Performance Optimization**
  - [ ] Frontend optimization
  - [ ] Database optimization
  - [ ] Caching implementation
  - [ ] CDN setup

- [ ] **Localization**
  - [ ] Complete Greek translations
  - [ ] Cultural adaptations
  - [ ] Local payment methods
  - [ ] Greek insurance integration

### Phase 6: Launch Preparation (Month 12)
- [ ] **Testing & QA**
  - [ ] Full system testing
  - [ ] User acceptance testing
  - [ ] Load testing
  - [ ] Bug fixes

- [ ] **Soft Launch**
  - [ ] Beta testing with therapists
  - [ ] Limited Athens rollout
  - [ ] Gather feedback
  - [ ] Iterate based on feedback

- [ ] **Documentation**
  - [ ] User documentation
  - [ ] API documentation
  - [ ] Therapist onboarding guides
  - [ ] Support documentation

## Current Sprint
See [SPRINT-TODO.md](./SPRINT-TODO.md) for current 2-week sprint tasks.

## Blocked Tasks
- [ ] Payment integration (waiting for provider selection)
- [ ] ΕΟΠΥΥ integration (waiting for API access)
- [ ] Video consultation (provider selection needed)

## Future Enhancements (Post-Launch)
- [ ] Mobile applications (iOS/Android)
- [ ] AI-powered therapy matching
- [ ] Group therapy features
- [ ] Insurance claim automation
- [ ] Advanced analytics with ML
- [ ] Multi-language support (English, Albanian, etc.)

## Risk Mitigation Tasks
- [ ] Create fallback for Google Maps API
- [ ] Implement graceful degradation
- [ ] Set up disaster recovery
- [ ] Create incident response plan
- [ ] Establish support procedures

## Dependencies Map
```
Authentication → All Features
Database → API → Frontend
Payment → Booking Confirmation
Compliance → Launch
Therapist Dashboard → Client Booking
Business Portal → Employee Management
```

## Success Criteria
- [ ] 100 therapists onboarded
- [ ] 1,000 active users
- [ ] 500 sessions booked/month
- [ ] 5 businesses signed up
- [ ] < 3s page load time
- [ ] 99.9% uptime
- [ ] GDPR compliant
- [ ] Mobile responsive

## Notes
- Always update this document when scope changes
- Check grey zones in [GREY-ZONES-ANALYSIS.md](./GREY-ZONES-ANALYSIS.md)
- Refer to [DATABASE-ARCHITECTURE.md](./DATABASE-ARCHITECTURE.md) for schema
- See [PRICING-STRATEGY.md](./PRICING-STRATEGY.md) for monetization
- Check [MISSING-COMPONENTS.md](./MISSING-COMPONENTS.md) for gaps

Last Updated: 2024-01-23
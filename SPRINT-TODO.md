# SPRINT-TODO.md - Current Sprint Tasks

This is the active sprint backlog. Tasks here are pulled from feature TODOs and should be completed within the current 2-week sprint.

## Document Dependencies
- Referenced by: [PROJECT-TODO.md](./PROJECT-TODO.md), [CLAUDE.md](./CLAUDE.md)
- Pulls from: Feature-specific TODO files
- Updates: Daily during development

## Sprint Information
- **Sprint Number**: 1
- **Start Date**: 2024-01-23
- **End Date**: 2024-02-06
- **Sprint Goal**: Set up development environment and begin authentication implementation

## Sprint Backlog

### High Priority Tasks

#### Development Environment Setup
- [ ] **Choose backend technology stack** 🔴
  - Assignee: Team Lead
  - Decision: Node.js + Express + TypeScript
  - Due: Jan 24
  
- [ ] **Set up Git repository**
  - Create main, develop, feature branches
  - Set up branch protection rules
  - Create PR templates
  - Due: Jan 24

- [ ] **Initialize backend project**
  - Set up Node.js project structure
  - Configure TypeScript
  - Set up ESLint and Prettier
  - Create folder structure
  - Due: Jan 25

- [ ] **Set up PostgreSQL database**
  - Install PostgreSQL locally
  - Create development database
  - Set up migrations tool (Knex/TypeORM)
  - Due: Jan 25

- [ ] **Configure development tools**
  - Set up VS Code workspace
  - Configure debugger
  - Install recommended extensions
  - Create .env.example
  - Due: Jan 26

#### Frontend Refactoring (Urgent)
- [ ] **Analyze 30k line HTML file**
  - Identify logical components
  - Plan splitting strategy
  - Document dependencies
  - Due: Jan 26

- [ ] **Create component structure**
  - Set up module loader
  - Create component folders
  - Plan state management
  - Due: Jan 29

- [ ] **Split user-panel.html - Phase 1**
  - Extract Dashboard module
  - Extract Therapy module
  - Test functionality
  - Due: Jan 31

#### Authentication - Sprint 1 Tasks
- [ ] **Design login page UI**
  - Create mockups
  - Get team approval
  - Create HTML/CSS
  - Due: Jan 30

- [ ] **Implement basic auth API**
  - Set up auth routes
  - Implement JWT generation
  - Create login endpoint
  - Due: Feb 2

- [ ] **Create users database schema**
  - Write migration files
  - Add indexes
  - Test schema
  - Due: Jan 31

### Medium Priority Tasks

#### Documentation
- [ ] **Create API design document**
  - Define REST conventions
  - Create endpoint naming guide
  - Document error codes
  - Due: Feb 1

- [ ] **Set up API documentation tool**
  - Install Swagger/OpenAPI
  - Create first endpoint docs
  - Due: Feb 2

#### Infrastructure
- [ ] **Set up Redis**
  - Install Redis locally
  - Configure for sessions
  - Test connection
  - Due: Feb 1

- [ ] **Create Docker setup**
  - Dockerfile for API
  - docker-compose for services
  - Documentation
  - Due: Feb 5

### Low Priority Tasks

#### Research & Planning
- [ ] **Research Greek payment providers**
  - Contact Viva Wallet
  - Compare fees
  - Check integration complexity
  - Due: Feb 5

- [ ] **Evaluate CI/CD options**
  - GitHub Actions vs GitLab CI
  - Cost comparison
  - Due: Feb 6

## Daily Standup Notes

### Day 1 (Jan 23)
- Created comprehensive documentation
- Identified critical tech stack decisions needed
- Blocked by: Backend technology choice

### Day 2 (Jan 24)
- TODO: Make tech stack decision
- TODO: Set up Git repository
- TODO: Begin backend initialization

## Sprint Metrics

### Velocity Tracking
- **Planned Story Points**: 35
- **Completed**: 0
- **In Progress**: 0
- **Blocked**: 1

### Burndown Chart
```
Points Remaining:
Day 1:  35 ████████████████████████████████████
Day 2:  35 ████████████████████████████████████
Day 3:  [ ]
Day 4:  [ ]
Day 5:  [ ]
Day 6:  [ ]
Day 7:  [ ]
Day 8:  [ ]
Day 9:  [ ]
Day 10: [ ]
```

## Blockers & Risks

### Current Blockers
1. **Tech Stack Decision** - Blocking all backend development
   - Action: Schedule decision meeting for Jan 24
   
2. **30k Line HTML** - Risk to timeline
   - Action: May need additional developer help

### Identified Risks
1. **Scope Creep** - Authentication features expanding
   - Mitigation: Stick to MVP features only
   
2. **Integration Complexity** - Google/Facebook OAuth
   - Mitigation: Start with email/password only

## Definition of Done

A task is considered done when:
- [ ] Code is written and works locally
- [ ] Code is reviewed by another developer
- [ ] Tests are written (when applicable)
- [ ] Documentation is updated
- [ ] Code is merged to develop branch
- [ ] Related TODO files are updated

## Sprint Retrospective (To be filled at sprint end)

### What Went Well
- 

### What Could Be Improved
- 

### Action Items for Next Sprint
- 

## Next Sprint Planning

### Candidate Items for Sprint 2
1. Complete login/signup pages
2. Implement email verification
3. Add password reset flow
4. Begin therapist dashboard design
5. Continue HTML splitting (Emotia, Journalia modules)

### Dependencies to Resolve
- Email service provider selection
- SMS provider for 2FA
- Staging environment setup

---

**Remember**: Update this file daily! Mark tasks as complete, add blockers, and track progress.

Last Updated: 2024-01-23 (End of Day 1)
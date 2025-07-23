# Therapy Field Business Portal - Complete Specifications

## Overview
The Business Portal is a comprehensive corporate mental health management platform that enables companies to support their employees' mental wellness through Therapy Field's services. It provides tools for employee wellness monitoring, therapy access management, analytics, and ROI measurement.

## Business Model & Value Proposition

### Target Customers
- **Small Businesses** (10-50 employees)
- **Medium Enterprises** (50-500 employees)
- **Large Corporations** (500+ employees)
- **HR Consultancies**
- **Insurance Companies**

### Key Benefits
1. **Employee Wellbeing**: Improve mental health support
2. **Productivity**: Reduce burnout and absenteeism
3. **Retention**: Increase employee satisfaction
4. **Compliance**: Meet workplace wellness requirements
5. **ROI**: Measurable mental health investment returns

## Portal Structure

### Main Dashboard (`business-dashboard.html`)

#### Header
- Company logo and name
- Admin user profile
- Quick stats bar
- Notifications
- Settings
- Billing status

#### Navigation Sidebar
1. **Overview** (Dashboard)
2. **Employees** (User Management)
3. **Analytics** (Wellness Metrics)
4. **Programs** (Wellness Initiatives)
5. **Therapists** (Provider Network)
6. **Billing** (Financial Management)
7. **Reports** (Custom Reporting)
8. **Settings** (Configuration)

## Detailed Section Specifications

### 1. Overview Dashboard
**Purpose**: Executive summary of corporate mental health metrics

#### Key Metrics Cards
- **Enrollment Rate**: % of employees registered
- **Utilization Rate**: % actively using services
- **Wellness Score**: Aggregate employee wellbeing
- **ROI Indicator**: Cost savings estimation
- **Active Sessions**: Current month appointments
- **Support Tickets**: Pending employee queries

#### Visual Components
```
┌─────────────────────────────────────────────────────┐
│ Employee Wellness Trend (Line Chart)               │
│ Shows 6-month wellness score progression           │
├─────────────────┬───────────────────────────────────┤
│ Department      │ Top Issues                        │
│ Breakdown       │ 1. Stress Management (34%)        │
│ (Pie Chart)     │ 2. Work-Life Balance (28%)        │
│                 │ 3. Anxiety (22%)                  │
│                 │ 4. Team Dynamics (16%)            │
├─────────────────┴───────────────────────────────────┤
│ Recent Activity Feed                                │
│ • 5 new employees joined                            │
│ • Q3 wellness report ready                          │
│ • 12 sessions completed this week                   │
└─────────────────────────────────────────────────────┘
```

#### Quick Actions
- Send wellness survey
- Schedule all-hands wellness workshop
- Generate monthly report
- Invite new employees

### 2. Employees Section
**Purpose**: Comprehensive employee wellness management

#### 2.1 Employee Directory
**List View** with filters:
- Search by name/department
- Filter by enrollment status
- Sort by last activity
- Bulk actions menu

**Employee Card Information**:
```javascript
{
  employeeId: "emp_123",
  personalInfo: {
    name: "Anonymous_123", // Anonymized
    department: "Engineering",
    role: "Senior Developer",
    joinDate: "2023-01-15",
    email: "hashed_email@company.com" // Hashed
  },
  wellnessData: {
    enrollmentStatus: "active",
    enrollmentDate: "2023-02-01",
    utilizationRate: 75, // percentage
    lastActivity: "2024-01-10",
    sessionsThisMonth: 2,
    wellnessScore: 7.5, // 0-10
    riskIndicators: ["moderate_stress"]
  },
  engagement: {
    surveysCompleted: 3,
    workshopsAttended: 2,
    resourcesAccessed: 15
  }
}
```

#### 2.2 Invitation Management
**Bulk Invitation System**:
- CSV upload for employee emails
- Custom invitation message
- Department-based invitations
- Scheduled invitation sends
- Follow-up reminders

**Invitation Tracking**:
- Sent/pending/accepted status
- Reminder history
- Conversion rates
- Non-responder reports

#### 2.3 Access Management
- Set therapy session limits
- Configure available services
- Manage employee permissions
- Suspension/reactivation
- Transfer between departments

### 3. Analytics Section
**Purpose**: Deep insights into organizational mental health

#### 3.1 Wellness Metrics Dashboard

**Organizational Health Score**:
```
Overall Score: 7.2/10
├── Engagement: 8.1/10
├── Satisfaction: 7.5/10
├── Stress Level: 6.8/10 (inverse)
└── Support Utilization: 6.4/10
```

**Department Comparison**:
- Heat map of wellness by department
- Trend analysis by team
- Risk identification
- Best practices identification

#### 3.2 Utilization Analytics

**Service Usage Breakdown**:
- Individual therapy: 45%
- Group sessions: 20%
- Wellness workshops: 25%
- Self-help resources: 10%

**Therapist Matching Success**:
- First-match satisfaction: 82%
- Average sessions per employee: 6.3
- Completion rate: 78%

#### 3.3 ROI Calculator

**Cost-Benefit Analysis**:
```
Investment:
- Platform subscription: €5,000/month
- Therapy sessions: €12,000/month
- Total: €17,000/month

Returns:
- Reduced sick days: €8,500/month
- Improved productivity: €15,000/month
- Reduced turnover: €6,000/month
- Total benefit: €29,500/month

ROI: 173% (€12,500 net benefit)
```

**Predictive Analytics**:
- Burnout risk prediction
- Turnover probability
- Productivity forecasting
- Budget optimization suggestions

### 4. Programs Section
**Purpose**: Structured wellness initiatives management

#### 4.1 Wellness Programs

**Available Programs**:
1. **Stress Management Series**
   - 4-week program
   - Weekly group sessions
   - Daily exercises
   - Progress tracking

2. **Leadership Wellness**
   - Manager-specific content
   - Team wellness strategies
   - 1-on-1 coaching option

3. **Work-Life Balance**
   - Flexibility workshops
   - Time management tools
   - Boundary setting

4. **Mindfulness at Work**
   - Daily meditation
   - Desk exercises
   - Stress breaks

**Program Management**:
- Schedule programs
- Assign employees
- Track attendance
- Measure outcomes
- Collect feedback

#### 4.2 Workshops & Events

**Workshop Calendar**:
- Schedule live events
- Virtual workshop options
- Guest speaker sessions
- Lunch & learn series

**Event Analytics**:
- Registration rates
- Attendance tracking
- Satisfaction scores
- Follow-up engagement

#### 4.3 Resource Library

**Content Management**:
- Upload company-specific resources
- Curate Therapy Field content
- Track resource usage
- Measure effectiveness

**Content Types**:
- Articles and guides
- Video tutorials
- Podcast episodes
- Interactive tools
- Emergency resources

### 5. Therapists Section
**Purpose**: Manage therapist network for employees

#### 5.1 Approved Therapists

**Therapist Vetting**:
- View credentials
- Check specializations
- Review employee feedback
- Approval/removal controls

**Network Management**:
- Preferred therapist list
- Specialization matching
- Language requirements
- Location preferences

#### 5.2 Performance Metrics

**Therapist Analytics**:
- Session completion rates
- Employee satisfaction scores
- Average sessions per employee
- Specialization effectiveness

**Quality Assurance**:
- Feedback monitoring
- Issue resolution
- Performance reviews
- Network optimization

### 6. Billing Section
**Purpose**: Financial management and transparency

#### 6.1 Subscription Management

**Plan Details**:
```
Enterprise Plan
- 500 employees included
- Unlimited sessions
- All features enabled
- Priority support
- Custom integrations

Current Usage:
- Active employees: 423/500
- Sessions this month: 287
- Workshops conducted: 5
- Additional charges: €0
```

**Plan Comparison**:
- Upgrade/downgrade options
- Feature comparison
- Pricing calculator
- Contract management

#### 6.2 Invoice Management

**Invoice Dashboard**:
- Current month charges
- Payment history
- Upcoming charges
- Download invoices
- Payment methods

**Detailed Billing**:
- Per-employee breakdown
- Service utilization
- Additional services
- Discount tracking

#### 6.3 Budget Planning

**Budget Tools**:
- Annual budget allocation
- Quarterly forecasting
- Department allocation
- Cost per employee
- Savings tracking

### 7. Reports Section
**Purpose**: Comprehensive reporting for stakeholders

#### 7.1 Standard Reports

**Executive Summary**:
- Monthly wellness report
- Quarterly ROI analysis
- Annual mental health review
- Department comparisons

**Operational Reports**:
- Utilization details
- Engagement metrics
- Program effectiveness
- Therapist performance

#### 7.2 Custom Reports

**Report Builder**:
- Drag-and-drop metrics
- Custom date ranges
- Filter by department/role
- Visualization options
- Export formats (PDF, Excel, CSV)

**Scheduled Reports**:
- Automated generation
- Email distribution
- Stakeholder management
- Report templates

#### 7.3 Compliance Reports

**Regulatory Compliance**:
- GDPR data reports
- Workplace wellness compliance
- Insurance requirements
- Audit trails

### 8. Settings Section
**Purpose**: Platform configuration and administration

#### 8.1 Company Settings

**Organization Info**:
- Company details
- Logo and branding
- Industry classification
- Employee count
- Locations

**Integration Settings**:
- HRIS integration
- SSO configuration
- API access
- Webhook setup

#### 8.2 Admin Management

**User Roles**:
- **Super Admin**: Full access
- **HR Admin**: Employee management
- **Finance Admin**: Billing only
- **Wellness Coordinator**: Programs and analytics
- **Viewer**: Read-only access

**Permissions Matrix**:
```
                 | Super | HR | Finance | Wellness | Viewer
-----------------+-------+----+---------+----------+--------
Employees        |   ✓   | ✓  |         |    ✓     |   👁
Analytics        |   ✓   | ✓  |         |    ✓     |   👁
Billing          |   ✓   |    |    ✓    |          |   👁
Programs         |   ✓   | ✓  |         |    ✓     |   👁
Settings         |   ✓   |    |         |          |
```

#### 8.3 Communication Settings

**Email Templates**:
- Welcome emails
- Reminder messages
- Survey invitations
- Report notifications

**Notification Preferences**:
- Alert thresholds
- Report schedules
- Escalation rules
- Communication channels

## Technical Implementation

### Data Privacy Architecture

**Employee Data Anonymization**:
```javascript
// Anonymization function
function anonymizeEmployee(employee) {
  return {
    id: generateHashId(employee.email),
    displayName: `Employee_${employee.department}_${randomId}`,
    department: employee.department,
    // No PII stored
    wellness: {
      score: employee.wellnessScore,
      trends: employee.trends,
      // Aggregated data only
    }
  };
}

// Data access layers
const getEmployeeData = async (companyId, requesterId) => {
  // Check permissions
  const hasAccess = await checkAdminPermissions(requesterId, 'view_employees');
  
  if (!hasAccess) {
    throw new ForbiddenError();
  }
  
  // Return anonymized data
  const employees = await db.getEmployees(companyId);
  return employees.map(anonymizeEmployee);
};
```

### API Structure

```
/api/v1/business
├── /dashboard
│   ├── GET /metrics
│   ├── GET /activity-feed
│   └── GET /quick-stats
├── /employees
│   ├── GET /list
│   ├── POST /invite
│   ├── PUT /:id/access
│   └── GET /:id/wellness
├── /analytics
│   ├── GET /wellness-metrics
│   ├── GET /utilization
│   ├── GET /roi
│   └── POST /custom-report
├── /programs
│   ├── GET /list
│   ├── POST /create
│   ├── PUT /:id/assign
│   └── GET /:id/metrics
├── /billing
│   ├── GET /current-plan
│   ├── GET /invoices
│   ├── PUT /payment-method
│   └── GET /usage
└── /settings
    ├── GET /company
    ├── PUT /company
    ├── POST /admins
    └── PUT /integrations
```

### Integration Capabilities

#### HRIS Integration
- **Supported Systems**: Workday, BambooHR, ADP, SAP
- **Sync Capabilities**:
  - Employee roster
  - Department structure
  - Role information
  - Onboarding/offboarding

#### SSO Integration
- **Protocols**: SAML 2.0, OAuth 2.0, OpenID Connect
- **Providers**: Azure AD, Google Workspace, Okta, Auth0
- **Features**:
  - Automatic provisioning
  - Just-in-time access
  - Role mapping

#### Communication Tools
- **Slack Integration**:
  - Wellness tips
  - Appointment reminders
  - Anonymous surveys
  - Quick resources

- **Microsoft Teams**:
  - Embedded wellness app
  - Meeting wellness checks
  - Team analytics

## Pricing Models

### Subscription Tiers

#### Starter (10-50 employees)
- €10 per employee/month
- Basic analytics
- Standard support
- 5 workshops/year

#### Professional (50-200 employees)
- €8 per employee/month
- Advanced analytics
- Priority support
- Unlimited workshops
- API access

#### Enterprise (200+ employees)
- €6 per employee/month
- Custom analytics
- Dedicated support
- White-label options
- Full integrations
- SLA guarantee

### Add-on Services
- Executive coaching: €200/session
- Custom workshops: €500/workshop
- Dedicated wellness consultant: €2000/month
- Additional analytics: €500/month

## Implementation Roadmap

### Phase 1: Core Features (Weeks 1-4)
- Business dashboard
- Employee management
- Basic analytics
- Billing integration

### Phase 2: Analytics & Programs (Weeks 5-8)
- Advanced analytics
- Program management
- ROI calculator
- Custom reports

### Phase 3: Integrations (Weeks 9-12)
- HRIS connections
- SSO implementation
- Communication tools
- API development

### Phase 4: Advanced Features (Weeks 13-16)
- AI-powered insights
- Predictive analytics
- Wellness automation
- Mobile app

## Success Metrics

### Platform KPIs
- Company activation rate > 90%
- Employee enrollment > 60%
- Monthly active usage > 40%
- Wellness score improvement > 15%
- Customer retention > 95%

### Business Impact Metrics
- Reduced sick days by 25%
- Improved productivity by 15%
- Reduced turnover by 20%
- ROI > 150%
- Employee satisfaction +2 points

This comprehensive specification provides the blueprint for building a world-class corporate mental health platform that delivers measurable value to businesses while maintaining the highest standards of employee privacy and care.
# INTEGRATION-MAP.md - System Connections and Data Flow

This document maps all system integrations, APIs, and data flows within the Therapy Field platform.

## Document Dependencies
- Referenced by: [CLAUDE.md](./CLAUDE.md)
- Related: [DATABASE-ARCHITECTURE.md](./DATABASE-ARCHITECTURE.md), [GREY-ZONES-ANALYSIS.md](./GREY-ZONES-ANALYSIS.md)

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
├─────────────┬────────────────┬────────────────┬────────────┤
│   Landing   │   User Panel   │ Therapist Dash │  Business  │
│    Page     │  (Client App)  │  (Therapist)   │   Portal   │
└─────────────┴────────────────┴────────────────┴────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   API Gateway      │
                    │  (Rate Limiting,   │
                    │   Auth, Routing)   │
                    └─────────┬──────────┘
                              │
┌─────────────────────────────┼─────────────────────────────┐
│                     Microservices Layer                    │
├──────────┬──────────┬───────┴────┬──────────┬────────────┤
│   Auth   │   User   │ Appointment│ Wellness │  Payment   │
│ Service  │ Service  │  Service   │ Service  │  Service   │
├──────────┴──────────┴────────────┴──────────┴────────────┤
│                    Data Layer                              │
├──────────┬──────────┬────────────┬──────────┬────────────┤
│PostgreSQL│  Redis   │Elasticsearch│  S3/CDN  │TimescaleDB │
└──────────┴──────────┴────────────┴──────────┴────────────┘
```

## API Structure

### 1. Authentication Service

**Base URL**: `/api/v1/auth`

```yaml
Endpoints:
  POST /register:
    - Client registration
    - Therapist pre-registration
    - Business admin setup
    
  POST /login:
    - Multi-role authentication
    - Returns: JWT tokens
    
  POST /refresh:
    - Token refresh
    
  POST /logout:
    - Session termination
    
  POST /verify-email:
    - Email confirmation
    
  POST /reset-password:
    - Password recovery
    
  POST /oauth/{provider}:
    - Google/Facebook login
```

**Integration Points**:
- Redis: Session storage
- Email Service: Verification emails
- SMS Service: 2FA codes

### 2. User Service

**Base URL**: `/api/v1/users`

```yaml
Endpoints:
  GET /profile:
    - Get user profile
    
  PUT /profile:
    - Update profile
    
  POST /upload-avatar:
    - Profile photo upload
    
  GET /preferences:
    - User settings
    
  PUT /preferences:
    - Update settings
    
  DELETE /account:
    - GDPR deletion
```

**Integration Points**:
- S3: Avatar storage
- Auth Service: Permission checks

### 3. Therapist Service

**Base URL**: `/api/v1/therapists`

```yaml
Endpoints:
  GET /search:
    - Location-based search
    - Criteria filtering
    - Quiz matching
    
  GET /{id}:
    - Therapist profile
    
  GET /{id}/availability:
    - Available slots
    
  PUT /profile:
    - Update therapist info
    
  POST /verification:
    - License verification
```

**Integration Points**:
- Google Maps: Geocoding
- Elasticsearch: Full-text search
- Redis: Availability cache

### 4. Appointment Service

**Base URL**: `/api/v1/appointments`

```yaml
Endpoints:
  POST /book:
    - Create appointment
    
  GET /list:
    - User appointments
    
  PUT /{id}/status:
    - Confirm/cancel
    
  GET /{id}:
    - Appointment details
    
  POST /{id}/reschedule:
    - Change time
```

**Integration Points**:
- Payment Service: Process payment
- Email Service: Confirmations
- SMS Service: Reminders
- Calendar APIs: Sync

### 5. Wellness Service

**Base URL**: `/api/v1/wellness`

```yaml
Endpoints:
  POST /mood:
    - Log mood entry
    
  GET /mood/history:
    - Mood trends
    
  POST /journal:
    - Create entry
    
  GET /journal/entries:
    - List entries
    
  POST /goals:
    - Create goal
    
  PUT /goals/{id}/progress:
    - Update progress
```

**Integration Points**:
- TimescaleDB: Time-series data
- ML Service: Insights

### 6. Payment Service

**Base URL**: `/api/v1/payments`

```yaml
Endpoints:
  POST /charge:
    - Process payment
    
  POST /refund:
    - Issue refund
    
  GET /history:
    - Transaction list
    
  POST /subscription:
    - Subscribe to plan
    
  PUT /payment-method:
    - Update card
```

**Integration Points**:
- Viva Wallet API
- Stripe API (backup)
- Invoice Service

## Third-Party Integrations

### 1. Google Services

```javascript
// Google Maps Integration
const mapsConfig = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  libraries: ['places', 'geocoding'],
  language: 'el',
  region: 'GR'
};

// Usage in therapist search
async function geocodeAddress(address) {
  const geocoder = new google.maps.Geocoder();
  const result = await geocoder.geocode({ address });
  return {
    lat: result[0].geometry.location.lat(),
    lng: result[0].geometry.location.lng()
  };
}

// OAuth Configuration
const googleOAuth = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${BASE_URL}/auth/google/callback`,
  scopes: ['profile', 'email']
};
```

### 2. Payment Providers

```javascript
// Viva Wallet Integration
const vivaWallet = {
  merchantId: process.env.VIVA_MERCHANT_ID,
  apiKey: process.env.VIVA_API_KEY,
  clientId: process.env.VIVA_CLIENT_ID,
  clientSecret: process.env.VIVA_CLIENT_SECRET,
  environment: process.env.NODE_ENV === 'production' ? 'live' : 'demo'
};

// Payment flow
async function processPayment(appointmentId, paymentMethod) {
  // 1. Create order in Viva Wallet
  const order = await vivaWallet.createOrder({
    amount: appointment.price * 100, // in cents
    customerEmail: user.email,
    fullName: user.name,
    requestLang: 'el-GR'
  });
  
  // 2. Charge payment method
  const charge = await vivaWallet.charge({
    token: paymentMethod.token,
    orderId: order.OrderCode
  });
  
  // 3. Split payment (platform fee)
  const platformFee = calculatePlatformFee(appointment.price);
  await splitPayment(charge.TransactionId, therapistId, platformFee);
  
  return charge;
}
```

### 3. Communication Services

```javascript
// SendGrid Email Integration
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailTemplates = {
  appointmentConfirmation: 'd-appointment-confirm-template-id',
  appointmentReminder: 'd-appointment-reminder-template-id',
  welcomeEmail: 'd-welcome-template-id',
  passwordReset: 'd-password-reset-template-id'
};

// Twilio SMS Integration
const twilio = require('twilio');
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, message) {
  return twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to
  });
}
```

### 4. Calendar Integrations

```javascript
// Google Calendar Integration
const calendar = google.calendar({ version: 'v3', auth });

async function syncAppointmentToCalendar(appointment, therapist) {
  const event = {
    summary: `Therapy Session with ${appointment.clientName}`,
    location: appointment.location_type === 'online' ? 'Online' : therapist.address,
    description: appointment.notes,
    start: {
      dateTime: appointment.datetime,
      timeZone: 'Europe/Athens',
    },
    end: {
      dateTime: addMinutes(appointment.datetime, appointment.duration),
      timeZone: 'Europe/Athens',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };
  
  return calendar.events.insert({
    calendarId: therapist.calendarId,
    resource: event,
  });
}
```

## Real-Time Features

### WebSocket Architecture

```javascript
// Socket.io configuration
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

// Namespaces
const chatNamespace = io.of('/chat');
const notificationNamespace = io.of('/notifications');
const presenceNamespace = io.of('/presence');

// Chat implementation
chatNamespace.on('connection', (socket) => {
  socket.on('join-session', async (appointmentId) => {
    const hasAccess = await verifySessionAccess(socket.userId, appointmentId);
    if (hasAccess) {
      socket.join(`session-${appointmentId}`);
      
      // Load chat history from Redis
      const history = await redis.lrange(`chat:${appointmentId}`, 0, -1);
      socket.emit('chat-history', history);
    }
  });
  
  socket.on('send-message', async (data) => {
    const message = {
      id: uuid(),
      userId: socket.userId,
      text: data.text,
      timestamp: new Date(),
      appointmentId: data.appointmentId
    };
    
    // Store in Redis
    await redis.rpush(`chat:${data.appointmentId}`, JSON.stringify(message));
    
    // Broadcast to room
    chatNamespace.to(`session-${data.appointmentId}`).emit('new-message', message);
  });
});
```

### Event-Driven Architecture

```javascript
// Event Bus using Redis Pub/Sub
const eventBus = {
  publish: async (event, data) => {
    await redis.publish('therapy-field-events', JSON.stringify({ event, data }));
  },
  
  subscribe: (handler) => {
    const subscriber = redis.duplicate();
    subscriber.subscribe('therapy-field-events');
    subscriber.on('message', (channel, message) => {
      const { event, data } = JSON.parse(message);
      handler(event, data);
    });
  }
};

// Event handlers
eventBus.subscribe((event, data) => {
  switch (event) {
    case 'appointment.booked':
      sendConfirmationEmail(data);
      updateTherapistCalendar(data);
      notifyTherapist(data);
      break;
      
    case 'appointment.cancelled':
      processRefund(data);
      sendCancellationNotice(data);
      updateAvailability(data);
      break;
      
    case 'payment.completed':
      updateAppointmentStatus(data);
      generateInvoice(data);
      updateFinancialRecords(data);
      break;
  }
});
```

## Data Synchronization

### Cross-Module Data Flow

```javascript
// Dashboard aggregation service
async function aggregateDashboardData(userId) {
  const [
    appointments,
    moodData,
    journalStats,
    goalProgress
  ] = await Promise.all([
    getUpcomingAppointments(userId),
    getMoodTrends(userId, 30), // last 30 days
    getJournalStats(userId),
    getActiveGoalsProgress(userId)
  ]);
  
  return {
    appointments: appointments.slice(0, 5),
    moodAverage: calculateMoodAverage(moodData),
    streaks: calculateStreaks(moodData, journalStats, goalProgress),
    weeklyProgress: calculateWeeklyProgress(goalProgress),
    insights: generateInsights(moodData, journalStats)
  };
}

// Therapist access to client data
async function getSharedClientData(therapistId, clientId) {
  // Check permissions
  const permission = await db.query(
    'SELECT * FROM data_sharing_permissions WHERE therapist_id = $1 AND client_id = $2',
    [therapistId, clientId]
  );
  
  if (!permission || !permission.is_active) {
    throw new ForbiddenError('No active data sharing permission');
  }
  
  const sharedData = {};
  
  if (permission.share_mood) {
    sharedData.mood = await getMoodData(clientId, permission.from_date);
  }
  
  if (permission.share_journal) {
    sharedData.journal = await getJournalEntries(clientId, {
      therapistShared: true,
      fromDate: permission.from_date
    });
  }
  
  if (permission.share_goals) {
    sharedData.goals = await getGoalsProgress(clientId);
  }
  
  return sharedData;
}
```

## Caching Strategy

### Redis Cache Layers

```javascript
// Cache configuration
const cacheConfig = {
  therapistSearch: {
    ttl: 300, // 5 minutes
    keyPattern: 'search:therapists:{query_hash}'
  },
  availability: {
    ttl: 60, // 1 minute
    keyPattern: 'availability:{therapist_id}:{date}'
  },
  userProfile: {
    ttl: 3600, // 1 hour
    keyPattern: 'profile:{user_id}'
  },
  dashboardData: {
    ttl: 300, // 5 minutes
    keyPattern: 'dashboard:{user_id}'
  }
};

// Cache middleware
const cacheMiddleware = (cacheKey, ttl) => {
  return async (req, res, next) => {
    const key = cacheKey.replace(/{(\w+)}/g, (match, param) => req.params[param] || req.query[param]);
    
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Store original send function
    const originalSend = res.json;
    res.json = function(data) {
      redis.setex(key, ttl, JSON.stringify(data));
      originalSend.call(this, data);
    };
    
    next();
  };
};

// Cache invalidation
const invalidateCache = async (patterns) => {
  for (const pattern of patterns) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
};
```

## API Gateway Configuration

```nginx
# NGINX API Gateway configuration
upstream auth_service {
    server auth-service:3001;
}

upstream user_service {
    server user-service:3002;
}

upstream appointment_service {
    server appointment-service:3003;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;

server {
    listen 443 ssl http2;
    server_name api.therapyfield.gr;
    
    # SSL configuration
    ssl_certificate /etc/ssl/certs/therapyfield.crt;
    ssl_certificate_key /etc/ssl/private/therapyfield.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Auth endpoints (stricter rate limit)
    location /api/v1/auth {
        limit_req zone=auth_limit burst=5 nodelay;
        proxy_pass http://auth_service;
    }
    
    # API endpoints
    location /api/v1 {
        limit_req zone=api_limit burst=20 nodelay;
        
        # JWT validation
        auth_request /validate;
        auth_request_set $user_id $upstream_http_x_user_id;
        proxy_set_header X-User-Id $user_id;
        
        # Route to appropriate service
        location ~ ^/api/v1/users {
            proxy_pass http://user_service;
        }
        
        location ~ ^/api/v1/appointments {
            proxy_pass http://appointment_service;
        }
    }
    
    # Internal JWT validation endpoint
    location = /validate {
        internal;
        proxy_pass http://auth_service/validate;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-URI $request_uri;
    }
}
```

## Monitoring & Observability

```javascript
// OpenTelemetry setup
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

const sdk = new NodeSDK({
  traceExporter: new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': {
        enabled: false,
      },
    }),
  ],
});

// Custom metrics
const meter = metrics.getMeter('therapy-field');

const appointmentCounter = meter.createCounter('appointments_created', {
  description: 'Number of appointments created',
});

const paymentHistogram = meter.createHistogram('payment_processing_duration', {
  description: 'Payment processing duration in milliseconds',
  unit: 'ms',
});

// Health checks
app.get('/health', async (req, res) => {
  const checks = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkElasticsearch(),
    checkPaymentProvider(),
  ]);
  
  const allHealthy = checks.every(check => check.status === 'healthy');
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    services: checks,
    timestamp: new Date().toISOString()
  });
});
```

## Security Measures

```javascript
// API Security middleware stack
app.use(helmet()); // Security headers
app.use(cors(corsOptions)); // CORS configuration
app.use(rateLimit(limiterOptions)); // Rate limiting
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // XSS protection

// Request signing for webhooks
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  
  const payload = `${timestamp}.${JSON.stringify(req.body)}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Prevent replay attacks
  const currentTime = Date.now() / 1000;
  if (currentTime - parseInt(timestamp) > 300) { // 5 minutes
    return res.status(401).json({ error: 'Request too old' });
  }
  
  next();
};
```

This integration map provides a comprehensive view of how all components connect and communicate within the Therapy Field platform.

Last Updated: 2024-01-23
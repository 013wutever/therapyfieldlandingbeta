// Therapist Availability Data Management
// Covers 5 years of availability data for all therapists

// Time period definitions
window.timePeriods = {
  morning: { start: 7, end: 11, label: 'Morning' },
  noon: { start: 12, end: 13, label: 'Noon' },
  afternoon: { start: 14, end: 17, label: 'Afternoon' },
  evening: { start: 18, end: 21, label: 'Evening' },
  night: { start: 22, end: 23, label: 'Night' }
};

// Get time period for a given hour
window.getTimePeriod = function(hour) {
  for (const [period, config] of Object.entries(window.timePeriods)) {
    if (hour >= config.start && hour <= config.end) {
      return period;
    }
  }
  return 'other';
};

// Get next 5 years date range
window.getDateRange = function() {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(startDate.getFullYear() + 5);
  return { startDate, endDate };
};

// Generate GUARANTEED availability patterns - simplified and reliable
window.generateTherapistAvailability = function(therapistId) {
  const { startDate, endDate } = window.getDateRange();
  const availability = {};
  
  console.log(`🕐 Generating GUARANTEED availability for therapist ${therapistId}`);
  
  const currentDate = new Date(startDate);
  let slotsGenerated = 0;
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    
    availability[dateStr] = {};
    
    // Generate availability for every day with guaranteed slots
    for (let hour = 7; hour <= 23; hour++) {
      const period = window.getTimePeriod(hour);
      let isAvailable = false;
      
      // GUARANTEE availability during specific hours for each therapist
      const guaranteedHours = [
        9, 10, 11, // Morning slots
        14, 15, 16, // Afternoon slots 
        18, 19, 20  // Evening slots
      ];
      
      // Each therapist gets different guaranteed hours based on their ID
      const therapistHours = guaranteedHours.filter((h, index) => (index + therapistId) % 3 === 0);
      
      if (therapistHours.includes(hour)) {
        // GUARANTEED availability for specific hours
        isAvailable = true;
      } else {
        // Random availability for other hours (50% chance)
        isAvailable = Math.random() < 0.5;
      }
      
      // Skip weekends for some therapists
      const worksWeekends = therapistId % 3 === 0;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      if (isWeekend && !worksWeekends) {
        isAvailable = false;
      }
      
      // Small chance of being already booked
      const isBooked = Math.random() < 0.05; // 5% chance
      
      availability[dateStr][hour] = {
        available: isAvailable && !isBooked,
        booked: isBooked,
        period: period,
        price: window.getTherapistPrice(therapistId)
      };
      
      if (isAvailable && !isBooked) {
        slotsGenerated++;
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  console.log(`✅ Generated ${slotsGenerated} available slots for therapist ${therapistId}`);
  return availability;
};

// Get consistent price per therapist (single price for all sessions)
window.getTherapistPrice = function(therapistId) {
  // Get the therapist data to use their actual cost
  if (window.therapistData && window.therapistData[therapistId]) {
    return window.therapistData[therapistId].cost;
  }
  
  // Fallback to base rates if therapist data not available
  const baseRates = [80, 90, 100, 110, 120, 85, 95, 105, 115, 125];
  return baseRates[therapistId % baseRates.length];
};

// Initialize availability data for all therapists
window.initializeAvailabilityData = function() {
  if (!window.therapistData) {
    console.error('❌ Therapist data not loaded');
    return;
  }
  
  console.log('🗓️ Generating availability data for', window.therapistData.length, 'therapists...');
  
  window.therapistAvailability = {};
  
  window.therapistData.forEach((therapist, index) => {
    const therapistId = therapist.id || index;
    console.log(`🔧 Generating availability for therapist ${therapistId}: Dr. ${therapist.first_name} ${therapist.last_name}`);
    window.therapistAvailability[therapistId] = window.generateTherapistAvailability(therapistId);
    
    // Debug: Check if any availability was generated
    const availabilityCount = Object.keys(window.therapistAvailability[therapistId]).length;
    console.log(`📊 Generated ${availabilityCount} days of availability for therapist ${therapistId}`);
  });
  
  console.log('✅ Availability data generated for 5 years');
};

// Get next available appointments for a therapist
window.getNextAvailableAppointments = function(therapistId, count = 3) {
  if (!window.therapistAvailability || !window.therapistAvailability[therapistId]) {
    console.log(`❌ No availability data for therapist ${therapistId}`);
    return [];
  }
  
  const availability = window.therapistAvailability[therapistId];
  const appointments = [];
  const now = new Date();
  const minimumBookingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000)); // 8 hours from now
  
  console.log(`🔍 Looking for next ${count} appointments for therapist ${therapistId}`);
  console.log(`⏰ Current time: ${now.toISOString()}`);
  console.log(`⏰ Minimum booking time: ${minimumBookingTime.toISOString()}`);
  
  // Look through next 90 days to find available slots
  for (let i = 0; i < 90 && appointments.length < count; i++) {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    if (availability[dateStr]) {
      let dailySlots = 0;
      
      for (let hour = 7; hour <= 23; hour++) {
        const slot = availability[dateStr][hour];
        if (slot && slot.available && !slot.booked) {
          const slotDateTime = new Date(currentDate);
          slotDateTime.setHours(hour, 0, 0, 0);
          
          // Only show slots that are 8+ hours from now
          const hoursFromNow = (slotDateTime - now) / (1000 * 60 * 60);
          if (slotDateTime <= minimumBookingTime) {
            continue;
          }
          
          console.log(`✅ Found valid slot: ${dateStr} ${hour}:00 (${hoursFromNow.toFixed(1)}h away)`);
          
          appointments.push({
            date: dateStr,
            hour: hour,
            period: slot.period,
            price: slot.price,
            formatted: {
              date: currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }),
              time: `${hour.toString().padStart(2, '0')}:00`,
              period: window.timePeriods[slot.period]?.label || slot.period
            }
          });
          
          dailySlots++;
          if (appointments.length >= count) break;
        }
      }
      
      if (dailySlots > 0) {
        console.log(`📅 ${dateStr}: Found ${dailySlots} available slots`);
      }
    }
  }
  
  console.log(`🎯 Quick booking result: ${appointments.length} appointments found`);
  if (appointments.length > 0) {
    appointments.forEach((appt, index) => {
      console.log(`   ${index + 1}. ${appt.formatted.date} at ${appt.formatted.time}`);
    });
  }
  
  return appointments;
};

// Get next available multi-hour appointments for a therapist
window.getNextAvailableMultiHourAppointments = function(therapistId, duration, count = 3) {
  if (!window.therapistAvailability || !window.therapistAvailability[therapistId]) {
    console.log(`❌ No availability data for therapist ${therapistId}`);
    return [];
  }
  
  console.log(`🔍 Looking for ${duration}-hour slots for therapist ${therapistId}`);
  
  const appointments = [];
  const now = new Date();
  const minimumBookingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000)); // 8 hours from now
  
  // Look through next 90 days to find available consecutive slots
  for (let i = 0; i < 90 && appointments.length < count; i++) {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    const availableSlots = window.getAvailableSlotsForDuration(therapistId, dateStr, duration);
    console.log(`📅 ${dateStr}: Found ${availableSlots.length} available ${duration}-hour slots`);
    
    for (const slot of availableSlots) {
      if (appointments.length >= count) break;
      
      // Check if slot starts 8+ hours from now
      const slotDateTime = new Date(currentDate);
      slotDateTime.setHours(slot.startHour, 0, 0, 0);
      
      const hoursFromNow = (slotDateTime - now) / (1000 * 60 * 60);
      if (slotDateTime <= minimumBookingTime) {
        console.log(`⏰ Skipping ${duration}h slot at ${slot.startHour}:00 on ${dateStr} - only ${hoursFromNow.toFixed(1)} hours away (need 8+)`);
        continue;
      }
      
      console.log(`✅ Adding ${duration}-hour slot: ${dateStr} ${slot.startHour}:00-${slot.endHour + 1}:00 (${hoursFromNow.toFixed(1)} hours away)`);
      
      appointments.push({
        date: dateStr,
        hour: slot.startHour,
        duration: duration,
        period: window.getTimePeriod(slot.startHour),
        price: slot.price,
        formatted: {
          date: currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          time: `${slot.startHour.toString().padStart(2, '0')}:00-${(slot.endHour + 1).toString().padStart(2, '0')}:00`,
          period: window.timePeriods[window.getTimePeriod(slot.startHour)]?.label || window.getTimePeriod(slot.startHour)
        }
      });
    }
    
    if (appointments.length >= count) break;
  }
  
  console.log(`🎯 Final result: ${appointments.length} multi-hour appointments found`);
  return appointments;
};

// Get availability for a specific date
window.getAvailabilityForDate = function(therapistId, dateStr) {
  if (!window.therapistAvailability || !window.therapistAvailability[therapistId]) {
    return null;
  }
  
  return window.therapistAvailability[therapistId][dateStr] || null;
};

// Book an appointment slot
window.bookAppointment = function(therapistId, dateStr, hour) {
  if (!window.therapistAvailability || !window.therapistAvailability[therapistId]) {
    return false;
  }
  
  const slot = window.therapistAvailability[therapistId][dateStr]?.[hour];
  if (slot && slot.available && !slot.booked) {
    slot.booked = true;
    slot.available = false;
    slot.bookedAt = new Date().toISOString();
    return true;
  }
  
  return false;
};

// Check if consecutive time slots are available for multi-hour appointments
window.checkConsecutiveAvailability = function(therapistId, dateStr, startHour, duration) {
  const availability = window.getAvailabilityForDate(therapistId, dateStr);
  if (!availability) return false;
  
  // Check if all required consecutive hours are available
  for (let hour = startHour; hour < startHour + duration; hour++) {
    const slot = availability[hour];
    if (!slot || !slot.available || slot.booked) {
      return false;
    }
  }
  
  return true;
};

// Get available time slots for a specific duration
window.getAvailableSlotsForDuration = function(therapistId, dateStr, duration) {
  const availability = window.getAvailabilityForDate(therapistId, dateStr);
  if (!availability) {
    console.log(`❌ No availability data for ${therapistId} on ${dateStr}`);
    return [];
  }
  
  const availableSlots = [];
  
  // Check each possible starting hour
  for (let startHour = 7; startHour <= 23 - duration + 1; startHour++) {
    const hasConsecutive = window.checkConsecutiveAvailability(therapistId, dateStr, startHour, duration);
    
    if (hasConsecutive) {
      const price = availability[startHour]?.price || 75;
      availableSlots.push({
        startHour: startHour,
        endHour: startHour + duration - 1,
        duration: duration,
        price: price
      });
      console.log(`✅ Found ${duration}h slot: ${startHour}:00-${startHour + duration}:00 (€${price})`);
    } else {
      // Debug why this slot isn't available
      let reason = '';
      for (let hour = startHour; hour < startHour + duration; hour++) {
        const slot = availability[hour];
        if (!slot) {
          reason += `${hour}:no-data `;
        } else if (!slot.available) {
          reason += `${hour}:unavailable `;
        } else if (slot.booked) {
          reason += `${hour}:booked `;
        }
      }
      if (reason) {
        console.log(`❌ ${startHour}:00-${startHour + duration}:00 not available: ${reason.trim()}`);
      }
    }
  }
  
  console.log(`📊 Total ${duration}h slots found for ${dateStr}: ${availableSlots.length}`);
  return availableSlots;
};

// Book consecutive time slots for multi-hour appointments
window.bookConsecutiveSlots = function(therapistId, dateStr, startHour, duration) {
  const availability = window.therapistAvailability[therapistId][dateStr];
  if (!availability) return false;
  
  // First check if all slots are still available
  if (!window.checkConsecutiveAvailability(therapistId, dateStr, startHour, duration)) {
    return false;
  }
  
  // Book all consecutive slots
  for (let hour = startHour; hour < startHour + duration; hour++) {
    availability[hour].booked = true;
    availability[hour].available = false;
    availability[hour].bookedAt = new Date().toISOString();
  }
  
  return true;
};

console.log('📅 Therapist availability management loaded'); 
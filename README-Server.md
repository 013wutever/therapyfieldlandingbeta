# 🌍 Therapy Field Local Server

## Quick Start

### Method 1: Using the Start Script (Recommended)
```bash
./start-server.sh
```

### Method 2: Using Python directly
```bash
python3 -m http.server 8000
```

### Method 3: Using the Custom Server
```bash
python3 start-server.py
```

## 🌐 Accessing Your Application

Once the server is running, open your browser and go to:
**http://localhost:8000/user-panel.html**

## 🧪 Testing Geolocation

1. **Click "Find Therapist"** → Should see location permission prompt immediately
2. **Allow location access** → Button changes to show location is being requested
3. **Navigate to options** → Select Location, Criteria, or Quiz
4. **Select "Location"** → Map loads instantly with your location and therapists sorted by distance

## 🔍 Debug Tips

- **Open Browser Console (F12)** to see debug messages
- **Look for 🌍 🗺️ 📍 emojis** in console for geolocation events
- **Check Network tab** to ensure all files load properly
- **Make sure to allow location permission** when browser prompts

## 🛑 Stopping the Server

Press `Ctrl+C` in the terminal to stop the server.

## ⚠️ Important Notes

- **Geolocation only works on localhost/HTTPS** - not on file:// protocol
- **Allow location permission** when prompted by browser
- **Use Chrome or Firefox** for best compatibility
- **Check console for any JavaScript errors**

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:8000 | xargs kill
```

### Permission Denied
```bash
chmod +x start-server.sh
chmod +x start-server.py
```

### Python Not Found
Install Python from: https://python.org

## 🎯 What Should Happen

1. Click "Find Therapist" → Geolocation permission prompt appears
2. Allow location → Server processes your coordinates
3. Select "Location" → Map loads with your position
4. Therapists are sorted by distance from your location
5. Each therapist card shows distance (e.g., "2.3 km away")

Enjoy testing your geolocation-enabled therapy finder! 🎉
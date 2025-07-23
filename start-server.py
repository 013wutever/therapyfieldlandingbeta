#!/usr/bin/env python3
"""
Simple HTTP Server for Therapy Field Application
This server enables HTTPS/localhost access required for geolocation API
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Server configuration
PORT = 8000
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers to allow geolocation
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # Custom logging to show file access
        if self.path.endswith('.html'):
            print(f"📄 Serving: {self.path}")
        elif self.path.endswith(('.js', '.css')):
            print(f"📁 Loading: {self.path}")
        else:
            super().log_message(format, *args)

def main():
    print("🌍 Therapy Field Local Server")
    print("=" * 50)
    
    # Change to the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"📂 Serving files from: {script_dir}")
    
    try:
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🚀 Server started at http://{HOST}:{PORT}")
            print(f"📱 Open your browser to: http://{HOST}:{PORT}/user-panel.html")
            print(f"🌍 Geolocation will work on localhost!")
            print("\n🔧 Debug tips:")
            print("- Open browser console (F12) to see debug messages")
            print("- Look for 🌍 emojis in console for geolocation events")
            print("- Make sure to allow location permission when prompted")
            print("\n⏹️  Press Ctrl+C to stop the server")
            print("=" * 50)
            
            # Automatically open browser
            try:
                webbrowser.open(f'http://{HOST}:{PORT}/user-panel.html')
            except:
                pass
                
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use!")
            print(f"💡 Try a different port or close other servers")
            print(f"💡 Or run: lsof -ti:{PORT} | xargs kill")
        else:
            print(f"❌ Server error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()
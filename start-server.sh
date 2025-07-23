#!/bin/bash
# Start Therapy Field Local Server
# Double-click this file or run: ./start-server.sh

echo "🌍 Starting Therapy Field Local Server..."
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    python3 start-server.py
elif command -v python &> /dev/null; then
    echo "✅ Python found"
    python start-server.py
else
    echo "❌ Python not found!"
    echo "💡 Please install Python from https://python.org"
    read -p "Press Enter to exit..."
    exit 1
fi
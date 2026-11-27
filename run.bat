@echo off
echo ========================================================
echo        Business Empire - Expo Server Startup
echo ========================================================
echo.
echo [1/2] Syncing latest web game changes to Native App...
node buildBundle.js
echo.
echo [2/2] Starting Expo Go server (clearing cache for safe loads)...
cd expo-app
call npx expo start -c
pause

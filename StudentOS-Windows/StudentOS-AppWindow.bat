@echo off
title StudentOS Desktop Launcher
setlocal EnableDelayedExpansion

set "APP_DIR=%~dp0"
set "INDEX_PATH=%APP_DIR%dist\index.html"
set "FILE_URI=file:///%INDEX_PATH:\=/%"

:: Check for Microsoft Edge (Standard on Windows 10 & 11)
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="%FILE_URI%" --window-size=1366,800 --user-data-dir="%LOCALAPPDATA%\StudentOS\profile"
    exit /b 0
)

if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" --app="%FILE_URI%" --window-size=1366,800 --user-data-dir="%LOCALAPPDATA%\StudentOS\profile"
    exit /b 0
)

:: Check for Google Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="%FILE_URI%" --window-size=1366,800 --user-data-dir="%LOCALAPPDATA%\StudentOS\profile"
    exit /b 0
)

if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="%FILE_URI%" --window-size=1366,800 --user-data-dir="%LOCALAPPDATA%\StudentOS\profile"
    exit /b 0
)

:: Fallback standard opener
start "" "%INDEX_PATH%"
exit /b 0

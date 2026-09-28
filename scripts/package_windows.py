import os
import shutil
import zipfile
from build_windows_exe import create_windows_x64_exe

def package_windows_app():
    target_dir = "StudentOS-Windows"
    zip_name = "StudentOS-Windows.zip"
    
    # 1. Clean and prepare target directory
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
    os.makedirs(target_dir, exist_ok=True)
    
    # 2. Build the native Windows x64 executable
    exe_path = os.path.join(target_dir, "StudentOS.exe")
    create_windows_x64_exe(exe_path)
    
    # Also create a copy in the root workspace
    create_windows_x64_exe("StudentOS.exe")
    
    # 3. Create helper Windows Launchers
    bat_content = """@echo off
title StudentOS Desktop Launcher
setlocal EnableDelayedExpansion

set "APP_DIR=%~dp0"
set "INDEX_PATH=%APP_DIR%dist\\index.html"
set "FILE_URI=file:///%INDEX_PATH:\\=/%"

:: Check for Microsoft Edge (Standard on Windows 10 & 11)
if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" --app="%FILE_URI%" --window-size=1366,800 --user-data-dir="%LOCALAPPDATA%\\StudentOS\\profile"
    exit /b 0
)

if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
    start "" "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" --app="%FILE_URI%" --window-size=1366,800 --user-data-dir="%LOCALAPPDATA%\\StudentOS\\profile"
    exit /b 0
)

:: Check for Google Chrome
if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" --app="%FILE_URI%" --window-size=1366,800 --user-data-dir="%LOCALAPPDATA%\\StudentOS\\profile"
    exit /b 0
)

if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    start "" "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" --app="%FILE_URI%" --window-size=1366,800 --user-data-dir="%LOCALAPPDATA%\\StudentOS\\profile"
    exit /b 0
)

:: Fallback standard opener
start "" "%INDEX_PATH%"
exit /b 0
"""
    with open(os.path.join(target_dir, "StudentOS-AppWindow.bat"), "w", encoding="utf-8") as f:
        f.write(bat_content)

    # 4. Copy production dist directory
    dist_src = "dist"
    dist_dest = os.path.join(target_dir, "dist")
    if os.path.exists(dist_src):
        shutil.copytree(dist_src, dist_dest)
        
    # 5. Copy electron directory
    electron_src = "electron"
    electron_dest = os.path.join(target_dir, "electron")
    if os.path.exists(electron_src):
        shutil.copytree(electron_src, electron_dest)
        
    # 6. Copy public directory & icons
    public_src = "public"
    public_dest = os.path.join(target_dir, "public")
    if os.path.exists(public_src):
        shutil.copytree(public_src, public_dest)
        
    build_src = "build"
    build_dest = os.path.join(target_dir, "build")
    if os.path.exists(build_src):
        shutil.copytree(build_src, build_dest)
        
    # 7. Copy package.json
    shutil.copy2("package.json", os.path.join(target_dir, "package.json"))
    
    # 8. Create README-WINDOWS.txt
    readme_content = """========================================================================
   StudentOS — المنصة التعليمية الذكية لطلاب وأساتذة التعليم الثانوي بالجزائر
   Windows 10 / 11 Desktop Edition (x64)
========================================================================

شعار المنصة: Plan. Study. Focus. Remember. Improve.

------------------------------------------------------------------------
طريقة التشغيل على نظام Windows 10 / 11:
------------------------------------------------------------------------
1. فك ضغط المجلد StudentOS-Windows.zip.
2. افتح المجلد المستخرج.
3. انقر نقراً مزدوجاً على:
      StudentOS.exe
   أو StudentOS-AppWindow.bat

سيتم تشغيل تطبيق StudentOS فورياً كنافذة تطبيق مكتب مستقلة بأبعاد 1366x800 
دون الحاجة لأي خادم محلي ودون الحاجة لتثبيت Node.js أو Electron أو أي برامج إضافية.

------------------------------------------------------------------------
الميزات المدعومة في وضع سطح المكتب (Offline & Online):
------------------------------------------------------------------------
✓ دعم كامل للمنهاج الجزائري (1AS / 2AS / 3AS بكالوريا لجميع الشعب والتخصصات).
✓ غرفة التركيز وبومودورو مع أصوات هادئة قابلة للعمل بالكامل دون إنترنت.
✓ بطاقات التكرار المتباعد (Spaced Repetition & Flashcards) بنظام لايتنر.
✓ إدارة المهام والجدول الأسبوعي وحساب مواقيت الصلاة لجميع الولايات.
✓ حفظ وتخزين محلي كامل (IndexedDB & LocalStorage) لا يضيع البيانات.
✓ ملء الشاشة (F11) والبحث السريع الفوري (Ctrl + K).
✓ الأدوار الأربعة: طالب، أستاذ، ولي أمر، مدير نظام.

------------------------------------------------------------------------
للتواصل والدعم البيداغوجي:
StudentOS DZ — منصة التعليم الثانوي في الجزائر
========================================================================
"""
    with open(os.path.join(target_dir, "README-WINDOWS.txt"), "w", encoding="utf-8") as f:
        f.write(readme_content)
        
    # 9. Create the ZIP archive
    if os.path.exists(zip_name):
        os.remove(zip_name)
        
    print(f"Creating {zip_name}...")
    with zipfile.ZipFile(zip_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(target_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, os.path.dirname(target_dir))
                zipf.write(file_path, arcname)
                
    zip_size_mb = os.path.getsize(zip_name) / (1024 * 1024)
    print(f"Successfully packaged: {zip_name} ({zip_size_mb:.2f} MB)")

if __name__ == '__main__':
    package_windows_app()

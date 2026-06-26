@echo off
setlocal enabledelayedexpansion

color 07
echo ============================================
echo  Memory Bank ^& Workspace Rules - Test Suite
echo ============================================
echo.

set PASS=0
set FAIL=0

REM ============================================
REM Suite 1 - Structural Integrity
REM ============================================
echo [Suite 1] Structural Integrity
echo --------------------------------------------

REM Test 1.1
if exist ".agent_memory\." (
    call :pass "1.1" ".agent_memory directory exists"
) else (
    call :fail "1.1" ".agent_memory directory is MISSING"
)

REM Test 1.2
findstr /c:"Active Session Handoff" .agent_memory\session_handoff.md >nul 2>&1
if %errorlevel% equ 0 (
    call :pass "1.2" "session_handoff.md has correct content"
) else (
    call :fail "1.2" "session_handoff.md missing or incorrect"
)

REM Test 1.3
findstr /c:"Initialized Memory Bank" .agent_memory\changelog.md >nul 2>&1
if %errorlevel% equ 0 (
    call :pass "1.3" "changelog.md has correct content"
) else (
    call :fail "1.3" "changelog.md missing or incorrect"
)

REM Test 1.4
findstr /c:"Global Project Context" .agent_memory\project_context.md >nul 2>&1
if %errorlevel% equ 0 (
    call :pass "1.4" "project_context.md has correct content"
) else (
    call :fail "1.4" "project_context.md missing or incorrect"
)

REM Test 1.5
set count=0
for /f %%a in ('findstr /r "^## " .clinerules 2^>nul') do set /a count+=1
if !count! equ 3 (
    call :pass "1.5" ".clinerules has all 3 rule sections"
) else (
    call :fail "1.5" ".clinerules has !count! sections (expected 3)"
)

echo.

REM ============================================
REM Suite 2 - Handoff Protocol Simulation
REM ============================================
echo [Suite 2] Handoff Protocol Simulation
echo --------------------------------------------

REM Test 2.1 - Write mock handoff state
echo # Active Session Handoff> .agent_memory\session_handoff.md
echo - **Last Action Taken:** Ran test suite>> .agent_memory\session_handoff.md
echo - **Current Blocker:** None>> .agent_memory\session_handoff.md
echo - **Next Immediate Step:** Review test results.>> .agent_memory\session_handoff.md
echo - **Unfinished Checklist:** None>> .agent_memory\session_handoff.md
findstr /c:"Ran test suite" .agent_memory\session_handoff.md >nul 2>&1
if %errorlevel% equ 0 (
    call :pass "2.1" "Write mock handoff state succeeded"
) else (
    call :fail "2.1" "Write mock handoff state failed"
)

REM Test 2.2 - Append to changelog
echo * 2026-06-26 - Ran memory bank test suite.>> .agent_memory\changelog.md
findstr /c:"Ran memory bank test suite" .agent_memory\changelog.md >nul 2>&1
if %errorlevel% equ 0 (
    call :pass "2.2" "Append to changelog succeeded"
) else (
    call :fail "2.2" "Append to changelog failed"
)

REM Test 2.3 - Restore original boilerplate
type nul > .agent_memory\session_handoff.md
echo # Active Session Handoff>> .agent_memory\session_handoff.md
echo - **Last Action Taken:** (Initialize Memory Bank)>> .agent_memory\session_handoff.md
echo - **Current Blocker:** None>> .agent_memory\session_handoff.md
echo - **Next Immediate Step:** Await user prompt.>> .agent_memory\session_handoff.md
echo - **Unfinished Checklist:** None>> .agent_memory\session_handoff.md
findstr /c:"Await user prompt" .agent_memory\session_handoff.md >nul 2>&1
if %errorlevel% equ 0 (
    call :pass "2.3" "Restored original session_handoff.md boilerplate"
) else (
    call :fail "2.3" "Restore original boilerplate failed"
)

echo.

REM ============================================
REM Suite 3 - Delegation Protocol Documentation
REM ============================================
echo [Suite 3] Delegation Protocol Documentation
echo --------------------------------------------
findstr /c:"Asynchronous Handoff" .clinerules >nul 2>&1
if %errorlevel% equ 0 (
    call :pass "3.1" "Section 2 documents async handoff protocol (user-bridged)"
) else (
    call :fail "3.1" "Section 2 missing async handoff documentation"
)

echo.

REM ============================================
REM Summary
REM ============================================
echo ============================================
echo  Results: !PASS! passed, !FAIL! failed
echo ============================================
if !FAIL! gtr 0 (
    echo  SOME TESTS FAILED - review output above.
) else (
    echo  ALL TESTS PASSED.
)
echo.
exit /b !FAIL!

REM ============================================
REM Subroutines
REM ============================================
:pass
set /a PASS+=1
echo   PASS %~1: %~2
exit /b 0

:fail
set /a FAIL+=1
echo   FAIL %~1: %~2
exit /b 0
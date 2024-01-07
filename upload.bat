@echo off

if not %1=="" (
    color 02
    cls
    git add -A
    git commit -m %1
    echo Commiting with message: %1
    git push origin
    echo Successfully pushed files to main branch.
) else (
    cls
    color 04
    echo Please add a commit message!
    pause
    color 0f
)
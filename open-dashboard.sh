#!/bin/bash

# OS判定
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if [[ -n "$WSL_DISTRO_NAME" ]]; then
        # WSL
        cmd.exe /c start http://localhost:5000/dashboard.html
    else
        # Native Linux
        xdg-open http://localhost:5000/dashboard.html
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac OSX
    open http://localhost:5000/dashboard.html
elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    start http://localhost:5000/dashboard.html
else
    echo "ブラウザで以下のURLを開いてください："
    echo "http://localhost:5000/dashboard.html"
fi
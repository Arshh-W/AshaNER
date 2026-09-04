#!/usr/bin/env bash
set -e

echo "==> Setting up Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "==> Preparing external dependencies..."
mkdir -p external/onnxruntime external/sqlite3 models

if [ ! -f "external/sqlite3/sqlite3.c" ]; then
    echo "Fetching SQLite amalgamation..."
    curl -s https://www.sqlite.org/2024/sqlite-amalgamation-3450200.zip -o sqlite.zip
    unzip -q sqlite.zip
    mv sqlite-amalgamation-3450200/sqlite3.c external/sqlite3/
    mv sqlite-amalgamation-3450200/sqlite3.h external/sqlite3/
    rm -rf sqlite.zip sqlite-amalgamation-3450200
fi

ORT_VERSION="1.17.3"
OS_TYPE="$(uname -s)"
if [ "$OS_TYPE" = "Linux" ]; then
    ORT_TAR="onnxruntime-linux-x64-${ORT_VERSION}.tgz"
elif [ "$OS_TYPE" = "Darwin" ]; then
    ORT_TAR="onnxruntime-osx-arm64-${ORT_VERSION}.tgz"
else
    echo "Unsupported host OS for automated script. Manually place ORT binaries in external/onnxruntime/"
    exit 1
fi

if [ ! -f "external/onnxruntime/lib/libonnxruntime.so" ] && [ ! -f "external/onnxruntime/lib/libonnxruntime.dylib" ]; then
    echo "Fetching ONNX Runtime C++ (${ORT_VERSION})..."
    curl -sL "https://github.com/microsoft/onnxruntime/releases/download/v${ORT_VERSION}/${ORT_TAR}" -o ort.tgz
    tar -xzf ort.tgz
    cp -r onnxruntime-*/include external/onnxruntime/
    cp -r onnxruntime-*/lib external/onnxruntime/
    rm -rf ort.tgz onnxruntime-*
fi

echo "==> Workspace setup complete."
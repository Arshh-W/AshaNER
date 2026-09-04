FROM debian:bookworm-slim AS engine-builder

ARG ONNXRUNTIME_VERSION=1.20.1
WORKDIR /src

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates cmake g++ make wget \
    && rm -rf /var/lib/apt/lists/*

COPY backend /src/backend
RUN mkdir -p /src/backend/external/onnxruntime \
    && wget -q "https://github.com/microsoft/onnxruntime/releases/download/v${ONNXRUNTIME_VERSION}/onnxruntime-linux-x64-${ONNXRUNTIME_VERSION}.tgz" -O /tmp/onnxruntime.tgz \
    && tar -xzf /tmp/onnxruntime.tgz -C /tmp \
    && cp -R "/tmp/onnxruntime-linux-x64-${ONNXRUNTIME_VERSION}/include" /src/backend/external/onnxruntime/ \
    && cp -R "/tmp/onnxruntime-linux-x64-${ONNXRUNTIME_VERSION}/lib" /src/backend/external/onnxruntime/

RUN cmake -S /src/backend -B /src/build -DCMAKE_BUILD_TYPE=Release \
    && cmake --build /src/build --config Release --target mace_core

FROM python:3.12-slim AS runtime

WORKDIR /app/backend
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app/backend
COPY --from=engine-builder /src/build/mace_core /app/backend/mace_core
COPY --from=engine-builder /src/backend/external/onnxruntime/lib /app/backend/external/onnxruntime/lib

EXPOSE 8000
CMD ["sh", "-c", "python scripts/export_models.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
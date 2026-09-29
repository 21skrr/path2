# ─────────────────────────────────────────────────────────────
# HR Platform Backend – Dockerfile
# Multi-stage: Maven build → slim JRE runtime
# ─────────────────────────────────────────────────────────────

# ── Stage 1: Build ──────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /build

# Copy dependency manifests first for better layer caching
COPY pom.xml ./
# Download dependencies (offline-friendly on subsequent builds)
RUN --mount=type=cache,target=/root/.m2 \
    mvn --batch-mode dependency:go-offline -f pom.xml 2>/dev/null || true

# Copy source and build
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 \
    mvn --batch-mode -f pom.xml clean package -DskipTests

# ── Stage 2: Runtime ────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runtime

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

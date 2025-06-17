# Build backend
FROM node:22

WORKDIR /app

# Install SQLite (Debian package)
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

# Copy package files first for better caching
COPY package*.json ./

# Install ONLY production dependencies (skip husky and dev tools)
RUN npm install --omit=dev

# Copy app files
COPY . .

# 5. FORCE make the entrypoint executable (critical!)
RUN chmod +x docker-entrypoint.sh && \
    sh -c 'echo "Entrypoint permissions:" && ls -la docker-entrypoint.sh'

# 6. Verify the file exists and is executable
RUN [ -x "docker-entrypoint.sh" ] || (echo "ERROR: Entrypoint not executable!" && exit 1)

EXPOSE 8888
# ENTRYPOINT [ "./docker-entrypoint.sh" ]
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
# Base stage with node image and essential packages installed
FROM node:18-alpine as base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 3000

# Builder stage: Builds the Next.js application
FROM base as builder
COPY . .
RUN npm run build

# Production stage: Sets up the production environment with only necessary files
FROM node:18-alpine as production
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY --from=base /app/package*.json ./
RUN npm ci --only=production

# Create and switch to a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs
USER nextjs

# Copy necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json

CMD ["npm", "start"]

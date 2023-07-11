# Stage 1: Build the application
FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install dependencies
RUN npm ci
# Copy the entire project to the working directory
COPY . .
# Build the Nest.js application
RUN npm run build


# Stage 2: Run the application
FROM node:16-alpine
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install only production dependencies
RUN npm ci --production
# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
# Set the NODE_ENV environment variable to 'production'
ENV NODE_ENV=production
# Expose the port on which your Nest.js application is listening (change it to match your app's port)
EXPOSE 3000

# Start the Nest.js application
CMD ["node", "dist/main"]

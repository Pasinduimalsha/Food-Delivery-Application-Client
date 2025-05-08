
# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with legacy peer deps flag to handle conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build --legacy-peer-deps

# Production stage
FROM nginx:1.25.0-alpine

# Copy built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config if you have custom configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 since nginx uses this port by default
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
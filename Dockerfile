FROM node:18-alpine AS builder

WORKDIR /app

# copy package files first to leverage layer caching
COPY package*.json ./

RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then \
			npm ci --legacy-peer-deps; \
		else \
			npm install --legacy-peer-deps; \
		fi

# copy rest of source and build
COPY . .
RUN npm run build --legacy-peer-deps

## Final minimal image using nginx to serve static files
FROM nginx:1.25-alpine

# Remove default nginx content and copy build output
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Local Development Server Command
# For local development you can still use: `npm run dev -- --host`

# Step 1: Build the React app using Node
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

EXPOSE 5173

CMD ["npm","run","dev","--","--host","0.0.0.0"]

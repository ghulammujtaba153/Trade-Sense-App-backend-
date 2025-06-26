# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (change if not 5000)
EXPOSE 5000

# Set environment variable to production (optional)
ENV NODE_ENV=production

# Start the app
CMD ["node", "index.js"]

# Use Node.js 18 on Alpine Linux as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install
RUN npm install -g next

# Copy the entire project to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Set environment variable for production (optional, adjust as needed)
ENV NODE_ENV=production

# Expose the default Next.js port (adjust if your Next.js app uses a different port)
EXPOSE 3001

# Start the Next.js application
CMD ["npm", "start"]

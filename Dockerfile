# Use the official Node.js image as a base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy all application files to the working directory
COPY . .

# Install app dependencies
RUN npm install
RUN npm run build

RUN npm install -g typescript
# RUN tsc

# Expose the port that your app will run on
EXPOSE 3000
EXPOSE 3002

# Command to run your application
CMD ["npm", "run", "start:prod"]

# Use official Node.js image as a base image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies, including devDependencies (needed for nodemon)
RUN npm install --production

# Copy the rest of the application code
COPY . .


# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
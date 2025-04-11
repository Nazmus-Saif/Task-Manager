# Use Node.js 22 Alpine as the base image for building
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose port 5173
EXPOSE 5173

# Run the project
CMD ["npm", "run", "dev"]

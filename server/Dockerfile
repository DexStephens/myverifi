# Use a Node.js base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json tsconfig.json ./
RUN npm install

# Copy the rest of the server code
COPY . ./

# Transpile TypeScript to JavaScript
RUN npm run build

# Expose the port for the API server
EXPOSE 5000

# Start the server using the transpiled JavaScript files
CMD ["npm", "start"]

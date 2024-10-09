# Pull base image from Docker Hub
FROM node:18.20.4-alpine

# Set the working directory
WORKDIR /usr/app

# Copy the package.json file
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy code from host to container
COPY . .

# Build the app
RUN npm run build

# Expose port 5173 on docker container locally
# EXPOSE 5173

# Expose port 4173 on cloud
EXPOSE 4173

# Run the app
CMD ["npm", "run", "dev"]
# รันบน could
# CMD ["npm", "run", "preview"]
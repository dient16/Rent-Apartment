FROM node:current-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose port 9009
EXPOSE 9009

# Start the app
CMD npm run start

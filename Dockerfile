# Use official Node image
FROM node:18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    graphicsmagick \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Optional: Build Tailwind CSS
# RUN npx tailwindcss -i ./src/input.css -o ./public/output.css

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]

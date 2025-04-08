FROM node:20.17.0 AS development

# Set working directory
WORKDIR /app    

COPY package*.json ./

# RUN yarn add glob rimraf

# Install project dependencies
RUN yarn install

# Expose container port
EXPOSE ${PORT}

# RUN npm install --only=development

# Copy project in the working directory
COPY . .

# Builds the project
RUN yarn build

# Run the project
CMD ["yarn", "start:prod"]

# FROM node:18.17.0 as production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# #RUN npm install --only=production

# COPY .env ./
# COPY ssl ./ssl
# COPY locales ./locales

# COPY --from=development /nestjs_core/dist ./dist

# CMD ["node", "dist/main"]
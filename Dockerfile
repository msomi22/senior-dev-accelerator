# Stage 1 - Build React/Vite app
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --no-package-lock --no-audit --no-fund --registry=https://registry.npmjs.org/

COPY . .
RUN npm run build

# Stage 2 - Serve with Nginx
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

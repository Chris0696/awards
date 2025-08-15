FROM node:20-alpine


RUN addgroup app && adduser -S -G app app


WORKDIR /app


RUN chown app:app /app


USER app

COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]

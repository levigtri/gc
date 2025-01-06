FROM node:20 
WORKDIR /APP
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate
EXPOSE 3001
CMD ["./start.sh"]

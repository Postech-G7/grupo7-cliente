FROM node:20
USER root
WORKDIR /home/node/app

COPY package.json . 
COPY package-lock.json . 

RUN npm install

COPY tsconfig.json .
COPY src ./src

RUN npx tsx ./src/swagger.ts

ENV PORT=3000
ENV NODE_ENV=production
ENV DATABASE_HOST=localhost
ENV DATABASE_NAME=u730606768_clientes
ENV DATABASE_PASSWORD=mongo
ENV DATABASE_PORT=3306
ENV DATABASE_USER=u730606768_grupo7

EXPOSE 3000

CMD ["npm", "start"]
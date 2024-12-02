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

EXPOSE 3000

CMD ["npm", "start"]
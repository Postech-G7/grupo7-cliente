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
ENV DATABASE_URL=mongodb://root:mongo2023@database:27017
ENV MERCADO_PAGO_USERID=140225549
ENV MERCADO_PAGO_TOKEN=TEST-6171745819014663-071918-e3d8f1680321deab4a8c0e430c211de3-140225549
ENV MERCADO_PAGO_WEBHOOK_URL=https://fiap.com.br 
ENV MERCADO_PAGO_POS=2797
ENV MERCADO_PAGO_URL=https://api.mercadopago.com

EXPOSE 3000

CMD ["npm", "start"]
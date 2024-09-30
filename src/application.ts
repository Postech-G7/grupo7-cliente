import swaggerAutogen from 'swagger-autogen'
import { swaggerDocument } from 'swagger/swagger';

const outputFile = './swagger/swagger.json'
const routes = ['./configuration/routes.config.ts']

swaggerAutogen({
  language: 'pt-BR'
})(outputFile, routes, swaggerDocument).then(async () => {
  await import('./configuration/server.config.js')
})
const swaggerAutogen = require('swagger-autogen')();

const doc = {
   info: {
            title: 'Employee Management API',
            version: '1.0.0',
            description: 'API documentation for Employee management'
        },
  host: 'localhost:5000',
  schemes: ['http']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']

swaggerAutogen(outputFile, endpointsFiles, doc);

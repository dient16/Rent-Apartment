require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")({ openapi: "3.1.0" });

const doc = {
  info: {
    title: "Rent Apartment API",
    description:
      "API documentation for the Rent Apartment application, which facilitates booking of homestays, apartments, and hotels. The API provides endpoints for managing user accounts, listing properties, booking reservations, managing reviews, and handling payments.",
  },
  host: process.env.SERVER_URL || "localhost:9009",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "X-API-Key",
      description: "API Key needed to access the endpoints",
    },
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description:
        'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["./src/routes/index.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc).then(() => {
  require("./server.js"); // Your project's root file
});

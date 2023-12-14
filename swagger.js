const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    info: {
      title: "Happy Wall API",
      version: "1.0.0",
      description: "API documentation for the happy wall api",
    },
    basePath: "/api/",
    tags: [
      {
        name: "Users",
        description: "Operations related to users",
      },
      {
        name: "Wallposts",
        description: "Operations related to wall posts",
      },
    ],
  },
  apis: ["./routes/*.js"], // Specify the path to your route files.
};

const specs = swaggerJsdoc(options);

module.exports = specs;

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const specs = require("./swagger");
require("dotenv").config();

//db
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Error => ", err));

const app = express();

//import routes

const usersRoutes = require("./routes/users");
const wallPostsRoutes = require("./routes/wallposts");

//app  middlewares
app.use(cors());

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api", usersRoutes);
app.use("/api", wallPostsRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`happy wall server is running on port ${port}`);
});

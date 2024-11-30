const express = require("express");
const cors = require('cors');
const { sequelize } = require("./models/index");

const accountRouter = require("./routers/accountRouter");
// const roleRoutes = require("./routes/roleRoutes");
const productsRouter = require("./routers/productsRoutes");
// const uploadRouters =  require("./routes/uploadRoute");
const cartRouter = require("./routers/cartRouter");
// const paymentRouter = require("./routes/paymentRouter");
const statusRouter = require("./routers/statusRouter");
const orderRouter = require("./routers/cartOrderRouter");
const paymentOrderRouter = require("./routers/paymentsRouter");

const app = express();
app.use(cors());
const port = 3000;

app.use(express.json());
app.use("/account", accountRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/status", statusRouter);
app.use("/orders", orderRouter);
app.use("/paymentOrder", paymentOrderRouter);
app.use("/category", accountRouter);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

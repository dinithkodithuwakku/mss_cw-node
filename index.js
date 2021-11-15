const express = require("express");

const companyRouter = require("./route/companyRoute");
const branchRouter = require("./route/branchRoute");
const userRoleRouter = require("./route/userRoleRoute");
const userRouter = require("./route/userRoute");

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/company", companyRouter);
app.use("/branch", branchRouter);
app.use("/user_role", userRoleRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

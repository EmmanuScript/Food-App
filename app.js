const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser, authRole } = require("./middleware/auth");
const path = require("path");

const app = express();
const port = process.env.PORT;

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

// database connection
const dbURI = process.env.MONGODB_URL;
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// routes
app.get("*", checkUser);
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/home", requireAuth, checkUser, (req, res) => {
  res.render("home");
});
app.get("/make-order", requireAuth, checkUser, (req, res) =>
  res.render("make-order")
);
app.get("/edit-order", requireAuth, checkUser, (req, res) => {
  res.render("edit-order");
});
app.get("/create-menu", requireAuth, authRole, (req, res) => {
  res.render("create-menu");
});
app.get("/edit-menu", requireAuth, authRole, (req, res) => {
  res.render("edit-menu");
});
app.get("/admin-home", requireAuth, authRole, (req, res) =>
  res.render("admin-home")
);
app.get("/export", requireAuth, authRole, (req, res) => res.download(down));

//registering the routers in app
app.use(authRoutes);
app.use(adminRoutes);

// Only start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log("server is tunning on port " + port + "...");
  });
}

module.exports = app;

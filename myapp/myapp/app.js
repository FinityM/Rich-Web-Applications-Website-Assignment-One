var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var validator = require("validator");

var indexRouter = require("./routes/index");
// import
var indexRouter2 = require("./routes/index2");

var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// use the route
app.use("/index2", indexRouter2);

app.use("/users", usersRouter);

app.get("/login", function (req, res) {
  console.log("hello");
  res.send("all ok");
});

app.post("/login", function (req, res) {
  // catch the username that was sent to us from the jQuery POST on the index.ejs page
  var username = req.body.username;

  // Print it out to the NodeJS console just to see if we got the variable.
  console.log("User name = " + username);

  // Remember to check what database you are connecting to and if the
  // values are correct.
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "assignment",
  });

  connection.connect();

  // This is the actual SQL query part
  connection.query(
    "SELECT * from login where username= '" + username + "'",
    function (error, results, fields) {
      if (error) throw error;
      if (results == null) {
        console.log("The solution is: ", results[0].acctype);
        res.send(results[0].acctype);
      }
    }
  );

  connection.end();
});

app.post("/registernewuser", function (req, res) {
  // catch the username that was sent to us from the jQuery POST on the index.ejs page
  var username = req.body.username;
  var password = req.body.password;

  // Print it out to the NodeJS console just to see if we got the variable.
  console.log("User name = " + username + "Password = " + password);

  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "assignment",
  });

  connection.connect();
  connection.query(
    "INSERT INTO `assignment`.`login` (`acctype`, `username`, `password`) VALUES ('customer','" +
      username +
      "', '" +
      password +
      "')",
    function (error, results, fields) {
      if (error) throw error;

      res.send(true);
    }
  );
  connection.end();

  // Remember to check what database you are connecting to and if the
  // values are correct.
  /*

  // This is the actual SQL query part
  connection.query(
    "SELECT * from login where username= '" + username + "'",
    function (error, results, fields) {
      if (error) throw error;
      console.log("The solution is: ", results[0].acctype);

      res.send(results[0].acctype);
    }
  );

  connection.end();
  */
});

app.post("/putindb", function (req, res) {
  // catch the username that was sent to us from the jQuery POST on the index.ejs page
  var cart = req.body.cart;

  // Print it out to the NodeJS console just to see if we got the variable.
  console.log("Cart = " + cart);

  // Remember to check what database you are connecting to and if the
  // values are correct.
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "assignment",
  });

  connection.connect();

  // This is the actual SQL query part
  connection.query(
    "INSERT INTO `assignment`.`orders` (`ordercontent`) VALUES ('" +
      cart +
      "');",
    function (error, results, fields) {
      if (error) throw error;
    }
  );

  connection.end();
  res.send("all ok");
});

app.post("/updateDB", function (req, res) {
  // catch the username that was sent to us from the jQuery POST on the index.ejs page
  var id = req.body.id;
  var qty = req.body.qty;

  // Remember to check what database you are connecting to and if the
  // values are correct.
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "assignment",
  });

  connection.connect();

  // This is the actual SQL query part
  connection.query(
    "UPDATE `assignment`.`products` SET `qty`='" +
      qty +
      "' WHERE `id`=" +
      id +
      ";",
    function (error) {
      if (error) throw error;
    }
  );

  connection.end();
  res.send("all ok");
});

app.get("/getManagerData", function (req, res) {
  // Remember to check what database you are connecting to and if the
  // values are correct.
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "assignment",
  });

  connection.connect();

  // This is the actual SQL query part
  connection.query("SELECT * from orders", function (error, results, fields) {
    if (error) throw error;

    var buffer = "";

    for (var i = 0; i < results.length; i++) {
      buffer += results[i].id + " ";
      buffer += results[i].ordercontent + " ";
      buffer += results[i].total + "<br>";
    }
    res.send(buffer);
  });

  connection.end();
});

app.get("/getCookData", function (req, res) {
  // Remember to check what database you are connecting to and if the
  // values are correct.
  var username = req.body.username;

  console.log("User name = " + username);

  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "assignment",
  });

  connection.connect();

  // This is the actual SQL query part
  connection.query("SELECT * from products", function (error, results, fields) {
    if (error) throw error;

    var buffer = "";

    for (var i = 0; i < results.length; i++) {
      buffer += results[i].pname + " " + results[i].qty;
      buffer +=
        '<input name="text" id="' +
        results[i].id +
        '" value="' +
        results[i].qty +
        '">';
      buffer +=
        '<button onclick="updateDB(' + results[i].id + ')"> Save </button>';
      buffer += "<br>";
    }
    res.send(buffer);
  });

  connection.end();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

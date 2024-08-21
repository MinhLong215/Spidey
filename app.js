const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware')
const path = require('path')
const mongoose = require("./database");
const cookieParser = require('cookie-parser');

const server = app.listen(port, () => console.log("Server listening on port " + port));

//cài view engine
app.set("view engine", "pug");
app.set("views", "views");

app.use(cookieParser());

//thiết lập bodyParser
// Cấu hình middleware để phân tích dữ liệu JSON
app.use(express.json());
// Cấu hình middleware để phục vụ tệp tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));
// Cấu hình middleware để phân tích dữ liệu từ các biểu mẫu HTML (nếu cần)
app.use(express.urlencoded({ extended: false }));

//routes
const loginRoute = require("./routes/loginRoutes");
const registerRoute = require("./routes/registerRoutes");
const logoutRoute = require("./routes/logoutRoutes");
const userRoute = require("./routes/userRoutes");
const postRoute = require("./routes/postRoutes");

//Api routes
const postsApiRoute = require("./routes/api/posts");

//Routes với bảo mật
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/users", userRoute);
app.use("/posts", middleware.requireAuth, middleware.requireAdmin, postRoute);


app.use("/api/posts", postsApiRoute);

// Route chính
app.get("/", middleware.requireAuth, (req, res) => {
    var payload = {
        pageTitle: "SPIDEY",
        userLoggedIn: req.user,
        userLoggedInJs: JSON.stringify(req.user)
    };
    res.status(200).render("home", payload);
});
const mongoose = require("mongoose");

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Database connection successful");
        })
        .catch((err) => {
            console.error("Database connection error: ", err.message); // In ra thông báo lỗi chi tiết
        });
    }
}

module.exports = new Database();

const mongoose = require("mongoose");

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        const dbURI = process.env.MONGODB_URI; // Lấy giá trị từ biến môi trường
        mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("database connection successful");
        })
        .catch((err) => {
            console.log("database connection error " + err);
        });
    }
}

module.exports = new Database();

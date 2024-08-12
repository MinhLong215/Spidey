const mongoose = require("mongoose");

class Database {

    constructor(){
        this.connect();
    }


    connect(){
        mongoose.connect("mongodb+srv://admin:Admin%40123@spideycluster.apcgsh8.mongodb.net/SpideyDB?retryWrites=true&w=majority&appName=SpideyCluster")
        .then(() => {
            console.log("database connection successful");
        })
        .catch((err) => {
            console.log("database connection error " + err);
        })
    }
}

module.exports = new Database();
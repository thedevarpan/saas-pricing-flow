const mongoose = require("mongoose");

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log("MongoDB Connected"))
            .catch(err => console.log(err));
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectToDB;
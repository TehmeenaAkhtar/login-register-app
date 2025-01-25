import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/myLoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

const userSchema = new mongoose.Schema({
        name: String,
        email: String,
        password: String
    
    })
    
const User = new mongoose.model("User", userSchema);

// Routes
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const existingUser1 = await User.findOne({ email: email });
        if (existingUser1) {
            // Compare passwords
            if (password === existingUser1.password) {
                return res.status(200).send({ message: "Login Successful", user: existingUser1 });
            } else {
                return res.status(400).send({ message: "Password didn't match" });
            }
        } else {
            return res.status(400).send({ message: "User not registered" });
        }
    } catch (err) {
        console.error("Error in /login:", err);
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
});


app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ message: "User already registered" });
        }

        // Create a new user
        const user = new User({
            name,
            email,
            password,
        });

        // Save the user to the database
        await user.save();
        res.status(201).send({ message: "Successfully Registered, Please login now." });

    } catch (err) {
        console.error("Error in /register:", err);
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
});



// Start the server
app.listen(4000, () => {
    console.log("BE started at port 4000"); // Fixed the port number in the log
});

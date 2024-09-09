const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const uri = "mongodb+srv://admin:admin@twiller.ovrvb.mongodb.net/?retryWrites=true&w=majority&appName=twiller";
const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const postcollection = client.db("database").collection("posts");
    const usercollection = client.db("database").collection("users");

    // Register a new user
    app.post("/register", async (req, res) => {
      try {
        const user = req.body;
        console.log("Registering user:", user);
        const result = await usercollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Error registering user.");
      }
    });

    // Get logged-in user
    app.get("/loggedinuser", async (req, res) => {
      try {
        const email = req.query.email;
        console.log("Fetching user for email:", email);
        const user = await usercollection.findOne({ email: email });
        res.send(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user.");
      }
    });

    // Post new tweet
    app.post("/post", async (req, res) => {
      try {
        const post = req.body;
        console.log("Posting new tweet:", post);
        const result = await postcollection.insertOne(post);
        res.send(result);
      } catch (error) {
        console.error("Error posting tweet:", error);
        res.status(500).send("Error posting tweet.");
      }
    });

    // Get all posts
    app.get("/post", async (req, res) => {
      try {
        const post = (await postcollection.find().toArray()).reverse();
        res.send(post);
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Error fetching posts.");
      }
    });

    // Get posts by a specific user
    app.get("/userpost", async (req, res) => {
      try {
        const email = req.query.email;
        console.log("Fetching posts for email:", email);
        const post = (await postcollection.find({ email: email }).toArray()).reverse();
        res.send(post);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).send("Error fetching user posts.");
      }
    });

    // Update user profile (including avatars or profile images)
    app.patch("/userupdate/:email", async (req, res) => {
      try {
        const { email } = req.params;
        const profileUpdates = req.body;
        const options = { upsert: true };
        const updatedoc = { $set: profileUpdates };

        console.log("Updating user profile for:", email);
        console.log("Profile Updates:", profileUpdates);

        const result = await usercollection.updateOne({ email }, updatedoc, options);
        res.send(result);
      } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).send("Error updating user profile.");
      }
    });

  } catch (error) {
    console.error("Database connection error:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Twiller is working");
});

app.listen(port, () => {
  console.log(`Twiller clone is working on port ${port}`);
});

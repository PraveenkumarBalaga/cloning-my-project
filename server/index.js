const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");

const uri =
  "mongodb+srv://admin:admin@twiller.ovrvb.mongodb.net/?retryWrites=true&w=majority&appName=twiller";
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
        res.status(500).send("Error registering user");
      }
    });

    // Retrieve logged-in user
    app.get("/loggedinuser", async (req, res) => {
      try {
        const email = req.query.email;
        console.log("Fetching logged-in user with email:", email);
        const result = await usercollection.find({ email: email }).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user");
      }
    });

    // Insert a post
    app.post("/insertpost", async (req, res) => {
      try {
        const post = req.body;
        console.log("Inserting post:", post);
        const result = await postcollection.insertOne(post);
        res.send(result);
      } catch (error) {
        console.error("Error inserting post:", error);
        res.status(500).send("Error inserting post");
      }
    });

    // Retrieve posts for a specific user
    app.get("/userpost", async (req, res) => {
      try {
        const email = req.query.email;
        console.log("Fetching posts for user with email:", email);
        const result = await postcollection.find({ email: email }).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Error fetching posts");
      }
    });

    // Update a user's profile image or avatar
    app.patch("/userupdate/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const updatedProfile = req.body;
        console.log(`Updating user profile for ${email}:`, updatedProfile);
        const filter = { email: email };
        const update = { $set: updatedProfile };
        const result = await usercollection.updateOne(filter, update);
        res.send(result);
      } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).send("Error updating user profile");
      }
    });
  } finally {

  }
}

run().catch(console.error);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

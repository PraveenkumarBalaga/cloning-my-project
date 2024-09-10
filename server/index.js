const { MongoClient, ServerApiVersion } = require("mongodb");
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
      const user = req.body;
      console.log(user);
      const result = await usercollection.insertOne(user);
      res.send(result);
    });

    // Get logged-in user
    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      const user = await usercollection.find({ email: email }).toArray();
      res.send(user);
    });

    // Post new tweet
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postcollection.insertOne(post);
      res.send(result);
    });

    // Get all posts
    app.get("/post", async (req, res) => {
      const post = (await postcollection.find().toArray()).reverse();
      res.send(post);
    });

    // Get posts by a specific user
    app.get("/userpost", async (req, res) => {
      const email = req.query.email;
      const post = (await postcollection.find({ email: email }).toArray()).reverse();
      res.send(post);
    });

    // Update user profile (including avatars or profile images)
    app.patch("/userupdate/:email", async (req, res) => {
      const { email } = req.params;
      const profileUpdates = req.body;  // Contains profileImage, avatar, or other fields
      const options = { upsert: true };
      const updatedoc = { $set: profileUpdates };

      console.log("Updating user profile for:", email);
      console.log("Profile Updates:", profileUpdates);

      const result = await usercollection.updateOne({ email }, updatedoc, options);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);

// Default route
app.get("/", (req, res) => {
  res.send("Twiller is working");
});

app.listen(port, () => {
  console.log(`Twiller clone is working on port ${port}`);
});

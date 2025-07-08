require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_User1}:${process.env.DB_PASS2}@cluster0.0p516.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = `mongodb+srv://TravelBD:NXif9PhaM46u96VV@cluster0.0p516.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("TravelBD").collection("userDB");
    const dataCollection = client.db("TravelBD").collection("dataDB");
    const WishlistCollection = client.db("TravelBD").collection("wishlist");
    const BookCollection = client.db("TravelBD").collection("Books");
    const GuideCollection = client.db("TravelBD").collection("Guide");

    // books

    app.post("/book", async (req, res) => {
      const users = req.body;
      const result = await BookCollection.insertOne(users);
      res.send(result);
    });

    app.get("/book", async (req, res) => {
      const result = await BookCollection.find().toArray();
      res.send(result);
    });

    app.patch("/book/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(id, data);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: data,
      };
      const result = await BookCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/book/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await BookCollection.deleteOne(query);
      res.send(result);
    });

    //user section

    app.post("/users", async (req, res) => {
      const users = req.body;
      const user = req.body;
      const email = user.email;

      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        res.send("User AllReady Added");
      }
      const result = await userCollection.insertOne(users);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(id, data);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: data };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // wishlist api

    app.post("/wish", async (req, res) => {
      const data = req.body;
      const result = await WishlistCollection.insertOne(data);
      res.send(result);
    });

    //get wishlist

    app.get("/wish", async (req, res) => {
      const data = req.query.email;
      const query = {
        email: data,
      };
      const result = await WishlistCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/wish/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await WishlistCollection.deleteOne(query);
      res.send(result);
    });

    // Guide section

    app.post("/guides", async (req, res) => {
      try {
        const data = req.body;
        const result = await GuideCollection.insertOne(data);
        res.send(result);
      } catch (error) {
        res.send({ error: error.message });
      }
    });

    app.get("/guides", async (req, res) => {
      try {
        const result = await GuideCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.send({ error: error.message });
      }
    });

    app.get("/guides/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await GuideCollection.findOne(filter);
        res.send(result);
      } catch (error) {
        res.send({ error: error.message });
      }
    });

    app.delete("/guides/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await GuideCollection.deleteOne(filter);
        res.send(result);
      } catch (error) {
        res.send({ error: error.message });
      }
    });

    app.patch("/guides/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: data,
        };
        const result = await GuideCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.send({ error: error.message });
      }
    });

    // Data API------------------------------------------

    app.post("/addData", async (req, res) => {
      const data = req.body;
      const result = await dataCollection.insertOne(data);
      res.send(result);
    });

    app.get("/addData", async (req, res) => {
      const result = await dataCollection.find().toArray();
      res.send(result);
    });

    app.get("/addData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollection.findOne(query);
      res.send(result);
    });

    app.delete("/addData/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await dataCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.send({ error: error.message });
      }
    });

    app.patch("/addData/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = req.body;
        console.log(data, id);
        const filter = { _id: new ObjectId(id) };
        const UpdateDoc = {
          $set: data,
        };
        const result = await dataCollection.updateOne(filter, UpdateDoc);
        res.send(result);
        console.log("Update result:", result);
      } catch (error) {
        res.send({ error: error.message });
      }
    });
    //admin home page

    app.get("/admin/home", async (req, res) => {
      const totalUser = await userCollection.countDocuments();
      const totalTourPackage = await dataCollection.countDocuments();
      const totalWishList = await dataCollection.countDocuments();
      const totalBookList = await dataCollection.countDocuments();
      res.send({
        user: totalUser,
        torPackage: totalTourPackage,
        wish: totalWishList,
        booked: totalBookList,
      });
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("your server is running on port: ", port);
});

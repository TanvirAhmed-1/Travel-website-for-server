const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.464po.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const userCollection = client.db("travelDB").collection("userDB");
    const dataCollection = client.db("travelDB").collection("dataDB");
    const WishlistCollection = client.db("travelDB").collection("wishlist");
    const BookCollection = client.db("travelDB").collection("Books");

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
      console.log(id,data)
      const filter = {_id: new ObjectId(id) };
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

    // //  usermanagement api---------------------------------------------
    // app.post("/users",async(req,res)=>{
    //   const users = req.body;
    //   const result = await userCollection.insertOne(users);
    //   res.send(result)

    // })

    // app.get("/users",async(req,res)=>{

    //   const cursor = userCollection.find()
    //   const result= await cursor.toArray()
    //   res.send(result)
    // })

    // app.get("/users/:id",async(req,res)=>{
    //   const id = req.params.id;
    //   const query ={_id: new ObjectId(id)}
    //   const result = await userCollection.findOne(query)
    //   res.send(result);
    // })

    // app.put("/users/:id",async(req,res)=>{
    //   const id = req.params.id;
    //   const filter = {_id: new ObjectId(id)};
    //   const user = req.body
    //   console.log(user)
    //   const updateDoc ={
    //     $set:{
    //           name: user.name,
    //           email: user.email
    //     }
    //   }
    //   const options = {upsert:true}
    //   const result = await userCollection.updateOne(filter,updateDoc,options)
    //   res.send(result)
    // })

    // --------------------------------------------------

    // Data API------------------------------------------

    app.post("/addData", async (req, res) => {
      const data = req.body;
      const result = await dataCollection.insertOne(data);
      res.send(result);
    });

    app.get("/addData", async (req, res) => {
      const cursor = dataCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/addData/:id", async (req, res) => {
      const id = req.params.id;
      const qurey = { _id: new ObjectId(id) };
      const result = await dataCollection.findOne(qurey);
      res.send(result);
    });

    //admin home page 

    app.get("/admin/home",async(req,res,)=>{
      const totalUser=await userCollection.countDocuments()
      const totalTourPackage=await dataCollection.countDocuments()
      const totalWishList=await dataCollection.countDocuments()
      const totalBookList=await dataCollection.countDocuments()
      res.send({
        user:totalUser,
        torPackage:totalTourPackage,
        wish:totalWishList,
        booked:totalBookList,
      })
    })

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

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const url = "mongodb://192.168.100.48:65000";
const client = new MongoClient(
  "mongodb://192.168.100.48:55001," +
    "192.168.100.48:55002," +
    "192.168.100.48:55003"
);
const cors = require("cors");

const dbName = "records";

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// Conecta a MongoDB antes de iniciar el servidor
client
  .connect()
  .then(() => {
    app.listen(3001, () => {
      console.log("Aplication started on port 3001");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.post("/sales/create", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("sales");
    const result = await collection.insertOne(req.body);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

app.post("/sales/edit", async (req, res) => {
  const { _id, ...data } = req.body;
  try {
    const db = client.db(dbName);
    const collection = db.collection("sales");
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: data }
    );
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

app.get("/sales", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("sales");
    const result = await collection.find({}).toArray();
    return res.json(result).status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});

app.post("/sales/delete", async (req, res) => {
  const { _id } = req.body;
  try {
    const db = client.db(dbName);
    const collection = db.collection("sales");
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

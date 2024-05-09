const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Data = require("./DataModel");
const cors = require("cors");
const Counter = require("./counterModel");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

// Body parser middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Middleware to calculate API execution time
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

app.post("/data", async (req, res) => {
  if (!req.body.data) {
    return res.status(400).send("Data field is required");
  }

  try {
    const newData = new Data({ data: req.body.data });
    console.log(req.body.data);
    await newData.save(); // Save the new data item

    // Increment the add count
    const counter = await Counter.findOneAndUpdate(
      {},
      { $inc: { totalAdds: 1 } },
      { new: true, upsert: true }
    );

    res.status(201).send(newData); // Send back the saved data
  } catch (error) {
    console.error("Error saving new data:", error);
    res.status(500).send(error);
  }
});

app.put("/data/:id", async (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).send("Data field is required");
  }

  try {
    const updatedData = await Data.findByIdAndUpdate(
      req.params.id,
      { data },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).send("Data not found");
    }

    // Increment the update counter
    await Counter.findOneAndUpdate(
      {},
      { $inc: { totalUpdates: 1 } },
      { new: true, upsert: true }
    );

    res.status(200).send(updatedData);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send(error);
  }
});

//API to get counts of add and update operations
app.get("/data", async (req, res) => {
  try {
    const result = await Data.find({});
    console.log(result);

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
    console.log("error", error);
  }
});
app.get("/count", async (req, res) => {
  try {
    const counter = await Counter.findOne();
    if (!counter) {
      // If no counter document exists, create one with initial values
      const newCounter = new Counter({ totalAdds: 0, totalUpdates: 0 });
      await newCounter.save();
      return res.status(200).send(newCounter);
    }
    res.status(200).send(counter);
  } catch (error) {
    console.error("Failed to retrieve counts:", error);
    res.status(500).send(error);
  }
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));

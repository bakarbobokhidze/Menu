const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // .env ფაილისთვის

const app = express();
app.get("/", (req, res) => {
  res.send("სერვერი მუშაობს!");
});

const allowedOrigins = [
  "http://localhost:8080",
  "https://hacker-pshor.netlify.app",
];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // ნებას რთავს მოთხოვნებს origin-ის გარეშე (მაგ. Postman) ან allowedOrigins-დან
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running and CORS is open!");
});

// 1. დაკავშირება MongoDB-სთან
// პროცესში დაგჭირდება .env ფაილი სადაც ჩაწერ: MONGO_URI=შენი_მისამართი
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://baqarboboxidze:baqari123BB@cluster0.3ahnxqz.mongodb.net/supraMenu?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error details:", err.message);
    // მნიშვნელოვანია, რომ აქ ლოგი დაგვიწეროს Render-მა
  });
// 2. სქემის შექმნა (როგორ გამოიყურება კერძი ბაზაში)
const dishSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  inStock: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
});

const Dish = mongoose.model("Dish", dishSchema);

// --- API ენდპოინტები ---

// 1. ყველა კერძის წამოღება
app.get("/api/menu", async (req, res) => {
  try {
    const menu = await Dish.find();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. ახალი კერძის დამატება
app.post("/api/menu", async (req, res) => {
  try {
    const newItem = new Dish(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. კერძის განახლება
app.patch("/api/menu/:id", async (req, res) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }, // დააბრუნოს უკვე განახლებული ვერსია
    );
    res.json(updatedDish);
  } catch (err) {
    res.status(404).json({ message: "კერძი ვერ მოიძებნა" });
  }
});

// 4. ნახვების დათვლა
app.post("/api/menu/:id/view", async (req, res) => {
  try {
    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // $inc ზრდის მნიშვნელობას 1-ით
      { new: true },
    );
    res.json({ success: true, views: dish.views });
  } catch (err) {
    res.status(404).send("Item not found");
  }
});

// 5. წაშლა
app.delete("/api/menu/:id", async (req, res) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "წარმატებით წაიშალა" });
  } catch (err) {
    res.status(404).json({ success: false, message: "კერძი ვერ მოიძებნა" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

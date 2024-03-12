// backend file
// Server.js handles post requests from the Assistant component.
// When the user presses refresh, the data from the destination, departure date and days of travel fields are submitted as inputs to the post request.

// import dependencies
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import cors from "cors";

// create new backend instance
const app = express();
const port = 3001;

// OpenAI setup. configure env variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(express.json());

// Impliment basic CORS Policy
const corsOptions = {
  origin: "https://kanbag.netlify.app", // Use your Netlify domain here
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// test with simple get req
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// post req
app.post("/", async (req, res) => {
  const prompt = req.body.prompt;
  try {
    // OpenAI Completions
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-3.5-turbo",
    });
    // access required part of API JSON resonse
    res.json(completion.choices[0].message.content);
  } catch (error) {
    console.error("Failed to fetch from OpenAI:", error);
    res.status(500).json({
      error: "From JSON - An error occurred while processing your request.",
    });
  }
});

// set listener
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const openai = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.post("/api/process-job", async (req, res) => {
  try {
    const { jobTitle, companyName, jobDescription, resume } = req.body;
    // Call OpenAI API and extract keywords from the job description
    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Extract keywords from the following job description:\n\n${jobDescription}`,
        },
      ],
    });
    const keywords = openaiResponse.choices[0].message.content
      .trim()
      .split(", ");
    // Enhance the resume with the extracted keywords
    const enhancedResume = resume
      .split("\n")
      .map((line) => {
        const enhancedLine = keywords.reduce((acc, keyword) => {
          return acc.replace(
            new RegExp(`\\b${keyword}\\b`, "gi"),
            `**${keyword}**`
          );
        }, line);
        return enhancedLine;
      })
      .join("\n");
    // Take the resume and job description and create a cover letter
    const coverLetterResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Create a cover letter for the following job:\n\nJob Title: ${jobTitle}\nCompany Name: ${companyName}\nJob Description: ${jobDescription}\n\nResume:\n${resume}`,
        },
      ],
    });
    // Send the resume and cover letter to the client
    const coverLetter = coverLetterResponse.choices[0].message.content.trim();
    res.json({
      success: true,
      keywords,
      enhancedResume,
      coverLetter,
    });
  } catch (error) {
    console.error("Error processing job:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing job", error });
  }
});

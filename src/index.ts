import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {
  res.json({ message: "success!" });
});

app.get("/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

app.post("/notes", async (req: Request, res: Response) => {
  const { title, content } = req.body;

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the note." });
  }
});

app.listen(5500, () => {
  console.log("server running on localhost:5500");
});

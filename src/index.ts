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

app.put("/api/notes/:id", async (req: any, res: any) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    return res.status(400).send("Title and content fields are required.");
  }

  if (isNaN(id)) {
    return res.status(400).send("ID must be a valid number.");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("An error occurred while updating the note.");
  }
});

app.delete("/api/notes/:id", async (req: any, res: any) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("ID field required");
  }

  try {
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.listen(5500, () => {
  console.log("server running on localhost:5500");
});

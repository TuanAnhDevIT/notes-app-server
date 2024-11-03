import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

const app = express();
const prisma = new PrismaClient();
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const authenticate = (req: Request, res: Response, next: any) => {
//   const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) {
//     return res.status(401).send("Access denied. No token provided.");
//   }
//   jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
//     if (err) {
//       return res.status(403).send("Invalid token.");
//     }
//     req.user = user;
//     next();
//   });
// };

// app.use('/auth', authRouter);

const authRouter = require("./auth/auth.routes");
// const userRouter = require("./users/user.routes");

app.get("/", (req, res) => {
  console.log(req.body);
  res.send("APP IS RUNNING");
});

app.use("/auth", authRouter);
// app.use("/users", userRouter);

app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

app.post("/api/notes", async (req: Request, res: Response) => {
  const { title, content } = req.body;

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        userId: 1,
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

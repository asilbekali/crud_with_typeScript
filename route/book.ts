import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.post("/book", async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        const newBook = await prisma.book.create({
            data: {
                name: name,
            },
        });
        res.status(201).json(newBook);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in creating book" });
    }
});
app.get("/book", async (req, res) => {
    const { name, page = 1, limit = 10 } = req.query;
    try {
        const books = await prisma.book.findMany({
            where: {
                name: name
                    ? {
                          equals: name as string,
                          mode: "insensitive",
                      }
                    : undefined,
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });

        res.status(200).json({ data: books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in GET /book method" });
    }
});

app.listen(3000, () => {
    console.log("Server started...");
});

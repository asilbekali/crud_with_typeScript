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

//tugatib qoyish kerak get methodini ichiga filter ham qoshish kerak

app.get("/book", async (req, res) => {
    const { name, page, limit } = req.query;
    try {
        const bazaBookn = await prisma.book.findMany();
        res.send(bazaBookn);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in get method" });
    }
});

// toliqcurdini tugatib qoyish kerak get orniga pagenation va filterdan foydalanish kerak va ilojisi bolsa swagger ham qoshish kerrak

app.listen(3000, () => {
    console.log("Server started...");
});

"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.post("/book", async (req, res) => {
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
app.listen(3000, () => {
    console.log("Server started...");
});

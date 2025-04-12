"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Book API",
      version: "1.0.0",
      description: "API to manage books",
    },
  },
  apis: ["./book.js"], 
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /book:
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the book
 *                 example: "The Great Gatsby"
 *     responses:
 *       201:
 *         description: Successfully created the book
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "The Great Gatsby"
 *       500:
 *         description: Error in creating book
 */
app.post("/book", async (req, res) => {
    try {
        const { name } = req.body;
        const newBook = await prisma.book.create({
            data: {
                name: name,
            },
        });
        res.status(201).json(newBook);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in creating book" });
    }
});

/**
 * @swagger
 * /book:
 *   get:
 *     summary: Get a list of books
 *     parameters:
 *       - in: query
 *         name: name
 *         required: false
 *         schema:
 *           type: string
 *           description: The name of the book
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *           description: Number of books per page
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       500:
 *         description: Error in GET /book method
 */
app.get("/book", async (req, res) => {
    const { name, page = 1, limit = 10 } = req.query;
    try {
        const books = await prisma.book.findMany({
            where: {
                name: name
                    ? {
                        contains: name,
                        mode: "insensitive",
                    }
                    : undefined,
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
        });
        res.status(200).json({ data: books });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in GET /book method" });
    }
});

app.listen(3000, () => {
    console.log("Server started...");
});

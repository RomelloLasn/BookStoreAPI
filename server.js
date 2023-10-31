import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (request, response) => {
    response.status(200).send({
        message: "Welcome to TAK22 books API app.",
    });
});

app.get("/books", async (request, response) => {
    try {
        const books = await prisma.books.findMany();

        response.status(200).json(books);
    } catch (error) {
        response.status(404).send({
            message:
                "Something happened. Try again or contact the service host.",
            error,
        });
    }
});

app.get("/books/:id", async (request, response) => {
    try {
        const book = await prisma.books.findFirst({
            where: {
                id: Number(request.params.id),
            },
        });

        if (!book)
            response.status(404).send({
                message: "Resource not found.",
            });

        response.status(200).json(book);
    } catch (error) {
        response.status(404).send({
            message:
                "Something happened. Try again or contact the service host.",
            error,
        });
    }
});

app.post("/books", async (request, response) => {
    try {
        const { body } = request;

        const book = await prisma.books.create({
            data: { ...body },
        });

        response.status(200).json(book);
    } catch (error) {
        response.status(404).send({
            message:
                "Something happened. Try again or contact the service host.",
            error,
        });
    }
});

app.delete("/books/:id", async (request, response) => {
    try {
        const deletedBook = await prisma.books.delete({
            where: {
                id: Number(request.params.id),
            },
        });

        response.status(200).json(deletedBook);
    } catch (error) {
        response.status(404).send({
            message:
                "Something happened. Try again or contact the service host.",
            error,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

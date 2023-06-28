const express = require('express');
const router = express.Router();
const { readData, readRowById, writeData, deleteRowById, updateRowById } = require('../networkCalls');
const networkDebugger = require('debug')('app:networkCalls')
const { validateBook } = require('../helper_functions/validate')


router.get('/', async (req, res) => {
    const books = await readData();
    res.send(books)
});

router.get('/:id', async (req, res) => {
    try {
        const book = await readRowById(req.params.id)
        networkDebugger('Book retrieved: ', book)
        res.send(book);
    } catch (err) {
        networkDebugger(err)
    }
});


router.post('/', async (req, res) => {
    try {
        networkDebugger("This endpoint was called")
        const { error } = validateBook(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const books = await readData();

        const book = {
            id: books.length,
            title: req.body.title,
            author: req.body.author,
            pages: req.body.pages,
            summary: req.body.summary,
        }

        networkDebugger('Here is the book: ', book)

        const bookArr = Object.values(book)

        writeData([bookArr]);
        res.send(book)
    } catch (err) {
        networkDebugger(err)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const book = await deleteRowById(req.params.id)
        res.send(book)
        networkDebugger('The following book was removed: ', book)
    } catch (err) {
        networkDebugger(err)
    }
});

router.put('/:id', async (req, res) => {
    try {

        const { error } = validateBook(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const book = {
            id: req.params.id,
            title: req.body.title,
            author: req.body.author,
            pages: req.body.pages,
            summary: req.body.summary,
        }
        networkDebugger('Here is the book: ', book)

        const bookArr = Object.values(book)

        await updateRowById([bookArr], req.params.id)
        res.send(book)
        networkDebugger('The following book was udpated: ', book)
    } catch (err) {
        networkDebugger(err)
    }
});


module.exports = router;

// AIzaSyAqGn7oUYS5vvxuRVPvuTSMvVzBRJBWDuk
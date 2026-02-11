const express = require("express");
const router = express.Router();
const Reference = require("../models/Reference");

// GET all references
router.get("/", async (req, res) => {
    try {
        const references = await Reference.find();
        res.json(references);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ADD new reference
router.post("/", async (req, res) => {
    try {
        const newReference = new Reference(req.body);
        await newReference.save();
        res.status(201).json(newReference);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE reference
router.put("/:id", async (req, res) => {
    try {
        const updated = await Reference.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE reference
router.delete("/:id", async (req, res) => {
    try {
        await Reference.findByIdAndDelete(req.params.id);
        res.json({ message: "Reference deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

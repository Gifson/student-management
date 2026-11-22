const express = require("express");
const router = express.Router();

const Student = require("../models/Student");

// INSERT ONE STUDENT
router.post("/", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET ALL STUDENTS
router.get("/", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// SEARCH STUDENTS BY COURSE
router.get("/search/:course", async (req, res) => {
    try {
        const students = await Student.find({
            course: req.params.course
        });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE ONE STUDENT
router.put("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE MULTIPLE STUDENTS
router.put("/update/multiple", async (req, res) => {
    try {
        const result = await Student.updateMany(
            { course: "MERN Stack" },
            { $set: { status: "Completed" } }
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE ONE STUDENT
router.delete("/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE ALL STUDENTS
router.delete("/", async (req, res) => {
    try {
        const result = await Student.deleteMany({});
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
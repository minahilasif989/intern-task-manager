const express = require("express");
const Task = require("../taskmodel");

const router = express.Router();

router.post("/create-tasks", async (req, res) => {
    const {
        title,
        description,
        status
    } = req.body;


    if (!title || !description) {
        return res.status(400).json({
            message: "Title and description required"
        });
    }

    if (status && !["pending", "failed", "success"].includes(status)) {
        return res.status(400).json({
            message: "Invalid status value"
        });
    }

    const task = new Task({
        title,
        description,
        status
    });
    await task.save();

    res.status(201).json({
        message: "Task created",
        task
    });
});

router.get("/list-tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

router.patch("/update-task/:id", async (req, res) => {
    const {
        id
    } = req.params;
    const {
        title,
        description,
        status
    } = req.body;

    // Allow partial updates
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) {
        if (!["pending", "success", "failed"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }
        updateFields.status = status;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateFields, {
        new: true
    });

    if (!updatedTask) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json(updatedTask);
});


router.delete("/delete-task/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({
        message: "Task deleted"
    });
});




module.exports = router;

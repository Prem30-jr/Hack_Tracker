const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');
const { checkTeamRole } = require('../middleware/teamAuth');

// @route   POST /api/tasks/:teamId
// @desc    Create a new task in a team
// @access  Protected + Team Member
router.post('/:teamId', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    try {
        const { title, description, assignedTo, priority, deadline } = req.body;

        if (!req.mongoUser) {
            return res.status(401).json({ message: 'User profile not synced' });
        }

        const taskData = {
            title,
            description,
            priority,
            deadline: deadline || undefined,
            team: req.params.teamId,
            createdBy: req.mongoUser._id,
        };

        if (assignedTo && assignedTo.trim() !== '') {
            taskData.assignedTo = assignedTo;
        }

        const task = await Task.create(taskData);

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/tasks/:teamId
// @desc    Get all tasks for a team
// @access  Protected + Team Member
router.get('/:teamId', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    try {
        const tasks = await Task.find({ team: req.params.teamId })
            .populate('assignedTo', 'displayName email photoURL')
            .populate('createdBy', 'displayName email');

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PATCH /api/tasks/:teamId/:taskId
// @desc    Update task status or details
// @access  Protected + Team Member
router.patch('/:teamId/:taskId', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    try {
        const { title, description, status, assignedTo, priority, deadline } = req.body;

        let task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.team.toString() !== req.params.teamId) {
            return res.status(400).json({ message: 'Task does not belong to this team' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            { title, description, status, assignedTo, priority, deadline },
            { new: true }
        );

        res.json(updatedTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/tasks/:teamId/:taskId
// @desc    Delete a task
// @access  Protected + Admin Only
router.delete('/:teamId/:taskId', protect, checkTeamRole(['admin']), async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.team.toString() !== req.params.teamId) {
            return res.status(400).json({ message: 'Task does not belong to this team' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

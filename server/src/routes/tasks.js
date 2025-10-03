const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority: priority || 'medium',
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List tasks with pagination & optional filter (assigned to current user by default)
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const assignedOnly = req.query.assignedOnly !== 'false'; // default true
    const filters = {};

    if (assignedOnly) filters.assignedTo = req.user._id;
    // allow status/priority filters
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;

    const skip = (page - 1) * limit;
    const [tasks, total] = await Promise.all([
      Task.find(filters).populate('assignedTo','name email').sort({ dueDate: 1, createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filters)
    ]);
    res.json({ tasks, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task details
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo','name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit task
router.put('/:id', auth, async (req, res) => {
  try {
    const updates = {};
    const fields = ['title','description','dueDate','status','priority','assignedTo'];
    fields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);
    const task = await Task.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true }).populate('assignedTo','name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending','in-progress','completed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('assignedTo','name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

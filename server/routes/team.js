const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { protect } = require('../middleware/auth');
const { checkTeamRole } = require('../middleware/teamAuth');
const crypto = require('crypto');
const templates = require('../config/templateData');
const Task = require('../models/Task');

// @route   POST /api/teams
// @desc    Create a new team
// @access  Protected
router.post('/', protect, async (req, res) => {
    try {
        const { name, hackathonName, hackathonStartDate, memberSize, description } = req.body;
        const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        const team = await Team.create({
            name,
            hackathonName,
            hackathonStartDate,
            memberSize: memberSize || 4,
            description,
            inviteCode,
            admin: req.mongoUser._id,
            members: [{ user: req.mongoUser._id, role: 'admin' }],
        });

        res.status(201).json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/teams/join/:inviteCode
// @desc    Join a team using invite code
// @access  Protected
router.post('/join/:inviteCode', protect, async (req, res) => {
    try {
        const team = await Team.findOne({ inviteCode: req.params.inviteCode });

        if (!team) {
            return res.status(404).json({ message: 'Invalid invite code' });
        }

        // Check if already a member
        const isMember = team.members.some(
            (m) => m.user.toString() === req.mongoUser._id.toString()
        );

        if (isMember) {
            return res.status(400).json({ message: 'Already a member of this team' });
        }

        if (team.members.length >= (team.memberSize || 4)) {
            return res.status(400).json({ message: 'Team is already full' });
        }

        team.members.push({ user: req.mongoUser._id, role: 'member' });
        await team.save();

        res.status(200).json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/teams/:teamId
// @desc    Get team details
// @access  Protected + Member
router.get('/:teamId', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId)
            .populate('members.user', 'displayName email photoURL')
            .populate('admin', 'displayName email');

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/teams
// @desc    Get all teams for the current user
// @access  Protected
router.get('/', protect, async (req, res) => {
    try {
        const teams = await Team.find({
            'members.user': req.mongoUser._id
        });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/teams/:teamId/template
// @desc    Apply a template to a team
// @access  Protected + Admin
router.post('/:teamId/template', protect, checkTeamRole(['admin']), async (req, res) => {
    try {
        const { templateName } = req.body;
        const template = templates[templateName];

        if (!template) {
            return res.status(400).json({ message: 'Invalid template name' });
        }

        const team = await Team.findById(req.params.teamId);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        if (!req.mongoUser) {
            return res.status(401).json({ message: 'User profile not synced' });
        }

        team.template = templateName;
        team.submissionChecklist = template.checklist.map(item => ({ item, completed: false }));
        await team.save();

        // Seed tasks
        const taskPromises = template.tasks.map(taskData => {
            return Task.create({
                ...taskData,
                team: team._id,
                createdBy: req.mongoUser._id
            });
        });

        await Promise.all(taskPromises);

        res.json({ message: `Template ${templateName} applied successfully`, team });
    } catch (error) {
        console.error('Template Application Error:', error);
        res.status(500).json({ message: 'Server Error during template application' });
    }
});

// @route   PATCH /api/teams/:teamId/checklist
// @desc    Update checklist item
// @access  Protected + Member
router.patch('/:teamId/checklist/:itemId', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    try {
        const { completed } = req.body;
        const team = await Team.findById(req.params.teamId);

        const checkItem = team.submissionChecklist.id(req.params.itemId);
        if (!checkItem) {
            return res.status(404).json({ message: 'Checklist item not found' });
        }

        checkItem.completed = completed;
        await team.save();

        res.json(team);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PATCH /api/teams/:teamId
// @desc    Update team details
// @access  Protected + Admin
router.patch('/:teamId', protect, checkTeamRole(['admin']), async (req, res) => {
    try {
        const { name, hackathonName, hackathonStartDate, memberSize, description } = req.body;

        const team = await Team.findByIdAndUpdate(
            req.params.teamId,
            { name, hackathonName, hackathonStartDate, memberSize, description },
            { new: true }
        );

        res.json(team);
    } catch (error) {
        console.error('Update Team Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/teams/:teamId/checklist
// @desc    Add custom checklist item
// @access  Protected + Member
router.post('/:teamId/checklist', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    try {
        const { item, description } = req.body;
        const team = req.team;

        team.submissionChecklist.push({ item, description, completed: false });
        await team.save();

        res.json(team);
    } catch (error) {
        console.error('Add Checklist Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

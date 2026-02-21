const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Workspace = require('../models/Workspace');
const { protect } = require('../middleware/auth');
const { checkTeamRole } = require('../middleware/teamAuth');
const crypto = require('crypto');
const templates = require('../config/templateData');
const Task = require('../models/Task');

// @route   POST /api/teams
// @desc    Create a new team and its workspace
// @access  Protected
router.post('/', protect, async (req, res) => {
    try {
        const { name, hackathonName, hackathonDate, memberSize } = req.body;

        // 1. Create Team
        const team = await Team.create({
            name,
            admin: req.mongoUser._id,
            members: [{ user: req.mongoUser._id, role: 'admin' }],
        });

        // 2. Create Workspace
        const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
        const inviteLink = `${process.env.FRONTEND_URL}/join/${inviteCode}`;

        const workspace = await Workspace.create({
            team: team._id,
            hackathonName,
            hackathonDate,
            memberSize: memberSize || 4,
            inviteCode,
            inviteLink
        });

        res.status(201).json({ team, workspace });
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
        const workspace = await Workspace.findOne({ inviteCode: req.params.inviteCode });
        if (!workspace) {
            return res.status(404).json({ message: 'Invalid invite code' });
        }

        const team = await Team.findById(workspace.team);

        // Check if already a member
        const isMember = team.members.some(
            (m) => m.user.toString() === req.mongoUser._id.toString()
        );

        if (isMember) {
            return res.status(400).json({ message: 'Already a member of this team' });
        }

        if (team.members.length >= (workspace.memberSize || 4)) {
            return res.status(400).json({ message: 'Team is already full' });
        }

        team.members.push({ user: req.mongoUser._id, role: 'member' });
        await team.save();

        res.status(200).json({ team, workspace });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/teams/:teamId
// @desc    Get team and workspace details
// @access  Protected + Member
router.get('/:teamId', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId)
            .populate('members.user', 'displayName email photoURL')
            .populate('admin', 'displayName email');

        const workspace = await Workspace.findOne({ team: req.params.teamId });

        res.json({ team, workspace });
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

        // Return teams with their workspaces
        const teamsWithWorkspaces = await Promise.all(teams.map(async (team) => {
            const workspace = await Workspace.findOne({ team: team._id });
            return { team, workspace };
        }));

        res.json(teamsWithWorkspaces);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/teams/:teamId/template
// @desc    Apply a template to a workspace
// @access  Protected + Admin
router.post('/:teamId/template', protect, checkTeamRole(['admin']), async (req, res) => {
    try {
        const { templateName } = req.body;
        const template = templates[templateName];

        if (!template) {
            return res.status(400).json({ message: 'Invalid template name' });
        }

        const workspace = await Workspace.findOne({ team: req.params.teamId });
        if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

        workspace.checklist = template.checklist.map(title => ({ title, completed: false }));
        await workspace.save();

        // Seed tasks
        const taskPromises = template.tasks.map(taskData => {
            return Task.create({
                ...taskData,
                team: req.params.teamId,
                createdBy: req.mongoUser._id
            });
        });

        await Promise.all(taskPromises);

        res.json({ message: `Template ${templateName} applied successfully`, workspace });
    } catch (error) {
        console.error('Template Application Error:', error);
        res.status(500).json({ message: 'Server Error during template application' });
    }
});

// @route   PATCH /api/teams/:teamId/checklist/:itemId
// @desc    Update checklist item
// @access  Protected + Member
router.patch('/:teamId/checklist/:itemId', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    try {
        const { completed } = req.body;
        const workspace = await Workspace.findOne({ team: req.params.teamId });

        const checkItem = workspace.checklist.id(req.params.itemId);
        if (!checkItem) {
            return res.status(404).json({ message: 'Checklist item not found' });
        }

        checkItem.completed = completed;
        await workspace.save();

        res.json(workspace);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PATCH /api/teams/:teamId
// @desc    Update team and workspace details
// @access  Protected + Admin
router.patch('/:teamId', protect, checkTeamRole(['admin']), async (req, res) => {
    try {
        const { name, hackathonName, hackathonDate, hackathonEndDate, memberSize, description } = req.body;

        const team = await Team.findByIdAndUpdate(
            req.params.teamId,
            { name, description },
            { new: true }
        );

        const workspace = await Workspace.findOneAndUpdate(
            { team: req.params.teamId },
            { hackathonName, hackathonDate, hackathonEndDate, memberSize },
            { new: true, runValidators: true }
        );

        res.json({ team, workspace });
    } catch (error) {
        console.error('Update Team Error Trace:', error);
        res.status(500).json({ message: 'Server Error', details: error.message });
    }
});

// @route   POST /api/teams/:teamId/checklist
// @desc    Add custom checklist item
// @access  Protected + Member
router.post('/:teamId/checklist', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    try {
        const { title, description } = req.body;
        const workspace = await Workspace.findOne({ team: req.params.teamId });

        workspace.checklist.push({ title, description, completed: false });
        await workspace.save();

        res.json(workspace);
    } catch (error) {
        console.error('Add Checklist Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PATCH /api/teams/:teamId/members/:userId
// @desc    Update member role
// @access  Protected + Admin
router.patch('/:teamId/members/:userId', protect, checkTeamRole(['admin']), async (req, res) => {
    try {
        const { role } = req.body;
        const team = req.team;

        const member = team.members.find(m => m.user.toString() === req.params.userId);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        member.role = role || member.role;
        await team.save();

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/teams/:teamId/members/:userId
// @desc    Remove member from team
// @access  Protected + Admin
router.delete('/:teamId/members/:userId', protect, checkTeamRole(['admin']), async (req, res) => {
    try {
        const team = req.team;

        const memberIndex = team.members.findIndex(m => m.user.toString() === req.params.userId);
        if (memberIndex === -1) return res.status(404).json({ message: 'Member not found' });

        if (team.members[memberIndex].role === 'admin') {
            const adminCount = team.members.filter(m => m.role === 'admin').length;
            if (adminCount <= 1) {
                return res.status(400).json({ message: 'Cannot remove the only admin' });
            }
        }

        team.members.splice(memberIndex, 1);
        await team.save();

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

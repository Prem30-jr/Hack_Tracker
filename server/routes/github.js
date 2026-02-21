const express = require('express');
const router = express.Router();
const axios = require('axios');
const Team = require('../models/Team');
const { protect } = require('../middleware/auth');
const { checkTeamRole } = require('../middleware/teamAuth');

// @route   GET /api/github/auth/:teamId
// @desc    Redirect to GitHub OAuth
// @access  Protected + Admin/Member
router.get('/auth/:teamId', protect, checkTeamRole(['admin', 'member']), (req, res) => {
    const teamId = req.params.teamId;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    // Using 'repo' scope for read access to repo data. 
    // 'public_repo' for public or 'repo' for private+public
    const scope = 'repo';
    const state = teamId; // Pass teamId in state to identify on callback

    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    res.json({ url: githubUrl });
});

// @route   GET /api/github/callback
// @desc    GitHub OAuth callback
// @access  Public (GitHub redirects here)
router.get('/callback', async (req, res) => {
    const { code, state: teamId } = req.query;

    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
        // Exchange code for access token
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code,
            redirect_uri: process.env.GITHUB_CALLBACK_URL,
        }, {
            headers: {
                Accept: 'application/json',
                'User-Agent': 'HackTracker-App'
            },
        });

        const accessToken = response.data.access_token;

        if (!accessToken) {
            return res.status(400).send('Failed to obtain access token');
        }

        // Get user/repo info if needed? 
        // For now, we'll let the user specify the repo on the frontend, 
        // OR we can list repos and let them choose.
        // Let's assume we redirect back to the workspace and then they can select/enter repo.
        // But the requirement says "connect a GitHub repository via OAuth".

        await Team.findByIdAndUpdate(teamId, {
            githubAccessToken: accessToken,
            githubConnected: true
        });

        // Redirect back to frontend
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/workspace/${teamId}`);

    } catch (error) {
        console.error('GitHub Auth Error:', error);
        res.status(500).send('Authentication Error');
    }
});

// @route   POST /api/github/connect-repo/:teamId
// @desc    Connect a specific repository
// @access  Protected + Admin
router.post('/connect-repo/:teamId', protect, checkTeamRole(['admin']), async (req, res) => {
    const { owner, repo } = req.body;
    const teamId = req.params.teamId;

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (!team.githubAccessToken) {
            return res.status(400).json({ message: 'GitHub not authorized. Please authenticate first.' });
        }

        // Verify repo exists and we have access
        const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Authorization: `Bearer ${team.githubAccessToken}`,
                'User-Agent': 'HackTracker-App'
            },
        });

        team.githubRepoOwner = owner;
        team.githubRepoName = repo;
        team.githubRepoId = repoRes.data.id;
        team.githubRepo = repoRes.data.html_url;
        await team.save();

        res.json({ message: 'Repository connected successfully', team });
    } catch (error) {
        console.error('GitHub Connect Error:', error.response?.data || error.message);
        const errorMessage = error.response?.status === 404
            ? 'Repository not found. Check owner/repo names and permissions.'
            : 'Failed to connect repository. GitHub API error.';
        res.status(400).json({ message: errorMessage });
    }
});

// @route   GET /api/github/stats/:teamId
// @desc    Get repository statistics
// @access  Protected + Member
router.get('/stats/:teamId', protect, checkTeamRole(['admin', 'member']), async (req, res) => {
    const teamId = req.params.teamId;

    try {
        const team = await Team.findById(teamId);
        if (!team.githubAccessToken || !team.githubRepoName) {
            return res.status(400).json({ message: 'GitHub not connected' });
        }

        const { githubRepoOwner, githubRepoName, githubAccessToken } = team;
        const config = {
            headers: {
                Authorization: `Bearer ${githubAccessToken}`,
                'User-Agent': 'HackTracker-App'
            }
        };

        // Fetch Commits (last 30)
        const commitsRes = await axios.get(`https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/commits?per_page=30`, config);

        // Fetch Pull Requests
        const prsRes = await axios.get(`https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/pulls?state=all&per_page=10`, config);

        // Fetch Contributors
        const contributorsRes = await axios.get(`https://api.github.com/repos/${githubRepoOwner}/${githubRepoName}/contributors`, config);

        res.json({
            commits: commitsRes.data,
            pullRequests: prsRes.data,
            contributors: contributorsRes.data
        });
    } catch (error) {
        console.error('GitHub Stats Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Failed to fetch GitHub stats' });
    }
});

module.exports = router;

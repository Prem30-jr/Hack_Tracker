const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    hackathonName: String,
    hackathonStartDate: Date,
    memberSize: {
        type: Number,
        default: 4
    },
    description: String,
    inviteCode: {
        type: String,
        required: true,
        unique: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            role: {
                type: String,
                enum: ['admin', 'member'],
                default: 'member',
            },
        },
    ],
    submissionChecklist: [
        {
            item: String,
            description: String,
            completed: { type: Boolean, default: false }
        }
    ],
    template: {
        type: String,
        enum: ['None', 'SIH', 'Generic Hackathon', 'SaaS MVP'],
        default: 'None'
    },
    githubRepo: String,
    githubAccessToken: String,
    githubRepoId: String,
    githubRepoName: String,
    githubRepoOwner: String,
    githubConnected: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Team', TeamSchema);

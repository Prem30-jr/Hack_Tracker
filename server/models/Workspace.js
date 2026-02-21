const mongoose = require('mongoose');

const ChecklistSchema = require('./Checklist');

const WorkspaceSchema = new mongoose.Schema({
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
        unique: true
    },
    hackathonName: String,
    hackathonDate: Date,
    hackathonEndDate: Date,
    memberSize: { type: Number, default: 4 },
    inviteCode: { type: String, required: true, unique: true },
    inviteLink: String,
    checklist: [ChecklistSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Workspace', WorkspaceSchema);

const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Generate unique 4-digit code
const generateJoinCode = async () => {
    let code;
    let exists = true;

    while (exists) {
        code = Math.floor(1000 + Math.random() * 9000).toString();
        const org = await prisma.organisation.findUnique({
            where: { joinCode: code }
        });
        exists = !!org;
    }

    return code;
};

// Create organization
router.post('/create', auth, async (req, res) => {
    try {
        const { name, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const joinCode = await generateJoinCode();

        const org = await prisma.organisation.create({
            data: {
                name,
                password: hashedPassword,
                joinCode,
                ownerId: req.userId
            }
        });

        res.status(201).json(org);
    } catch (error) {
        console.error('Create org error:', error);
        res.status(500).json({ error: 'Failed to create organization' });
    }
});

// Join organization
router.post('/join', auth, async (req, res) => {
    try {
        const { joinCode, password } = req.body;

        const org = await prisma.organisation.findUnique({
            where: { joinCode }
        });

        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        const isValidPassword = await bcrypt.compare(password, org.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Check if already a member
        if (org.memberIds.includes(req.userId)) {
            return res.status(400).json({ error: 'Already a member' });
        }

        // Add user to organization
        const updatedOrg = await prisma.organisation.update({
            where: { id: org.id },
            data: {
                memberIds: {
                    push: req.userId
                }
            }
        });

        res.json(updatedOrg);
    } catch (error) {
        console.error('Join org error:', error);
        res.status(500).json({ error: 'Failed to join organization' });
    }
});

// Get created organizations
router.get('/created', auth, async (req, res) => {
    try {
        const orgs = await prisma.organisation.findMany({
            where: { ownerId: req.userId },
            include: {
                tests: true
            }
        });

        res.json(orgs);
    } catch (error) {
        console.error('Get created orgs error:', error);
        res.status(500).json({ error: 'Failed to fetch organizations' });
    }
});

// Get joined organizations
router.get('/joined', auth, async (req, res) => {
    try {
        const orgs = await prisma.organisation.findMany({
            where: {
                memberIds: {
                    has: req.userId
                }
            },
            include: {
                tests: true
            }
        });

        res.json(orgs);
    } catch (error) {
        console.error('Get joined orgs error:', error);
        res.status(500).json({ error: 'Failed to fetch organizations' });
    }
});

// Get single organization
router.get('/:id', auth, async (req, res) => {
    try {
        const org = await prisma.organisation.findUnique({
            where: { id: req.params.id },
            include: {
                tests: true
            }
        });

        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }


        if (org.ownerId !== req.userId && !org.memberIds.includes(req.userId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(org);
    } catch (error) {
        console.error('Get org error:', error);
        res.status(500).json({ error: 'Failed to fetch organization' });
    }
});

// Delete organization
router.delete('/:id', auth, async (req, res) => {
    try {
        const org = await prisma.organisation.findUnique({
            where: { id: req.params.id }
        });

        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        if (org.ownerId !== req.userId) {
            return res.status(403).json({ error: 'Only owner can delete organization' });
        }

        await prisma.organisation.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Organization deleted' });
    } catch (error) {
        console.error('Delete org error:', error);
        res.status(500).json({ error: 'Failed to delete organization' });
    }
});

module.exports = router;

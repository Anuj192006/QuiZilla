const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create test
router.post('/create/:orgId', auth, async (req, res) => {
    try {
        const { title, questions } = req.body;
        const { orgId } = req.params;

        const org = await prisma.organisation.findUnique({
            where: { id: orgId }
        });

        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        if (org.ownerId !== req.userId) {
            return res.status(403).json({ error: 'Only owner can create tests' });
        }

        const test = await prisma.test.create({
            data: {
                title,
                questions,
                orgId
            }
        });

        res.status(201).json(test);
    } catch (error) {
        console.error('Create test error:', error);
        res.status(500).json({ error: 'Failed to create test' });
    }
});

// Get all tests in organization
router.get('/:orgId', auth, async (req, res) => {
    try {
        const tests = await prisma.test.findMany({
            where: { orgId: req.params.orgId }
        });

        res.json(tests);
    } catch (error) {
        console.error('Get tests error:', error);
        res.status(500).json({ error: 'Failed to fetch tests' });
    }
});

// Get single test
router.get('/single/:testId', auth, async (req, res) => {
    try {
        const test = await prisma.test.findUnique({
            where: { id: req.params.testId }
        });

        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }

        res.json(test);
    } catch (error) {
        console.error('Get test error:', error);
        res.status(500).json({ error: 'Failed to fetch test' });
    }
});

// Submit test attempt
router.post('/attempt/:testId', auth, async (req, res) => {
    try {
        const { answers, timeTaken } = req.body;
        const { testId } = req.params;

        const test = await prisma.test.findUnique({
            where: { id: testId }
        });

        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });

        const questions = test.questions;
        let score = 0;

        answers.forEach(answer => {
            if (questions[answer.questionIndex].correctIndex === answer.selectedOption) {
                score++;
            }
        });

        const attempt = {
            userId: req.userId,
            userName: user.name,
            score,
            timeTaken,
            submittedAt: new Date().toISOString()
        };

        const currentAttempts = Array.isArray(test.attempts) ? test.attempts : [];

        const updatedTest = await prisma.test.update({
            where: { id: testId },
            data: {
                attempts: [...currentAttempts, attempt]
            }
        });

        res.json({ score, total: questions.length });
    } catch (error) {
        console.error('Submit attempt error:', error);
        res.status(500).json({ error: 'Failed to submit attempt' });
    }
});

// Get leaderboard
router.get('/leaderboard/:testId', auth, async (req, res) => {
    try {
        const test = await prisma.test.findUnique({
            where: { id: req.params.testId }
        });

        if (!test) {
            return res.status(404).json({ error: 'Test not found' });
        }

        const attempts = Array.isArray(test.attempts) ? test.attempts : [];


        const leaderboard = attempts.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.timeTaken - b.timeTaken;
        });

        res.json({
            testTitle: test.title,
            leaderboard
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

module.exports = router;

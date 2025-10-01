import express from 'express';
import { param } from 'express-validator';
import { validate } from '../utils/validation';
import { getIdeas, saveVote } from '../controllers/ideasController';

const router = express.Router();

router.get('/', getIdeas);
router.post(
    '/:id/vote',
    [
        param('id').isInt({ min: 1 }),
    ],
    validate,
    saveVote,
);

export default router;

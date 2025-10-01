import type { Request, Response } from 'express';
import { getIp } from '../utils/ip';
import logger from '../config/logger';
import { handleError } from '../utils/errors';
import { VOTES_LIMIT } from '../constants';
import pool from '../config/db';

export const getIdeas = async (req: Request, res: Response) => {
    const funcName = 'getIdeas';

    try {
        const ip = getIp(req);

        if (!ip) {
            logger.info(`${funcName}: IP not found`);
            return res.status(400).json({ error: 'IP not found' });
        }

        const ideasResult = await pool.query(`
            SELECT 
                i.id,
                i.title,
                i.description,
                i."votesCount",
                CASE WHEN v."ideaId" IS NOT NULL THEN true ELSE false END as "isVoted"
            FROM ideas i
            LEFT JOIN votes v ON i.id = v."ideaId" AND v."ipAddress" = $1
            ORDER BY i."votesCount" DESC
        `, [ip]);

        const voteCountResult = await pool.query('SELECT COUNT(*) FROM votes WHERE "ipAddress" = $1', [ip]);

        const response = {
            ideas: ideasResult.rows,
            votesLimit: VOTES_LIMIT,
            remainingVotesCount: VOTES_LIMIT - voteCountResult.rows[0].count,
        };

        res.status(200).json(response);
    }
    catch (error) {
        handleError({ funcName, error });
        res.status(400).json({ error: 'error' });
    }
};

export const saveVote = async (req: Request, res: Response) => {
    const funcName = 'saveVote';

    try {
        const ideaId = req.params.id;
        const ip = getIp(req);

        if (!ip) {
            logger.info(`${funcName}: IP not found`);
            return res.status(400).json({ error: 'IP not found' });
        }

        const ideaExists = await pool.query('SELECT id FROM ideas WHERE id = $1', [ideaId]);
        if (ideaExists.rowCount === 0) {
            logger.info(`${funcName}: idea not found: ${ideaId}, IP: ${ip}`);
            res.status(404).json({ error: 'Idea not found' });
            return;
        }

        const voteCountResult = await pool.query('SELECT COUNT(*) FROM votes WHERE "ipAddress" = $1', [ip]);
        const voteCount = voteCountResult.rows[0].count;

        if (voteCount >= VOTES_LIMIT) {
            logger.info(`${funcName}: vote limit exceeded for IP: ${ip}, count: ${voteCount}`);
            return res.status(409).json({ error: `Vote limit exceeded (max ${ VOTES_LIMIT })` });
        }

        const existingVote = await pool.query(
            'SELECT id FROM votes WHERE "ideaId" = $1 AND "ipAddress" = $2',
            [ideaId, ip],
        );

        if (existingVote.rows.length > 0) {
            logger.info(`${funcName}: already voted for this idea, IP: ${ip}, ideaId: ${ideaId}`);
            return res.status(409).json({ error: 'Already voted for this idea' });
        }

        await pool.query('BEGIN');
        try {
            await pool.query('INSERT INTO votes ("ideaId", "ipAddress") VALUES ($1, $2)', [ideaId, ip]);
            await pool.query('UPDATE ideas SET "votesCount" = "votesCount" + 1 WHERE id = $1', [ideaId]);
            await pool.query('COMMIT');
        } catch (error) {
            await pool.query('ROLLBACK');
            throw error;
        }

        res.status(200).json({ message: 'success' });
    }
    catch (error) {
        handleError({ funcName, error });
        res.status(400).json({ error: 'error' });
    }
};

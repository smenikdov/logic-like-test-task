/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('votes', {
        id: { type: 'SERIAL', primaryKey: true },
        ideaId: { type: 'INTEGER', notNull: true, references: 'ideas(id)', onDelete: 'CASCADE' },
        ipAddress: { type: 'VARCHAR(45)', notNull: true },
        createdAt: { type: 'TIMESTAMP', default: pgm.func('CURRENT_TIMESTAMP') },
    });
    pgm.createConstraint('votes', 'unique_idea_ip', {
        unique: ['ideaId', 'ipAddress'],
    });
    pgm.createIndex('votes', 'ipAddress', { name: 'idx_votes_ip' });
    pgm.createIndex('votes', ['ideaId', 'ipAddress'], { name: 'idx_votes_idea_ip' });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('votes');
};

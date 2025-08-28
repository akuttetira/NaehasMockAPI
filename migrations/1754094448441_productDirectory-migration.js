/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('product_directory', {
        product_id: {
            type: 'varchar(250)',
            notNull: true,
            primaryKey: true,
        },
        banking_product_type: {
            type: 'varchar(250)',
            notNull: true,
        },
        parent_product_id: {
            type: 'varchar(250)',
        },
        product_description: {
            type: 'text',
            notNull: true,
        },
        product_status: {
            type: 'varchar(10)',
            notNull: true,
        },
        product_version: {
            type: 'varchar(250)',
            notNull: true,
        },
        variant_type: {
            type: 'varchar(20)',
        },


    });
    
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('product_directory');
};

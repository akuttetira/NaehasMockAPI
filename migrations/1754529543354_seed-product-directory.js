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

    pgm.sql(
        `
        CREATE TABLE bundle_list (
            bundle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            bundle_type VARCHAR(250) NOT NULL,
            all_required BOOLEAN NOT NULL
        );

        CREATE TABLE bundle_component_ids (
            bundle_id UUID NOT NULL REFERENCES bundle_list(bundle_id) ON DELETE CASCADE,
            product_id VARCHAR(250) NOT NULL REFERENCES product_directory(product_id),
            PRIMARY KEY (bundle_id, product_id)
        );

        `
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {

    pgm.sql(`DROP TABLE bundle_list;`);

};

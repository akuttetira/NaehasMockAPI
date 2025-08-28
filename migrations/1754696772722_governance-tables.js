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
        CREATE TABLE regional_pricing (
            product_id VARCHAR(250) NOT NULL REFERENCES product_directory(product_id) ON DELETE CASCADE,
            region_code VARCHAR(10) NOT NULL,
            currency VARCHAR(3) NOT NULL,
            price NUMERIC(10, 4) NOT NULL,
            effective_date DATE NOT NULL, 
            customer_segment VARCHAR(250),
            pricing_tier VARCHAR(250),
            PRIMARY KEY (product_id, region_code)
        );

        CREATE TABLE service_fees (
            fee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            product_id VARCHAR(250) REFERENCES product_directory(product_id),
            fee_type TEXT NOT NULL,
            description TEXT,
            amount NUMERIC(10,2) NOT NULL,
            currency VARCHAR(3) NOT NULL,
            frequency VARCHAR(100) NOT NULL,
            effective_date DATE NOT NULL,
            waived_for TEXT,
            customer_segment VARCHAR(250)
        );

        WITH regions(region_code, currency, price, effective_date, customer_segment, pricing_tier) AS (
        VALUES
            ('US', 'USD', 49.9900, CURRENT_DATE, 'Retail',  'Standard'),
            ('EU', 'EUR', 45.9900, CURRENT_DATE, 'Business','Premium')
        )
        INSERT INTO regional_pricing (
        product_id, region_code, currency, price, effective_date, customer_segment, pricing_tier
        )
        SELECT pd.product_id, r.region_code, r.currency, r.price, r.effective_date, r.customer_segment, r.pricing_tier
        FROM product_directory pd
        CROSS JOIN regions r
        ON CONFLICT (product_id, region_code) DO NOTHING;

        `
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE service_fees;
        DROP TABLE regional_pricing;
        
        `);
};

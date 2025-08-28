/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

// migrations/1690002000000_seed_multiple_product_directory_entries.js

exports.up = (pgm) => {
  pgm.sql(`INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES (
  'PRD-1001',
  'Savings Account Basic',
  NULL,
  'A no-fee savings account with free online transfers and automatic savings tools.',
  'Active',
  '1.0.0',
  'customer-segment'
);

INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES (
  'PRD-1002',
  'Premium Checking',
  'PRD-1001',
  'High-limit checking with unlimited ATM reimbursements and concierge support.',
  'Active',
  '1.1.0',
  'channel-specific'
);

INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES (
  'PRD-1003',
  'Student Credit Card',
  NULL,
  'Low-APR credit card designed for students, with rewards on textbooks and dining.',
  'Initiated',
  '0.9.0',
  'region-specific'
);

INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES (
  'PRD-1004',
  'Auto Loan Silver',
  NULL,
  'Competitive rate auto loan with flexible repayment terms up to 84 months.',
  'Active',
  '2.0.1',
  NULL
);

INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES (
  'PRD-1005',
  'Home Mortgage Standard',
  NULL,
  'Fixed-rate 30-year mortgage with no origination fee for well-qualified borrowers.',
  'Active',
  '3.2.4',
  'region-specific'
);

INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES (
  'PRD-1006',
  'Business Line of Credit',
  NULL,
  'Revolving credit line for small businesses, with interest-only payments on used funds.',
  'Active',
  '1.0.0',
  'customer-segment'
);

INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES (
  'PRD-1007',
  'Certificate of Deposit',
  NULL,
  '12-month CD offering a guaranteed 2.5% APY, with penalty for early withdrawal.',
  'Obsolete',
  '1.0.0',
  'channel-specific'
);

INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES (
  'PRD-1008',
  'High-Yield Savings',
  'PRD-1001',
  'Savings account with tiered interest rates up to 3.0% APY for balances over $10,000.',
  'Active',
  '2.3.0',
  'customer-segment'
);

INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES (
  'PRD-1009',
  'Gold Credit Card',
  'PRD-1003',
  'Rewards credit card with 2x points on dining and travel, plus airport lounge access.',
  'Active',
  '1.0.1',
  'channel-specific'
);

INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES (
  'PRD-1010',
  'Junior Savings Account',
  'PRD-1001',
  'Youth savings account with parental controls and educational financial tools.',
  'Active',
  '1.0.0',
  NULL
);
`);
};

exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM product_directory
     WHERE product_id IN (
       'PRD-1001','PRD-1002','PRD-1003','PRD-1004','PRD-1005',
       'PRD-1006','PRD-1007','PRD-1008','PRD-1009','PRD-1010'
     );
  `);
};


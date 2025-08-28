const express = require("express");
const pool = require("../database/db");
const router = express.Router();
// routers/productDirectory.js

// List all products with optional filters and pagination
// GET /ProductDirectory?status=&bankingProductType=&parentProductId=&page=&pageSize=
router.get("/ProductDirectory", async (req, res) => {
  const {
    status = null,
    bankingProductType = null,
    parentProductId = null,
    page = "1",
    pageSize = "20",
  } = req.query;
  let sql = "SELECT * FROM product_directory";

  const conditions = [];
  const values = [];

  if (status !== null) {
    conditions.push(
      `product_directory.product_status = $${conditions.length + 1}`
    );
    values.push(status);
  }

  if (bankingProductType !== null) {
    conditions.push(`banking_product_type = $${conditions.length + 1}`);
    values.push(bankingProductType);
  }

  if (parentProductId !== null) {
    conditions.push(`parent_product_type = $${conditions.length + 1}`);
    values.push(parentProductType);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  const pageNumber = Math.max(1, parseInt(page, 10) || 1);
  sql += ` OFFSET $${conditions.length + 1}`;
  const pageSizer = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);
  sql += ` LIMIT $${conditions.length + 2};`;

  values.push((pageNumber - 1) * pageSizer);
  values.push(pageSizer);

  try {
    const result = await req.pool.query(sql, values);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Register a new product
// POST /ProductDirectory/Register
router.post("/ProductDirectory/Register", async (req, res) => {
  const {
    bankingProductType,
    parentProductId = null,
    productDescription,
    productId,
    productStatus,
    productVersion,
    variantType,
  } = req.body;
  let sql = `INSERT INTO product_directory (
  product_id,
  banking_product_type,
  parent_product_id,
  product_description,
  product_status,
  product_version,
  variant_type
) VALUES ( $1, $2, $3, $4, $5, $6, $7 )
 RETURNING *;`;

  const statusOptions = ["Active", "Initiated", "Obsolete"];
  const varOptions = [
    "channel-specific",
    "customer-segment",
    "region-specific",
  ];

  if (!bankingProductType) {
    return res.status(400).json({ error: "bankingProductType is required." });
  }
  if (!productDescription) {
    return res.status(400).json({ error: "productDescription is required." });
  }
  if (!productId) {
    return res.status(400).json({ error: "productId is required." });
  }
  if (!productStatus) {
    return res.status(400).json({ error: "productStatus is required." });
  }
  if (!statusOptions.includes(productStatus)) {
    return res.status(400).json({
      error: "productStatus must be one of ['Active', 'Initiated', 'Obsolete']",
    });
  }
  if (!productVersion) {
    return res.status(400).json({ error: "productVersion is required." });
  }
  if (!variantType) {
    return res.status(400).json({ error: "variantType is required." });
  }
  if (!varOptions.includes(variantType)) {
    return res.status(400).json({
      error:
        "variantType must be one of ['channel-specific', 'customer-segment', 'region-specific']",
    });
  }

  const values = [
    productId,
    bankingProductType,
    parentProductId,
    productDescription,
    productStatus,
    productVersion,
    variantType,
  ];

  try {
    const result = await req.pool.query(sql, values);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Retrieve a specific product by ID
// GET /ProductDirectory/:productId/Retrieve
router.get("/ProductDirectory/:productId/Retrieve", async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ error: "productId parameter missing" });
  }
  try {
    const result = await req.pool.query(
      `SELECT * FROM product_directory WHERE product_directory.product_id = $1`,
      [productId]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a specific product by ID
// PUT /ProductDirectory/:productId/Update
router.put("/ProductDirectory/:productId/Update", async (req, res) => {
  const { productId } = req.params;
  let productId1 = productId;
  const {
    bankingProductType,
    parentProductId,
    productDescription,
    productStatus,
    productVersion,
    variantType,
  } = req.body;
  let sql = `UPDATE product_directory SET `;
  const values = [];
  let newVal = false;
  let assignments = [];

  const statusOptions = ["Active", "Initiated", "Obsolete"];
  const varOptions = [
    "channel-specific",
    "customer-segment",
    "region-specific",
  ];

  if (bankingProductType) {
    assignments.push(`banking_product_type = $${values.length + 1} `);
    values.push(bankingProductType);
    newVal = true;
  }
  if (parentProductId) {
    assignments.push(`parent_product_id = $${values.length + 1} `);
    values.push(parentProductId);
    newVal = true;
  }
  if (productDescription) {
    assignments.push(`product_description = $${values.length + 1} `);
    values.push(productDescription);
    newVal = true;
  }
  if (productStatus) {
    if (!statusOptions.includes(productStatus)) {
      return res.status(400).json({
        error:
          "productStatus must be one of ['Active', 'Initiated', 'Obsolete']",
      });
    }
    assignments.push(`product_status = $${values.length + 1} `);
    values.push(productStatus);
    newVal = true;
  }
  if (productVersion) {
    assignments.push(`product_version = $${values.length + 1} `);
    values.push(productVersion);
    newVal = true;
  }
  if (variantType) {
    if (!varOptions.includes(variantType)) {
      return res.status(400).json({
        error:
          "variantType must be one of ['channel-specific', 'customer-segment', 'region-specific']",
      });
    }
    assignments.push(`variant_type = $${values.length + 1} `);
    values.push(variantType);
    newVal = true;
  }

  if (!newVal) {
    return res.status(400).json({ error: "No updated values provided" });
  }

  sql += assignments.join(",");

  sql += `WHERE product_id = $${values.length + 1} RETURNING *;`;

  values.push(productId1);

  try {
    const result = await req.pool.query(sql, values);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/ProductDirectory/Bundle/Register", async (req, res) => {
  const { bundleType, componentProductIds = [], rules } = req.body;

  if (!bundleType) {
    return res.status(400).json({ error: "bundleType missing" });
  }
  if (!Array.isArray(componentProductIds) || componentProductIds.length === 0) {
    return res.status(400).json({ error: "componentProductIds missing" });
  }
  if (!rules || typeof rules.allRequired !== "boolean") {
    return res.status(400).json({ error: "rules missing" });
  }

  const client = await req.pool.connect();

  try {
    await client.query(`BEGIN;`);
    const sql = `INSERT INTO bundle_list (bundle_type, all_required) VALUES ($1, $2) RETURNING bundle_id;`;
    const values = [bundleType, rules.allRequired];
    const result = await client.query(sql, values);
    const b_id = result.rows[0].bundle_id;

    const inserts = componentProductIds.map((pid) =>
      client.query(
        `INSERT INTO bundle_component_ids (bundle_id, product_id)
        VALUES ($1, $2)
        `,
        [b_id, pid]
      )
    );

    await Promise.all(inserts);
    await client.query("COMMIT;");
    return res.status(201).json({ b_id });
  } catch (err) {
    await client.query("ROLLBACK;");
    return res.status(500).json({ err });
  } finally {
    client.release();
  }
});

router.post(
  "/ProductDirectory/:productId/Simulation/Evaluate",
  async (req, res) => {
    const body = req.body;
    const { productId } = req.params;
    const errors = [];
    if (typeof body !== "object" || body === null) {
      errors.push("Body must be a JSON object");
    } else {
      const { customerProfile, preferences } = body;

      if (typeof customerProfile !== "object" || customerProfile === null) {
        errors.push("customerProfile must be an object");
      } else {
        const { age, creditScore, employmentStatus, income, residency } =
          customerProfile;

        if (!Number.isInteger(age) || age < 0)
          errors.push("customerProfile.age must be a non-negative integer");
        if (
          typeof creditScore !== "number" ||
          creditScore < 0 ||
          creditScore > 1000
        )
          errors.push(
            "customerProfile.creditScore must be a number between 0 and 1000"
          );
        if (typeof employmentStatus !== "string" || !employmentStatus.trim())
          errors.push(
            "customerProfile.employmentStatus must be a non-empty string"
          );
        if (typeof income !== "number" || income < 0)
          errors.push("customerProfile.income must be a non-negative number");
        if (typeof residency !== "string" || !residency.trim())
          errors.push("customerProfile.residency must be a non-empty string");
      }

      if (typeof preferences !== "object" || preferences === null) {
        errors.push("preferences must be an object");
      } else {
        const { channel, existingLoan } = preferences;
        if (typeof channel !== "string" || !channel.trim())
          errors.push("preferences.channel must be a non-empty string");
        if (typeof existingLoan !== "boolean")
          errors.push("preferences.existingLoan must be a boolean");
      }
    }

    if (errors.length) {
      return res
        .status(400)
        .json({ error: "Invalid request", details: errors });
    }

    const rejectedReasons = [];
    const { customerProfile } = req.body;
    let eligible = true;
    if (customerProfile.creditScore < 600) {
      eligible = false;
      rejectedReasons.push("Low credit score");
    }
    if (customerProfile.income < 15000) {
      eligible = false;
      rejectedReasons.push("Insufficient income");
    }

    const simulationResult = {
      productId,
      eligible,
      pricingRecommendation: eligible
        ? { rate: 4.5, fees: 199 }
        : { rate: 0, fees: 0 },
      rejectedReasons,
    };

    return res.status(200).json({ simulationResult });
  }
);

router.get("/ProductDirectory/:productId/Governance", async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ error: "productId parameter missing" });
  }

  // Boilerplate governance response
  const response = {
    productId,
    legalRequirement: {
      jurisdiction: "US",
      licenseType: "Standard Banking License",
      termsOfUseUri: "https://example.com/terms",
    },
    operationalRiskRequirement: {
      mitigationSteps: ["Annual audit", "Fraud monitoring"],
      residualRisk: "Low",
      riskLevel: "Medium",
    },
  };

  return res.status(200).json(response);
});

router.post(
  "/ProductDirectory/:productId/Governance/Approval",
  async (req, res) => {
    const { productId } = req.params;
    const body = req.body;
    if (typeof body !== "object" || body === null) {
      return res.status(400).json({
        error: `body must be an object of the following structure: 
      properties:
        notes:
          type: string
        submittedAt:
          format: date-time
          type: string
        submittedBy:
          format: email
          type: string
      type: object`,
      });
    }

    const { notes, submittedAt, submittedBy } = body;

    // Simple validation
    if (
      typeof notes !== "string" ||
      typeof submittedAt !== "string" ||
      typeof submittedBy !== "string"
    ) {
      return res.status(400).json({
        error:
          "notes, submittedAt, and submittedBy are required and must be strings.",
      });
    }

    // Boilerplate approval response
    const response = {
      productId,
      approvalStatus: "Submitted",
      notes,
      submittedAt,
      submittedBy,
      approvalId: "APPROVAL-" + Math.floor(Math.random() * 1000000),
      message: "Governance approval submitted successfully.",
    };

    return res.status(200).json(response);
  }
);

router.post(
  "/ProductDirectory/:productId/Governance/Notify",
  async (req, res) => {
    const { productId } = req.params;
    const { eventType, message, notifiedTo = [], status } = req.body;

    // Basic validation
    if (
      !eventType ||
      !message ||
      !Array.isArray(notifiedTo) ||
      notifiedTo.length === 0 ||
      !status
    ) {
      return res.status(400).json({
        error:
          "eventType, message, notifiedTo (non-empty array), and status are required.",
      });
    }

    // Boilerplate notification response
    const response = {
      notificationStatus: "Delivered",
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  }
);

router.get("/product-pricing/:productId/regional-pricing", async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ error: "productId required." });
  }

  try {
    const result = await req.pool.query(
      `SELECT * FROM regional_pricing WHERE product_id = $1;`,
      [productId]
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post(
  "/product-pricing/:productId/regional-pricing",
  async (req, res) => {
    const { productId } = req.params;
    const {
      regionCode,
      currency,
      price,
      effectiveDate,
      conditions = {},
    } = req.body;
    const { customerSegment = null, pricingTier = null } = conditions;

    let sql = `INSERT INTO regional_pricing (
    product_id, 
    region_code,
    currency,
    price,
    effective_date,
    customer_segment,
    pricing_tier)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`;

    if (!productId || !regionCode || !currency || !price || !effectiveDate) {
      return res.status(400).json({ error: "Bad Request body" });
    }

    const values = [
      productId,
      regionCode,
      currency,
      price,
      effectiveDate,
      customerSegment,
      pricingTier,
    ];

    try {
      const result = await req.pool.query(sql, values);
      return res.status(201).json(result.rows[0]);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.get(
  "/product-pricing/:productId/regional-pricing/:regionCode",
  async (req, res) => {
    const { productId, regionCode } = req.params;
    if (!productId || !regionCode) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const sql = `SELECT * FROM regional_pricing WHERE product_id = $1 AND region_code = $2;`;
    const values = [productId, regionCode];

    try {
      const result = await req.pool.query(sql, values);
      return res.status(200).json(result.rows);
    } catch (error) {
      return regionCode.status(500).json(error);
    }
  }
);

router.put(
  "/product-pricing/:productId/regional-pricing/:regionCode",
  async (req, res) => {
    const { productId, regionCode } = req.params;
    const { currency, price, effectiveDate, conditions = {} } = req.body;
    if (!productId || !regionCode || !currency || !effectiveDate || !price) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const { customerSegment = null, pricingTier = null } = conditions;

    let sql = `UPDATE regional_pricing SET currency = $1, effective_date = $2, price = $3, customer_segment = $4, pricing_tier = $5 WHERE product_id = $6 AND region_code = $7 RETURNING *;`;

    values = [
      currency,
      effectiveDate,
      price,
      customerSegment,
      pricingTier,
      productId,
      regionCode,
    ];

    try {
      const result = await req.pool.query(sql, values);
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.get("/product-pricing/:productId/service-fees", async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return req.status(400).json({ error: "productId missing" });
  }

  const sql = `SELECT * FROM service_fees WHERE product_id = $1`;

  try {
    const result = await req.pool.query(sql, [productId]);
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/product-pricing/:productId/service-fees", async (req, res) => {
  const { productId } = req.params;
  const {
    feeType,
    description = null,
    amount,
    currency,
    frequency,
    effectiveDate,
    conditions = {},
  } = req.body;
  const { waivedFor = null, customerSegment = null } = conditions;

  const sql = `INSERT INTO service_fees (product_id, fee_type, description, amount, currency, frequency, effective_date, waived_for, customer_segment)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`;
  const values = [
    productId,
    feeType,
    description,
    amount,
    currency,
    frequency,
    effectiveDate,
    waivedFor,
    customerSegment,
  ];

  try {
    const result = await req.pool.query(sql, values);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.get(
  "/product-pricing/:productId/service-fees/:feeId",
  async (req, res) => {
    const { productId, feeId } = req.params;
    const sql = `SELECT * FROM service_fees WHERE product_id = $1 AND fee_id = $2;`;

    const values = [productId, feeId];

    try {
      const result = await req.pool.query(sql, values);
      return res.status(200).json(result.rows);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.put(
  "/product-pricing/:productId/service-fees/:feeId",
  async (req, res) => {
    const { productId, feeId } = req.params;
    const {
      feeType,
      amount,
      currency,
      frequency,
      effectiveDate,
      description = null,
      conditions = {},
    } = req.body;
    const { waivedFor = null, customerSegment = null } = conditions;

    if (!productId || !feeId) {
      return res.status(400).json({ error: "Missing productId or feeId" });
    }
    if (!feeType || !amount || !currency || !frequency || !effectiveDate) {
      return res.status(400).json({ error: "Bad request body" });
    }
    const sql = `UPDATE service_fees SET fee_type = $1, amount = $2, currency = $3, frequency = $4, effective_date = $5, description = $6, waived_for = $7, customer_segment = $8 WHERE product_id = $9 AND fee_id = $10 RETURNING *;`;

    const values = [
      feeType,
      amount,
      currency,
      frequency,
      effectiveDate,
      description,
      waivedFor,
      customerSegment,
      productId,
      feeId,
    ];

    try {
      const result = await req.pool.query(sql, values);
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

router.delete(
  "/product-pricing/:productId/service-fees/:feeId",
  async (req, res) => {
    const { productId, feeId } = req.params;
    if (!productId || !feeId) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const sql = `DELETE FROM service_fees WHERE product_id = $1 AND fee_id = $2`;
    const values = [productId, feeId];

    try {
      const result = await req.pool.query(sql, values);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

module.exports = router;

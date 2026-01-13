// backend/controllers/adminController.js
const db = require('../config/database');

// Helper pour gérer les erreurs
const handleError = (res, error) => {
  console.error('--- DATABASE ERROR ---', error);
  res.status(500).json({ error: error.message });
};

exports.getSalesStats = async (req, res) => {
  const { startDate, endDate } = req.query;

  const params = [];
  let dateFilterOnJoin = '';
  if (startDate && endDate) {
      params.push(startDate, endDate);
      dateFilterOnJoin = `AND s.sale_date BETWEEN $1 AND $2`;
  }
  
  const query = `
    SELECT 
      p.name as product_name,
      COUNT(s.id) as sales_count,
      SUM(s.amount) as total_revenue,
      p.price
    FROM products p
    LEFT JOIN sales s ON p.id = s.product_id ${dateFilterOnJoin}
    WHERE p.active = true
    GROUP BY p.id, p.name, p.price
  `;
  
  try {
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getRecentSales = async (req, res) => {
  const { startDate, endDate } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const offset = (page - 1) * limit;

  let params = [];
  let whereClause = '';

  if (startDate && endDate) {
    whereClause = 'WHERE sale_date BETWEEN $1 AND $2';
    params.push(startDate, endDate);
  }

  try {
    const totalResult = await db.query(`SELECT COUNT(*) FROM sales ${whereClause}`, params);
    const totalSales = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalSales / limit);

    const queryParams = [...params];
    queryParams.push(limit, offset);

    const salesQuery = `
      SELECT s.*, p.name as product_name 
      FROM sales s 
      LEFT JOIN products p ON s.product_id = p.id 
      ${whereClause}
      ORDER BY s.sale_date DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    const { rows } = await db.query(salesQuery, queryParams);

    res.json({
      sales: rows,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    handleError(res, error);
  }
};

exports.getActivityLogs = async (req, res) => {
  console.log('[getActivityLogs] Endpoint triggered.');
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const offset = (page - 1) * limit;
  console.log(`[getActivityLogs] Pagination: page=${page}, limit=${limit}, offset=${offset}`);

  try {
    const totalResult = await db.query('SELECT COUNT(*) FROM activity_logs');
    const totalLogs = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalLogs / limit);
    console.log(`[getActivityLogs] Found ${totalLogs} total logs.`);

    const logsResult = await db.query(
      'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    console.log(`[getActivityLogs] Sending ${logsResult.rows.length} logs for current page.`);

    res.json({
      logs: logsResult.rows,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('[getActivityLogs] Error fetching activity logs:', error);
    handleError(res, error);
  }
};
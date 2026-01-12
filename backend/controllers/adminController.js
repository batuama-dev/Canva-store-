// backend/controllers/adminController.js
const db = require('../config/database');

// Helper pour gérer les erreurs
const handleError = (res, error) => {
  console.error('--- DATABASE ERROR ---', error);
  res.status(500).json({ error: error.message });
};

exports.getSalesStats = async (req, res) => {
  const query = `
    SELECT 
      p.name as product_name,
      COUNT(s.id) as sales_count,
      SUM(s.amount) as total_revenue,
      p.price
    FROM products p
    LEFT JOIN sales s ON p.id = s.product_id
    WHERE p.active = true
    GROUP BY p.id, p.name, p.price
  `;
  
  try {
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getRecentSales = async (req, res) => {
  const query = `
    SELECT s.*, p.name as product_name 
    FROM sales s 
    LEFT JOIN products p ON s.product_id = p.id 
    ORDER BY s.sale_date DESC 
    LIMIT 10
  `;
  
  try {
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    handleError(res, error);
  }
};

exports.getActivityLogs = async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const offset = (page - 1) * limit;

  try {
    const totalResult = await db.query('SELECT COUNT(*) FROM activity_logs');
    const totalLogs = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalLogs / limit);

    const logsResult = await db.query(
      'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      logs: logsResult.rows,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    handleError(res, error);
  }
};
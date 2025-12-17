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
// backend/controllers/adminController.js
const db = require('../config/database');

exports.getSalesStats = (req, res) => {
  const query = `
    SELECT 
      p.name as product_name,
      COUNT(s.id) as sales_count,
      SUM(s.amount) as total_revenue,
      p.price
    FROM products p
    LEFT JOIN sales s ON p.id = s.product_id
    GROUP BY p.id
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getRecentSales = (req, res) => {
  db.query(`
    SELECT s.*, p.name as product_name 
    FROM sales s 
    LEFT JOIN products p ON s.product_id = p.id 
    ORDER BY s.sale_date DESC 
    LIMIT 10
  `, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
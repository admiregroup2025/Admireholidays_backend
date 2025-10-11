import express from 'express';

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working fine 🎉',
  });
});

export default router;
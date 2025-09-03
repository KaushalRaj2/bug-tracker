const express = require('express');
const {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
  addComment,
  getBugStats
} = require('../controllers/bugController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes (none for bugs - all require authentication)

// Protected routes
router.use(protect); // All bug routes require authentication

// Bug CRUD operations
router.route('/')
  .get(getBugs)                    // All authenticated users
  .post(createBug);                // All authenticated users can create bugs

router.get('/stats', getBugStats); // Statistics - all authenticated users

router.route('/:id')
  .get(getBug)                     // Get single bug
  .put(updateBug)                  // Update bug (role-based permissions in controller)
  .delete(authorize('admin'), deleteBug); // Only admins can delete bugs

// Comments
router.post('/:id/comments', addComment); // Add comment to bug

// Enhanced stats endpoint with proper aggregation
router.get('/stats', protect, async (req, res) => {
  try {
    console.log('📊 Calculating bug statistics...');
    
    // Get all bugs for aggregation
    const allBugs = await Bug.find({});
    console.log('🔍 Found bugs for stats:', allBugs.length);
    
    // Manual aggregation (more reliable than MongoDB aggregation)
    const stats = {
      total: allBugs.length,
      open: allBugs.filter(bug => bug.status === 'open').length,
      inProgress: allBugs.filter(bug => bug.status === 'in-progress').length,
      testing: allBugs.filter(bug => bug.status === 'testing').length,
      closed: allBugs.filter(bug => bug.status === 'closed').length,
      critical: allBugs.filter(bug => bug.priority === 'critical').length,
      high: allBugs.filter(bug => bug.priority === 'high').length,
      medium: allBugs.filter(bug => bug.priority === 'medium').length,
      low: allBugs.filter(bug => bug.priority === 'low').length
    };

    console.log('✅ Stats calculated:', stats);
    
    // Return in the format frontend expects
    const response = {
      overview: stats,
      byCategory: [
        { name: 'Frontend', count: allBugs.filter(bug => bug.category === 'frontend').length },
        { name: 'Backend', count: allBugs.filter(bug => bug.category === 'backend').length },
        { name: 'Database', count: allBugs.filter(bug => bug.category === 'database').length },
        { name: 'UI/UX', count: allBugs.filter(bug => bug.category === 'ui/ux').length }
      ]
    };

    console.log('📊 Sending response:', response);
    res.json(response);
    
  } catch (error) {
    console.error('❌ Stats calculation error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch stats', 
      error: error.message,
      // Fallback empty stats
      overview: {
        total: 0, open: 0, inProgress: 0, testing: 0, closed: 0,
        critical: 0, high: 0, medium: 0, low: 0
      },
      byCategory: []
    });
  }
});


module.exports = router;

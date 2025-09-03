const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDevelopers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get developers (accessible to all authenticated users for assignment)
router.get('/developers', getDevelopers);

// Admin-only routes
router.use(authorize('admin')); // All routes below require admin role

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;

const User = require('../models/User');
const Bug = require('../models/Bug');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Could not fetch users',
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin only)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's bug statistics
    const bugStats = await Bug.aggregate([
      {
        $facet: {
          reported: [
            { $match: { reportedBy: user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          assigned: [
            { $match: { assignedTo: user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    res.json({
      user,
      bugStats: bugStats[0]
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Could not fetch user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          message: 'Email is already in use'
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase();
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      message: 'Could not update user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has reported bugs
    const reportedBugs = await Bug.countDocuments({ reportedBy: req.params.id });
    const assignedBugs = await Bug.countDocuments({ assignedTo: req.params.id });

    if (reportedBugs > 0 || assignedBugs > 0) {
      return res.status(400).json({
        message: `Cannot delete user. User has ${reportedBugs} reported bugs and ${assignedBugs} assigned bugs. Please reassign or resolve these bugs first.`
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: 'Could not delete user',
      error: error.message
    });
  }
};

// @desc    Get developers for assignment
// @route   GET /api/users/developers
// @access  Private
const getDevelopers = async (req, res) => {
  try {
    const developers = await User.find({
      role: { $in: ['developer', 'admin'] },
      isActive: true
    }).select('name email role');

    res.json({ developers });

  } catch (error) {
    console.error('Get developers error:', error);
    res.status(500).json({
      message: 'Could not fetch developers',
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDevelopers
};

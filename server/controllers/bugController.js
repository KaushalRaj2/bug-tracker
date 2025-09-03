const Bug = require('../models/Bug');
const User = require('../models/User');

// @desc    Get all bugs
// @route   GET /api/bugs
// @access  Private
const getBugs = async (req, res) => {
  try {
    const { status, priority, assignedTo, reportedBy, category, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (reportedBy) filter.reportedBy = reportedBy;
    if (category) filter.category = category;
    
    // Role-based filtering
    if (req.user.role === 'reporter') {
      // Reporters can only see bugs they reported
      filter.reportedBy = req.user._id;
    } else if (req.user.role === 'developer') {
      // Developers can see bugs assigned to them or unassigned bugs
      filter.$or = [
        { assignedTo: req.user._id },
        { assignedTo: null },
        { reportedBy: req.user._id }
      ];
    }
    // Admins and testers can see all bugs (no additional filter)

    const bugs = await Bug.find(filter)
      .populate('reportedBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('comments.user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bug.countDocuments(filter);

    res.json({
      bugs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBugs: total
    });

  } catch (error) {
    console.error('Get bugs error:', error);
    res.status(500).json({
      message: 'Could not fetch bugs',
      error: error.message
    });
  }
};

// @desc    Get single bug
// @route   GET /api/bugs/:id
// @access  Private
const getBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('reportedBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('comments.user', 'name email role');

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    // Role-based access control
    if (req.user.role === 'reporter' && bug.reportedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Access denied. You can only view bugs you reported.' 
      });
    }

    res.json({ bug });

  } catch (error) {
    console.error('Get bug error:', error);
    res.status(500).json({
      message: 'Could not fetch bug',
      error: error.message
    });
  }
};

// @desc    Create new bug
// @route   POST /api/bugs
// @access  Private
const createBug = async (req, res) => {
  try {
    const { title, description, priority, category, severity, tags, estimatedTime, dueDate } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        message: 'Title and description are required'
      });
    }

    const bug = await Bug.create({
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'medium',
      category: category || 'other',
      severity: severity || 'minor',
      reportedBy: req.user._id,
      tags: tags || [],
      estimatedTime,
      dueDate
    });

    const populatedBug = await Bug.findById(bug._id)
      .populate('reportedBy', 'name email role');

    res.status(201).json({
      message: 'Bug created successfully',
      bug: populatedBug
    });

  } catch (error) {
    console.error('Create bug error:', error);
    res.status(500).json({
      message: 'Could not create bug',
      error: error.message
    });
  }
};

// @desc    Update bug
// @route   PUT /api/bugs/:id
// @access  Private
const updateBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    const { title, description, status, priority, category, severity, assignedTo, tags, estimatedTime, actualTime, dueDate } = req.body;

    // Role-based update permissions
    const userRole = req.user.role;
    const isReporter = bug.reportedBy.toString() === req.user._id.toString();
    const isAssigned = bug.assignedTo && bug.assignedTo.toString() === req.user._id.toString();

    // Reporters can only update their own bugs and limited fields
    if (userRole === 'reporter' && !isReporter) {
      return res.status(403).json({
        message: 'Access denied. You can only update bugs you reported.'
      });
    }

    // Developers can update assigned bugs
    if (userRole === 'developer' && !isAssigned && !isReporter) {
      return res.status(403).json({
        message: 'Access denied. You can only update bugs assigned to you or bugs you reported.'
      });
    }

    // Build update object based on role
    const updateData = {};

    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (tags) updateData.tags = tags;

    // Status updates (developers and admins can update, testers can reopen)
    if (status && (userRole === 'admin' || userRole === 'developer' || (userRole === 'tester' && status === 'reopened'))) {
      updateData.status = status;
    }

    // Priority, category, severity (admins, testers, and reporters on their own bugs)
    if (userRole === 'admin' || userRole === 'tester' || (userRole === 'reporter' && isReporter)) {
      if (priority) updateData.priority = priority;
      if (category) updateData.category = category;
      if (severity) updateData.severity = severity;
    }

    // Assignment (only admins and developers)
    if (assignedTo && (userRole === 'admin' || userRole === 'developer')) {
      // Validate assigned user exists and is a developer
      if (assignedTo !== 'null') {
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser || !['developer', 'admin'].includes(assignedUser.role)) {
          return res.status(400).json({
            message: 'Invalid assigned user. Must be a developer or admin.'
          });
        }
        updateData.assignedTo = assignedTo;
      } else {
        updateData.assignedTo = null;
      }
    }

    // Time tracking (developers and admins)
    if (userRole === 'admin' || userRole === 'developer') {
      if (estimatedTime !== undefined) updateData.estimatedTime = estimatedTime;
      if (actualTime !== undefined) updateData.actualTime = actualTime;
    }

    // Due date (admins and project managers)
    if (dueDate && userRole === 'admin') {
      updateData.dueDate = dueDate;
    }

    const updatedBug = await Bug.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email role')
     .populate('assignedTo', 'name email role');

    res.json({
      message: 'Bug updated successfully',
      bug: updatedBug
    });

  } catch (error) {
    console.error('Update bug error:', error);
    res.status(500).json({
      message: 'Could not update bug',
      error: error.message
    });
  }
};

// @desc    Delete bug
// @route   DELETE /api/bugs/:id  
// @access  Private (Admin only)
const deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    await Bug.findByIdAndDelete(req.params.id);

    res.json({ message: 'Bug deleted successfully' });

  } catch (error) {
    console.error('Delete bug error:', error);
    res.status(500).json({
      message: 'Could not delete bug',
      error: error.message
    });
  }
};

// @desc    Add comment to bug
// @route   POST /api/bugs/:id/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        message: 'Comment content is required'
      });
    }

    const bug = await Bug.findById(req.params.id);

    if (!bug) {
      return res.status(404).json({ message: 'Bug not found' });
    }

    // Role-based comment access
    const userRole = req.user.role;
    const isReporter = bug.reportedBy.toString() === req.user._id.toString();
    const isAssigned = bug.assignedTo && bug.assignedTo.toString() === req.user._id.toString();

    if (userRole === 'reporter' && !isReporter) {
      return res.status(403).json({
        message: 'Access denied. You can only comment on bugs you reported.'
      });
    }

    bug.comments.push({
      user: req.user._id,
      content: content.trim()
    });

    await bug.save();

    const updatedBug = await Bug.findById(req.params.id)
      .populate('comments.user', 'name email role');

    res.status(201).json({
      message: 'Comment added successfully',
      comments: updatedBug.comments
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      message: 'Could not add comment',
      error: error.message
    });
  }
};

// @desc    Get bug statistics
// @route   GET /api/bugs/stats
// @access  Private
const getBugStats = async (req, res) => {
  try {
    const stats = await Bug.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          testing: { $sum: { $cond: [{ $eq: ['$status', 'testing'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
        }
      }
    ]);

    const categoryStats = await Bug.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: stats[0] || {
        total: 0, open: 0, inProgress: 0, testing: 0, closed: 0,
        critical: 0, high: 0, medium: 0, low: 0
      },
      byCategory: categoryStats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Could not fetch statistics',
      error: error.message
    });
  }
};

module.exports = {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
  addComment,
  getBugStats
};

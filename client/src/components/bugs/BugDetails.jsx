import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import CommentSection from './CommentSection';
import { formatDateTime, formatBugId } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { bugService } from '../../services/bugService';
import ActivityTimeline from './ActivityTimeline';
import toast from 'react-hot-toast';

const BugDetails = ({ bugId, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBug();
  }, [bugId]);

  const loadBug = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bugService.getBug(bugId);
      setBug(response.bug);
    } catch (error) {
      setError(error.message || 'Failed to load bug details');
      toast.error('Failed to load bug details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      setCommentsLoading(true);
      await bugService.addComment(bugId, commentData);
      await loadBug(); // Reload to get updated comments
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
      throw error;
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleUpdateComment = async (commentId, updates) => {
    try {
      setCommentsLoading(true);
      await bugService.updateComment(bugId, commentId, updates);
      await loadBug(); // Reload to get updated comments
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error('Failed to update comment');
      throw error;
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setCommentsLoading(true);
      await bugService.deleteComment(bugId, commentId);
      await loadBug(); // Reload to get updated comments
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
      throw error;
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug? This action cannot be undone.')) {
      try {
        await bugService.deleteBug(bugId);
        toast.success('Bug deleted successfully');
        if (onDelete) {
          onDelete(bugId);
        } else {
          navigate('/bugs');
        }
      } catch (error) {
        toast.error('Failed to delete bug');
      }
    }
  };

  const canEdit = () => {
    return user && (
      user.role === 'admin' || 
      user._id === bug?.reportedBy?._id ||
      user._id === bug?.assignedTo?._id
    );
  };

  const canDelete = () => {
    return user && (
      user.role === 'admin' || 
      user._id === bug?.reportedBy?._id
    );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !bug) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bug Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'The bug you\'re looking for doesn\'t exist or has been deleted.'}
          </p>
          <Link to="/bugs">
            <Button>
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Bug List
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          to="/bugs"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Bugs
        </Link>
        
        {(canEdit() || canDelete()) && (
          <div className="flex space-x-2">
            {canEdit() && (
              <Link to={`/bugs/${bugId}/edit`}>
                <Button variant="outline" size="sm">
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
            )}
            
            {canDelete() && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Bug Details */}
      <Card>
        <Card.Header>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <span className="font-medium">{formatBugId(bug._id)}</span>
                <Badge variant={bug.priority}>{bug.priority}</Badge>
                <Badge variant={bug.status}>{bug.status?.replace('-', ' ')}</Badge>
              </div>
              <Card.Title className="text-2xl">{bug.title}</Card.Title>
            </div>
          </div>
        </Card.Header>

        <Card.Content>
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{bug.description}</p>
            </div>

            {/* Steps to Reproduce */}
            {bug.stepsToReproduce && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Steps to Reproduce</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{bug.stepsToReproduce}</p>
              </div>
            )}

            {/* Expected vs Actual Behavior */}
            {(bug.expectedBehavior || bug.actualBehavior) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bug.expectedBehavior && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Expected Behavior</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{bug.expectedBehavior}</p>
                  </div>
                )}
                
                {bug.actualBehavior && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Actual Behavior</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{bug.actualBehavior}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tags */}
            {bug.tags && bug.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <TagIcon className="h-4 w-4 mr-1" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {bug.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reported by</p>
                    <div className="flex items-center space-x-2">
                      <Avatar 
                        src={bug.reportedBy?.avatar} 
                        alt={bug.reportedBy?.name}
                        size="xs"
                      />
                      <span className="text-sm text-gray-600">
                        {bug.reportedBy?.name || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                {bug.assignedTo && (
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Assigned to</p>
                      <div className="flex items-center space-x-2">
                        <Avatar 
                          src={bug.assignedTo.avatar} 
                          alt={bug.assignedTo.name}
                          size="xs"
                        />
                        <span className="text-sm text-gray-600">
                          {bug.assignedTo.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">
                      {formatDateTime(bug.createdAt, true)}
                    </p>
                  </div>
                </div>

                {bug.updatedAt && bug.updatedAt !== bug.createdAt && (
                  <div className="flex items-center space-x-3">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last updated</p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(bug.updatedAt, true)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Comments Section */}
      <Card>
        <Card.Content>
          <CommentSection
            comments={bug.comments || []}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            loading={commentsLoading}
          />
        </Card.Content>
      </Card>

      {/* Activity Timeline */}
<Card>
  <Card.Content>
    <ActivityTimeline
      activities={bug.activities || []}
      loading={commentsLoading}
    />
  </Card.Content>
</Card>
    </div>
  );
};

export default BugDetails;

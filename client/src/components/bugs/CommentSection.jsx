import React, { useState } from 'react';
import { 
  PaperAirplaneIcon,
  TrashIcon,
  PencilIcon 
} from '@heroicons/react/24/outline';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatTimeAgo } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const CommentSection = ({ 
  comments = [], 
  onAddComment, 
  onUpdateComment, 
  onDeleteComment,
  loading = false 
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await onAddComment({
        text: newComment.trim(),
        author: user._id
      });
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await onUpdateComment(commentId, { text: editText.trim() });
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await onDeleteComment(commentId);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const canEditComment = (comment) => {
    return user && (user._id === comment.author._id || user.role === 'admin');
  };

  const canDeleteComment = (comment) => {
    return user && (user._id === comment.author._id || user.role === 'admin');
  };

  return (
    <div className="space-y-6">
      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>

        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Avatar
                    src={comment.author?.avatar}
                    alt={comment.author?.name}
                    size="sm"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {comment.author?.name || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                      {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                        <span className="text-xs text-gray-400">(edited)</span>
                      )}
                    </div>

                    {editingComment === comment._id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          disabled={loading}
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateComment(comment._id)}
                            loading={loading}
                            disabled={loading || !editText.trim()}
                          >
                            Update
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {comment.text}
                        </p>
                        
                        {(canEditComment(comment) || canDeleteComment(comment)) && (
                          <div className="flex space-x-2 mt-2">
                            {canEditComment(comment) && (
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="text-sm text-gray-500 hover:text-blue-600 flex items-center space-x-1"
                                disabled={loading}
                              >
                                <PencilIcon className="h-3 w-3" />
                                <span>Edit</span>
                              </button>
                            )}
                            
                            {canDeleteComment(comment) && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-sm text-gray-500 hover:text-red-600 flex items-center space-x-1"
                                disabled={loading}
                              >
                                <TrashIcon className="h-3 w-3" />
                                <span>Delete</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      <div className="border-t border-gray-200 pt-6">
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a Comment
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
              disabled={loading}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !newComment.trim()}
              className="flex items-center space-x-2"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>Post Comment</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;

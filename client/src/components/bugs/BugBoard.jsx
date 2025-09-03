import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import { PlusIcon, BugAntIcon } from '@heroicons/react/24/outline';
import BugCard from './BugCard';
import Button from '../ui/Button';
import { BUG_STATUS } from '../../utils/constants';
import { useBugs } from '../../context/BugContext';
import { useAuth } from '../../context/AuthContext';

const BugBoard = ({ bugs = [], onUpdateBug, onCreateBug }) => {
  const { user } = useAuth();
  const [dragDisabled, setDragDisabled] = useState(false);

  const columns = [
    {
      id: BUG_STATUS.OPEN,
      title: 'Open',
      color: 'blue'
    },
    {
      id: BUG_STATUS.IN_PROGRESS,
      title: 'In Progress',
      color: 'yellow'
    },
    {
      id: BUG_STATUS.TESTING,
      title: 'Testing',
      color: 'purple'
    },
    {
      id: BUG_STATUS.CLOSED,
      title: 'Closed',
      color: 'green'
    }
  ];

  // Group bugs by status
  const groupedBugs = useMemo(() => {
    const groups = {};
    columns.forEach(column => {
      groups[column.id] = bugs.filter(bug => bug.status === column.id);
    });
    return groups;
  }, [bugs]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const bugId = draggableId;
    const newStatus = destination.droppableId;

    // Check permissions
    const bug = bugs.find(b => b._id === bugId);
    const canUpdate = user && (
      user.role === 'admin' ||
      user._id === bug?.assignedTo?._id ||
      (user.role === 'tester' && newStatus === BUG_STATUS.TESTING)
    );

    if (!canUpdate) {
      console.warn('User does not have permission to update bug status');
      return;
    }

    try {
      setDragDisabled(true);
      await onUpdateBug(bugId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update bug status:', error);
    } finally {
      setDragDisabled(false);
    }
  };

  const canDragBug = (bug) => {
    return user && (
      user.role === 'admin' ||
      user._id === bug.assignedTo?._id ||
      user.role === 'tester'
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col h-full">
              {/* Column Header */}
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    column.color === 'blue' ? 'bg-blue-500' :
                    column.color === 'yellow' ? 'bg-yellow-500' :
                    column.color === 'purple' ? 'bg-purple-500' :
                    'bg-green-500'
                  }`} />
                  <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {groupedBugs[column.id]?.length || 0}
                  </span>
                </div>

                {column.id === BUG_STATUS.OPEN && onCreateBug && (
                  <Button 
                    size="xs" 
                    variant="ghost"
                    onClick={onCreateBug}
                    className="p-1"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Column Content */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver 
                        ? 'bg-blue-50 ring-2 ring-blue-200' 
                        : 'bg-gray-50'
                    } min-h-96 max-h-screen overflow-y-auto`}
                  >
                    {groupedBugs[column.id]?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                        <BugAntIcon className="h-8 w-8 mb-2" />
                        <span className="text-sm">No {column.title.toLowerCase()} bugs</span>
                      </div>
                    ) : (
                      groupedBugs[column.id]?.map((bug, index) => (
                        <Draggable
                          key={bug._id}
                          draggableId={bug._id}
                          index={index}
                          isDragDisabled={dragDisabled || !canDragBug(bug)}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transform transition-transform ${
                                snapshot.isDragging 
                                  ? 'rotate-2 scale-105 shadow-lg' 
                                  : 'rotate-0 scale-100'
                              }`}
                            >
                              <BugCard
                                bug={bug}
                                className={`mb-3 ${
                                  !canDragBug(bug) 
                                    ? 'opacity-75 cursor-not-allowed' 
                                    : 'cursor-grab active:cursor-grabbing'
                                }`}
                                showActions={false}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default BugBoard;

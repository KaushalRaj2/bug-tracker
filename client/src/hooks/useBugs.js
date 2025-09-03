import { useContext } from 'react';
import { BugContext } from '../context/BugContext';

export const useBugs = () => {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugs must be used within a BugProvider');
  }
  return context;
};

export default useBugs;

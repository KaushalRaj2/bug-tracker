export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateBugForm = (data) => {
  const errors = {};
  
  if (!validateRequired(data.title)) {
    errors.title = 'Title is required';
  }
  
  if (!validateRequired(data.description)) {
    errors.description = 'Description is required';
  }
  
  if (!validateRequired(data.priority)) {
    errors.priority = 'Priority is required';
  }
  
  if (!validateRequired(data.category)) {
    errors.category = 'Category is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateUserForm = (data) => {
  const errors = {};
  
  if (!validateRequired(data.name)) {
    errors.name = 'Name is required';
  }
  
  if (!validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }
  
  if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation (at least 6 chars, 1 number, 1 special char recommended)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;

// URL validation
const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

// Phone number validation (basic)
const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;

export const validateEmail = (email) => {
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateStrongPassword = (password) => {
  return passwordRegex.test(password);
};

export const validateUrl = (url) => {
  return urlRegex.test(url);
};

export const validatePhone = (phone) => {
  return phoneRegex.test(phone);
};

export const validateProductData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push('Product description is required');
  }

  if (!data.price || data.price <= 0) {
    errors.push('Product price must be greater than 0');
  }

  if (!data.category) {
    errors.push('Product category is required');
  }

  if (!data.image) {
    errors.push('Product image is required');
  }

  if (typeof data.stock !== 'number' || data.stock < 0) {
    errors.push('Product stock must be a non-negative number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateOrderData = (data) => {
  const errors = [];

  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Order must contain at least one item');
  }

  if (!data.shippingAddress) {
    errors.push('Shipping address is required');
  } else {
    const { street, city, state, zipCode, country } = data.shippingAddress;
    if (!street || !city || !state || !zipCode || !country) {
      errors.push('All shipping address fields are required');
    }
  }

  if (!data.paymentMethod) {
    errors.push('Payment method is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUserData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  validateEmail,
  validatePassword,
  validateStrongPassword,
  validateUrl,
  validatePhone,
  validateProductData,
  validateOrderData,
  validateUserData
};

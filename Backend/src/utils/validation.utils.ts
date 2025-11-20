export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateCustomerRegistration = (
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required");
  } else if (!validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (
    !data.first_name ||
    typeof data.first_name !== "string" ||
    data.first_name.trim().length < 2
  ) {
    errors.push("First name must be at least 2 characters long");
  }

  if (
    !data.last_name ||
    typeof data.last_name !== "string" ||
    data.last_name.trim().length < 2
  ) {
    errors.push("Last name must be at least 2 characters long");
  }

  if (!data.password || typeof data.password !== "string") {
    errors.push("Password is required");
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
  }

  if (data.phone && typeof data.phone !== "string") {
    errors.push("Phone must be a string");
  }

  if (data.address && typeof data.address !== "string") {
    errors.push("Address must be a string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateCustomerLogin = (
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required");
  } else if (!validateEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (!data.password || typeof data.password !== "string") {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateCustomerProfile = (
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (
    data.first_name &&
    (typeof data.first_name !== "string" || data.first_name.trim().length < 2)
  ) {
    errors.push("First name must be at least 2 characters long");
  }

  if (
    data.last_name &&
    (typeof data.last_name !== "string" || data.last_name.trim().length < 2)
  ) {
    errors.push("Last name must be at least 2 characters long");
  }

  if (data.phone && typeof data.phone !== "string") {
    errors.push("Phone must be a string");
  }

  if (data.address && typeof data.address !== "string") {
    errors.push("Address must be a string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

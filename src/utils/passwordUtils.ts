import { PasswordStrength } from '../types/subscription';

export const checkPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return PasswordStrength.WEAK;
  
  // Check for minimum length
  if (password.length < 8) return PasswordStrength.WEAK;
  
  let score = 0;
  
  // Check for lowercase letters
  if (/[a-z]/.test(password)) score += 1;
  
  // Check for uppercase letters
  if (/[A-Z]/.test(password)) score += 1;
  
  // Check for numbers
  if (/[0-9]/.test(password)) score += 1;
  
  // Check for special characters
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  // Determine strength based on score
  if (score === 4 && password.length >= 12) return PasswordStrength.STRONG;
  if (score >= 3) return PasswordStrength.MEDIUM;
  
  return PasswordStrength.WEAK;
};

export const getPasswordStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.STRONG:
      return 'bg-green-500';
    case PasswordStrength.MEDIUM:
      return 'bg-yellow-500';
    case PasswordStrength.WEAK:
    default:
      return 'bg-red-500';
  }
};

export const getPasswordStrengthText = (strength: PasswordStrength): string => {
  switch (strength) {
    case PasswordStrength.STRONG:
      return 'Strong';
    case PasswordStrength.MEDIUM:
      return 'Medium';
    case PasswordStrength.WEAK:
    default:
      return 'Weak';
  }
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePasswordMatch = (password: string, confirmation: string): boolean => {
  return password === confirmation;
}; 
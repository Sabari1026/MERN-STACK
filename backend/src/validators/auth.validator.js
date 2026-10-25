/**
 * Authentication and User Input Validators for HireConnect
 * Built with Zod to enforce schema integrity and role protection.
 */

const { z } = require('zod');

// Normalize role: frontend allows 'employee' which maps to 'candidate'
const roleSchema = z
  .string()
  .trim()
  .transform((val) => (val.toLowerCase() === 'employee' ? 'candidate' : val.toLowerCase()))
  .refine(
    (val) => val !== 'admin',
    {
      message: 'Public registration for administrator role is strictly forbidden.'
    }
  )
  .refine(
    (val) => ['candidate', 'recruiter'].includes(val),
    {
      message: 'Role must be either candidate or recruiter.'
    }
  );

// Registration schema
const registerSchema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters'),

  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z0-9!@#$%^&*])/,
      'Password must contain at least one letter and one number or symbol'
    ),

  role: roleSchema.default('candidate'),

  rememberMe: z.boolean().optional().default(false),

  companyName: z.string().trim().optional(),
  company: z.string().trim().optional(),
  title: z.string().trim().optional(),
  jobTitle: z.string().trim().optional(),
  website: z.string().trim().optional()
});

// Login schema
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),

  // Role is optional on login, but if provided allows role-tab validation
  role: z
    .string()
    .trim()
    .transform((val) => (val.toLowerCase() === 'employee' ? 'candidate' : val.toLowerCase()))
    .refine((val) => ['candidate', 'recruiter', 'admin'].includes(val), {
      message: 'Invalid role specified'
    })
    .optional(),

  rememberMe: z.boolean().optional().default(false)
});

// Password recovery schemas
const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address')
});

const resetPasswordSchema = z.object({
  token: z
    .string({ required_error: 'Password reset token is required' })
    .trim()
    .min(10, 'Invalid reset token format'),

  password: z
    .string({ required_error: 'New password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z0-9!@#$%^&*])/,
      'Password must contain at least one letter and one number or symbol'
    )
});

// Email verification schemas
const verifyEmailSchema = z.object({
  token: z
    .string({ required_error: 'Verification token is required' })
    .trim()
    .min(10, 'Invalid verification token format')
});

const resendVerificationSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .trim()
    .toLowerCase()
    .email('Please provide a valid email address')
});

// Refresh token schema
const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().optional()
});

// Google OAuth token schema
const googleAuthSchema = z.object({
  credential: z.string().optional(),
  idToken: z.string().optional(),
  role: roleSchema.default('candidate')
}).refine((data) => data.credential || data.idToken, {
  message: 'Google credential or idToken is required'
});

// Password change schema
const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required' })
    .min(1, 'Current password is required'),

  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, 'New password must be at least 8 characters long')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z0-9!@#$%^&*])/,
      'New password must contain at least one letter and one number or symbol'
    )
});

// Delete account schema
const deleteAccountSchema = z.object({
  password: z
    .string({ required_error: 'Account password is required to confirm deletion' })
    .min(1, 'Password is required')
});

/**
 * Middleware factory for validating request body with a Zod schema
 * @param {import('zod').ZodSchema} schema
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: formattedErrors[0]?.message || 'Invalid request data',
          details: formattedErrors
        }
      });
    }
    req.body = result.data;
    next();
  };
}

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  deleteAccountSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  refreshTokenSchema,
  googleAuthSchema,
  validateBody
};

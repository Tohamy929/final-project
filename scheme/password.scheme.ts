import * as zod from 'zod';

export const forgotPasswordScheme = zod.object({
  email: zod.string().nonempty('this field is required').email('this email is not valid'),
});

export type ForgotPasswordSchemeValidation = zod.infer<typeof forgotPasswordScheme>;

export const resetPasswordScheme = zod.object({
  newPassword: zod.string().nonempty('this field is required').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/, 'Password must contain uppercase, lowercase, number and special character'),
  confirmPassword: zod.string().nonempty('this field is required'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordSchemeValidation = zod.infer<typeof resetPasswordScheme>;

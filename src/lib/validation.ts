import { z } from 'zod'

export const signupSchema = z.object({
  username: z.string().min(2).max(32),
  email: z.string().email(),
  phone: z.string().min(8),
  pass: z.string().min(8).max(16),
})

export const signinSchema = z.object({
  email: z.string().email(),
  pass: z.string().min(8).max(16),
})

export const forgotPassSchema = z.object({
  email: z.string().email(),
})

export const recAccSchema = z
  .object({
    newPass: z.string().min(8).max(16),
    confirmPass: z.string().min(8).max(16),
  })
  .refine(data => data.newPass === data.confirmPass, {
    message: 'Confirm password must be the same as new password',
    path: ['confirmPass'],
  })

export const addHouseSchema = z.object({
  label: z.string().min(4),
  body: z.string().min(16).max(1024),
  location: z.string().min(4),
  price: z.string().min(1),
})

export const editHouseSchema = z.object({
  label: z.string().min(4),
  body: z.string().min(16).max(1024),
  location: z.string().min(4),
  price: z.string().min(1),
})

export const feedbackSchema = z.object({
  comment: z.string().min(4).max(256),
})

export const editProfileSchema = z.object({
  username: z.string().min(2).max(32),
  phone: z.string().min(8),
})

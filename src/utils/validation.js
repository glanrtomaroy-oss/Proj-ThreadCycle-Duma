import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Sign up validation schema
export const signUpSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters'),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password confirmation required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Scrap estimation validation schema
export const scrapEstimationSchema = z.object({
    fabricType: z.string().min(1, 'Fabric type is required'),
    originalLength: z.number().positive('Original length must be positive'),
    usedLength: z.number().positive('Used length must be positive'),
}).refine((data) => data.usedLength <= data.originalLength, {
    message: "Used length cannot be greater than original length",
    path: ["usedLength"],
});

// Thrift shop validation schema  
export const thriftShopSchema = z.object({
    name: z.string().min(1, 'Shop name is required'),
    address: z.string().min(1, 'Address is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    phone: z.string().optional(),
    openingHours: z.string().optional(),
});

export function validateForm(data, schema) {
    try {
        const result = schema.parse(data);
        return { success: true, data: result };
    } catch (error) {
        const errors = {};
        error.errors?.forEach((err) => {
            const path = err.path.join('.');
            errors[path] = err.message;
        });
        return { success: false, errors };
    }
}

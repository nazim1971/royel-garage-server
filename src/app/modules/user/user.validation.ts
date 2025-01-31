import { z } from "zod";

const userCreationSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2)
		.max(20)
		,
	email: z.string().email(),
	password: z
		.string()
		.trim()
		.min(6, { message: 'Password must be at least 6 characters long!' })
		.max(20, { message: 'Password cannot be more than 20 characters!' }),
	role: z.enum(['customer', 'admin']).default('customer'),
	isBlocked: z.boolean().optional().default(false),
});

/** User Validation Schema */
export const UserValidation = { userCreationSchema };
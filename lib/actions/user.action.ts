'use server';

import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserProfileSchema,
  updateUserSchema,
} from '../validator';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { ShippingAddress } from '@/types';
import z from 'zod';
import { PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';

// Sign in the user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);

    return {
      success: true,
      message: 'Signed in successfully',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: 'Invalid email or password',
    };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return {
      success: true,
      message: 'User registered successfully',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get user by the ID
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    var currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: 'Shipping address updated successfully',
      user: currentUser,
    };
  } catch (error) {
    console.error('Error updating shipping address:', error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update user's payment method
export async function updateUserPaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? (session?.user.id as string) : '-1';
    const paymentMethod = { type: data.type };

    if (userId === '-1') {
      throw new Error('User not found');
    }

    // Validate payment method
    // paymentMethodSchema.parse(paymentMethod);

    // Update the user's payment method in the database
    await prisma.user.update({
      where: { id: userId },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User's payment method updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update user profile
export async function updateUserProfile(data: { name: string; email: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Validate the input data
    const updatedData = updateUserProfileSchema.parse(data);

    // Update the user's profile in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: updatedData.name,
      },
    });

    return {
      success: true,
      message: 'User profile updated successfully',
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const where: any = {};

  if (query) {
    where.name = {
      contains: query,
      mode: 'insensitive',
    };
  }

  const data = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    where,
  });

  const dataCount = await prisma.user.count();
  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(userId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User create successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: await formatError(error),
    };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

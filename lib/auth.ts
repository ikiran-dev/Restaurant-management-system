import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

const SESSION_TOKEN = 'auth_token';
const SESSION_DURATION = 1* 24 * 60 * 60 * 1000; // 1days

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!verifyPassword(password, user.password)) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_TOKEN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_TOKEN);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_TOKEN)?.value;

  if (!token) {
    return null;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: token.split('_')[0] || '',
      },
    });
    return user || null;
  } catch {
    return null;
  }
}

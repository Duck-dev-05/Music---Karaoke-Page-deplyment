import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { nickname } = await req.json();

    if (!nickname || nickname.length < 3) {
      return NextResponse.json(
        { message: 'Nickname must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Check if nickname is already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        name: nickname,
        email: { not: session.user.email }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'This nickname is already taken' },
        { status: 400 }
      );
    }

    // Update user's nickname
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: nickname },
    });

    return NextResponse.json(
      { message: 'Nickname updated successfully', user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Nickname update error:', error);
    return NextResponse.json(
      { message: 'Error updating nickname' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

import { prisma } from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    // In a real app, we would require auth:
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    // For prototype purposes, if no session, we will mock a user ID so testing works
    const userId = session?.user?.id || 'mock_user_123';

    // Parse the giant formData object from the frontend
    const body = await req.json();

    // We must have at least a category, title, and price
    if (!body.category || !body.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract core fields for the Ad table
    const coreData = {
      userId,
      category: body.category,
      title: body.title,
      price: parseFloat(body.price) || 0,
      description: body.description || '',
      status: 'ACTIVE',
    };

    // Extract ALL other fields into a JSON metadata object
    // We omit the core fields so we don't duplicate data
    const metadataDetails = { ...body };
    delete metadataDetails.category;
    delete metadataDetails.title;
    delete metadataDetails.price;
    delete metadataDetails.description;

    // Create the Ad and AdMetadata in a single Prisma transaction
    const newAd = await prisma.ad.create({
      data: {
        ...coreData,
        metadata: {
          create: {
            details: JSON.stringify(metadataDetails)
          }
        }
      },
      include: {
        metadata: true
      }
    });

    return NextResponse.json({ success: true, ad: newAd }, { status: 201 });

  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json({ error: 'Failed to create ad' }, { status: 500 });
  }
}

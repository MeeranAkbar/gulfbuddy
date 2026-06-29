const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const users = [
  { id: 'usr_1', email: 'agent1@example.com', name: 'Elite Real Estate', plan: 'ELITE' },
  { id: 'usr_2', email: 'agent2@example.com', name: 'Premium Homes', plan: 'PREMIUM' },
  { id: 'usr_3', email: 'agent3@example.com', name: 'Dubai Property Experts', plan: 'PRO' },
];

const mockProperties = [
  {
    title: 'Luxury 4-Bed Villa with Private Pool',
    price: 6500000,
    description: 'Stunning modern villa with an upgraded interior, private pool, and landscaped garden.',
    meta: {
      marketMode: 'long_term',
      purpose: 'sale',
      propertyType: 'Villa',
      emirate: 'dubai',
      area: 'Dubai Hills Estate',
      bedrooms: 4,
      bathrooms: 5,
      sizeSqft: 4500,
      furnishingStatus: 'unfurnished',
      completionStatus: 'ready',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'
    }
  },
  {
    title: 'Upgraded Marina Apartment with Sea View',
    price: 3200000,
    description: 'Fully upgraded high-floor apartment offering panoramic sea views.',
    meta: {
      marketMode: 'long_term',
      purpose: 'sale',
      propertyType: 'Apartment',
      emirate: 'dubai',
      area: 'Dubai Marina',
      bedrooms: 2,
      bathrooms: 3,
      sizeSqft: 1400,
      furnishingStatus: 'furnished',
      completionStatus: 'ready',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'
    }
  },
  {
    title: 'Exclusive Palm Jumeirah Signature Villa',
    price: 45000000,
    description: 'The epitome of luxury living on the Palm Jumeirah with private beach access.',
    meta: {
      marketMode: 'long_term',
      purpose: 'sale',
      propertyType: 'Villa',
      emirate: 'dubai',
      area: 'Palm Jumeirah',
      bedrooms: 6,
      bathrooms: 7,
      sizeSqft: 12000,
      furnishingStatus: 'furnished',
      completionStatus: 'ready',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
    }
  },
  {
    title: 'Modern Downtown Studio with Burj Views',
    price: 180000, // Rent
    description: 'Brand new studio right in the heart of Downtown Dubai.',
    meta: {
      marketMode: 'long_term',
      purpose: 'rent',
      rentFrequency: 'yearly',
      propertyType: 'Apartment',
      emirate: 'dubai',
      area: 'Downtown Dubai',
      bedrooms: 0,
      bathrooms: 1,
      sizeSqft: 600,
      furnishingStatus: 'furnished',
      completionStatus: 'ready',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop'
    }
  },
  {
    title: 'Spacious 3-Bed Townhouse in Arabella',
    price: 2500000,
    description: 'Perfect family home located in the green community of Mudon.',
    meta: {
      marketMode: 'long_term',
      purpose: 'sale',
      propertyType: 'Townhouse',
      emirate: 'dubai',
      area: 'Mudon',
      bedrooms: 3,
      bathrooms: 4,
      sizeSqft: 2000,
      furnishingStatus: 'unfurnished',
      completionStatus: 'ready',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
    }
  },
  {
    title: 'Brand New 1-Bed in JVC',
    price: 85000, // Rent
    description: 'Affordable modern living in Jumeirah Village Circle.',
    meta: {
      marketMode: 'long_term',
      purpose: 'rent',
      rentFrequency: 'yearly',
      propertyType: 'Apartment',
      emirate: 'dubai',
      area: 'Jumeirah Village Circle (JVC)',
      bedrooms: 1,
      bathrooms: 2,
      sizeSqft: 850,
      furnishingStatus: 'unfurnished',
      completionStatus: 'ready',
      imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop'
    }
  },
  {
    title: 'Ultra-Luxury Penthouse in DIFC',
    price: 25000000,
    description: 'Incredible full-floor penthouse with stunning skyline views.',
    meta: {
      marketMode: 'long_term',
      purpose: 'sale',
      propertyType: 'Penthouse',
      emirate: 'dubai',
      area: 'DIFC',
      bedrooms: 5,
      bathrooms: 6,
      sizeSqft: 8000,
      furnishingStatus: 'unfurnished',
      completionStatus: 'ready',
      imageUrl: 'https://images.unsplash.com/photo-1430285561322-780c604615c5?q=80&w=2070&auto=format&fit=crop'
    }
  },
  {
    title: 'Cozy 2-Bed in The Greens',
    price: 160000, // Rent
    description: 'Bright and airy apartment looking over the central courtyard pool.',
    meta: {
      marketMode: 'long_term',
      purpose: 'rent',
      rentFrequency: 'yearly',
      propertyType: 'Apartment',
      emirate: 'dubai',
      area: 'The Greens',
      bedrooms: 2,
      bathrooms: 2,
      sizeSqft: 1200,
      furnishingStatus: 'unfurnished',
      completionStatus: 'ready',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'
    }
  },
  {
    title: 'Beachfront 3-Bed Apartment at Emaar Beachfront',
    price: 7500000,
    description: 'Live by the sea in this exclusive private island community.',
    meta: {
      marketMode: 'long_term',
      purpose: 'sale',
      propertyType: 'Apartment',
      emirate: 'dubai',
      area: 'Emaar Beachfront',
      bedrooms: 3,
      bathrooms: 4,
      sizeSqft: 1900,
      furnishingStatus: 'unfurnished',
      completionStatus: 'ready',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'
    }
  },
  {
    title: 'Massive Mansion in Emirates Hills',
    price: 95000000,
    description: 'The absolute pinnacle of Dubai real estate. Golf course views.',
    meta: {
      marketMode: 'long_term',
      purpose: 'sale',
      propertyType: 'Villa',
      emirate: 'dubai',
      area: 'Emirates Hills',
      bedrooms: 8,
      bathrooms: 10,
      sizeSqft: 25000,
      furnishingStatus: 'furnished',
      completionStatus: 'ready',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
    }
  }
];

async function main() {
  console.log('Seeding properties...');
  
  // Upsert users
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u
    });
  }

  // Create ads
  for (let i = 0; i < mockProperties.length; i++) {
    const prop = mockProperties[i];
    const user = users[i % users.length];
    
    // Find a real user from DB
    const dbUser = await prisma.user.findUnique({ where: { email: user.email }});
    
    const ad = await prisma.ad.create({
      data: {
        userId: dbUser.id,
        category: 'property',
        title: prop.title,
        price: prop.price,
        description: prop.description,
        status: 'ACTIVE',
        metadata: {
          create: {
            details: JSON.stringify(prop.meta)
          }
        }
      }
    });
    console.log(`Created ad: ${ad.title}`);
  }
  
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

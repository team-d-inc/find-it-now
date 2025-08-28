import { PrismaClient, Role, ApprovalStatus, ProfileStatus } from '../src/generated/prisma';

const prisma = new PrismaClient();

const categoriesData = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Jewelry' },
  { id: '4', name: 'Wallets' },
  { id: '5', name: 'Keys' },
  { id: '6', name: 'Documents' },
  { id: '7', name: 'Bags' },
  { id: '8', name: 'Glasses' },
  { id: '9', name: 'Books' },
  { id: '10', name: 'Umbrellas' },
  { id: '11', name: 'Toys' },
  { id: '12', name: 'Sports Equipment' },
  { id: '99', name: 'Other' },
];

const orgSamples = {
  name: 'Cornerstone Community College',
  email: 'info@ciccc.ca',
  phone: '604-620-1111',
  address: '978 Granville St',
  city: 'Vancouver',
  state: 'BC',
  zipCode: 'V6Z 1L2',
  country: 'Canada',
  operatingHours: 'Mon-Fri 9am-5pm',
  isActive: true,
  approvalStatus: ApprovalStatus.APPROVED,
};

const profileSamples = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@ciccc.ca',
    role: Role.ADMIN,
    supaUserId: 'e4225baa-3799-460f-8b9f-eafae447e568',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@ciccc.ca',
    role: Role.STAFF,
    supaUserId: 'ee41d871-f65f-44ca-8653-0f9ad806ca28',
  },
];

async function main() {
  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
      },
    });
  }

  const organization = await prisma.organization.create({
    data: {
      ...orgSamples,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const profiles = [];
  for (let i = 0; i < profileSamples.length; i++) {
    const p = profileSamples[i];
    const created = await prisma.profile.create({
      data: {
        organizationId: organization.id,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        role: p.role,
        status: ProfileStatus.ACTIVE,
        supaUserId: p.supaUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    profiles.push(created);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

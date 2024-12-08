import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';

// Create MongoDB client
const mongoClient = new MongoClient(process.env.DATABASE_URL, {
  authSource: '$external',
  authMechanism: 'MONGODB-X509',
  tls: true,
  tlsCertificateKeyFile: process.env.MONGODB_CERT_PATH,
});

// Create Prisma client
const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoClient.connect();
    console.log('MongoDB connected successfully.');

    console.log('Testing Prisma queries...');
    // Run a test query for posts
    const posts = await prisma.post.findMany({});
    console.log('Posts:', posts);

    // Run a test query for experiences
    const experience = await prisma.experience.findUnique({
      where: { id: 'example-id' }, // Replace with an actual ID from your database
    });
    console.log('Experience:', experience);

    console.log('Database test completed successfully!');
  } catch (error) {
    console.error('Error during database test:', error);
  } finally {
    console.log('Closing database connections...');
    await mongoClient.close();
    await prisma.$disconnect();
    console.log('Database connections closed.');
  }
}

testDatabase();

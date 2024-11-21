import { PrismaClient } from '@prisma/client'
import { ObjectId } from 'mongodb'

const prisma = new PrismaClient()

async function testMongoQuery() {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('Successfully connected to the database')

    // Test query with a sample ObjectId
    const sampleId = new ObjectId().toString()
    console.log(`Testing query with sample ID: ${sampleId}`)

    const post = await prisma.post.findUnique({
      where: { id: sampleId },
    })

    console.log('Query result:', post)

    if (!post) {
      console.log('No post found with the given ID. This is expected for a random ID.')
      
      // Fetch a real post ID from the database
      const firstPost = await prisma.post.findFirst()
      if (firstPost) {
        console.log(`Found a real post with ID: ${firstPost.id}`)
        
        // Now query with this real ID
        const realPost = await prisma.post.findUnique({
          where: { id: firstPost.id },
        })
        
        console.log('Query result with real ID:', realPost)
      } else {
        console.log('No posts found in the database.')
      }
    }
  } catch (error) {
    console.error('Error occurred:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testMongoQuery()
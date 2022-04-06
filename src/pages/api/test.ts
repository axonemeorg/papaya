import { PrismaClient } from '@prisma/client'

const client = new PrismaClient()

export default async (request, response) => {
    const users = await client.user.findMany()
    response.json(users)
}

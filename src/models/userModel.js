const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserModel {
  async createUser(data) {
    return await prisma.user.create({ data });
  }

  async findUserByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }
}

module.exports = new UserModel();

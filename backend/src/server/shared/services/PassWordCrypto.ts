import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const PassWordCrypto = {
  encrypt: (password: string): string => {
    // Usar número ou variável de ambiente convertida para número
    const saltRounds = parseInt(
      process.env.SALT_ROUNDS || SALT_ROUNDS.toString(),
      10
    );
    return bcrypt.hashSync(password, saltRounds);
  },

  verifyPassword: async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
  },
};

import bcrypt from 'bcryptjs';

export async function getHashedPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

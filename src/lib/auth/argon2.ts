import { hash, verify } from "argon2";

const PASSWORD_SALT = process.env.PASSWORD_SALT;

if (!PASSWORD_SALT) {
  throw new Error("PASSWORD_SALT is not defined");
}

export const hashPassword = (plaintextPassword: string) => {
  return hash(plaintextPassword, {
    salt: Buffer.from(PASSWORD_SALT),
  });
};

export const doesPasswordMatchHash = async (
  hashedPassword: string,
  plaintextPassword: string
): Promise<boolean> => {
  return verify(hashedPassword, plaintextPassword);
};

import bcrypt from "bcrypt";

const saltRounds = 12;

const makeHash = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const checkHash = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { makeHash, checkHash };

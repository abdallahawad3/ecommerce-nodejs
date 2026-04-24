import jwt from "jsonwebtoken";
const createToken = (userId: string) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is missing");
  }

  const token = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE || "7d",
    } as jwt.SignOptions,
  );

  return token;
};

export default createToken;

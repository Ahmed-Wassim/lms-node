import "dotenv/config";

export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
export const JWT_EXPIRES_IN = "1d";

export const config = {
    JWT_SECRET: process.env.JWT_SECRET || "default-secret",
    TOKEN_EXPIRATION: "1h",
};
if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
    throw new Error('Missing required environment variables: JWT_SECRET or DATABASE_URL');
}

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
};

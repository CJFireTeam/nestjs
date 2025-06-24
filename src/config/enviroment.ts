export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT ?? '5432', 10),
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_USER: process.env.DB_USER, // 👈 cambia a DB_USER para que coincida
  DB_NAME: process.env.DB_NAME || 'default_db',
  FRONT_URL: process.env.FRONT_URL,
  BACK_URL: process.env.BACK_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION
});
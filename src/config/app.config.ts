export default () => ({
  JWTSecret: process.env.JWT_SECRET,
  mongo_url: process.env.MONGODB_URI,
  accessTokenExpiresIn: '1d',
});

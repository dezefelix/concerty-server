const env = {
  webPort: process.env.PORT || 3000,
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || '',
  dbUser: process.env.DB_USER || '',
  dbPassword: process.env.DB_PASSWORD || '',
  dbDatabase: process.env.DB_DATABASE || 'TasticTickets'
};

const secretKey = "kAi3k#J@Lf0*Aal4im91rfk09m3eiLI88AL7If4mekL";

const dbUrl = process.env.NODE_ENV === 'production' ?
  'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
  'mongodb://localhost/' + env.dbDatabase;

module.exports = {
  env, secretKey, dbUrl
};

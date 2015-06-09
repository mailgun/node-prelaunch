module.exports = {
  env: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'Node Prelaunch',
  db: process.env.MONGODB || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/node-prelaunch',
  mailgun: {
    domain: process.env.MAILGUN_DOMAIN || '',
    api: process.env.MAILGUN_API_KEY || '',
    public: process.env.MAILGUN_PUBLIC_KEY || '',
    email: process.env.MAILGUN_REPLY_EMAIL || ''
  },
  googleAnalytics: process.env.GOOGLE_ANALYTICS || ''
};
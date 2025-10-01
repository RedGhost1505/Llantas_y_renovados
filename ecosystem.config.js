module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'npm',
      args: 'start',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: '8000',
        NEXT_PUBLIC_API_KEY: "921b67fa8f502f3f56df90078c8e7bcf",
        GMAIL_EMAIL: "llantasyrenovadomails@gmail.com",
        GMAIL_PASSWORD: "qvootdcwtujkeiih",
        DEBUG_MODE: 'true',
        DATABASE_URL: "postgresql://inventario_llantas_y_renovado_5409_user:hbTAlJRbPrP2VBQbPo7VaugZZXsqaZ3j@dpg-ctccvjbtq21c73fod2r0-a.oregon-postgres.render.com/inventario_llantas_y_renovado_5409"
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3000',
        NEXT_PUBLIC_API_KEY: "921b67fa8f502f3f56df90078c8e7bcf",
        GMAIL_EMAIL: "llantasyrenovadomails@gmail.com",
        GMAIL_PASSWORD: "qvootdcwtujkeiih",
        DEBUG_MODE: 'false',
        DATABASE_URL: "postgresql://inventario_llantas_y_renovado_5409_user:hbTAlJRbPrP2VBQbPo7VaugZZXsqaZ3j@dpg-ctccvjbtq21c73fod2r0-a.oregon-postgres.render.com/inventario_llantas_y_renovado_5409"

      }
    }
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};

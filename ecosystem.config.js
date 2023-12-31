module.exports = {
  apps : [{
    script: './maps.js',
    env : {
      'PORT': 3003,
      'NODE_ENV' : 'production'
    }
  }],

  deploy : {
    production : {
      user : 'root',
      host : ['45.93.136.98'],
      ref  : 'origin/main',
      repo : 'https://github.com/alesikivan/digital-city-server',
      path : '/root/apps/digital-city',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 delete maps && pm2 start maps.js && pm2 save --force',
      'pre-setup': ''
    }
  }
};

module.exports = {
  apps : [{
    name: "app",
    script: "start ./bin/www",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
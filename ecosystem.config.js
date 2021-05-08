module.exports = {
  apps : [{
    name: "nutritionguide",
    script: "start ./bin/www",
    instances: "1",
	exec_mode: 'cluster_mode',
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
module.exports = {
  apps : [{
    name: "nutritionguide",
    script: "start app.js",
	instances : "1",
	exec_mode : "cluster",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
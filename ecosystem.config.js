module.exports = {
  apps : [{
    name: "nutritionguide",
    script: "start app.js",
	instances : "max",
	exec_mode : "cluster"
  }]
}
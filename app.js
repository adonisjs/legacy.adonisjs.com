const { join } = require('path')
const httpServer = require('@dimerapp/http-server')

const { PORT = 3000 } = process.env

const { router, createServer } = httpServer({
  cors: {}, // https://github.com/expressjs/cors#readme
  NODE_ENV: 'production'
})

// This middleware is required and must set the basePath
router.use((req, res, next) => {
  req.basePath = join(__dirname)

  // optionally
  req.distPath = 'dist'
  next()
})

createServer().listen(PORT)

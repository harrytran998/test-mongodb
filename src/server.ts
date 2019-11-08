import app from './app'
require('./config/loadEnv')

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server listening at ${PORT}`)
})

const express = require('express')

const app = express()

const hostname = 'localhost'
const port = 8017

app.get('/', function (req, res) {
  res.send('<h1>Hello world Nodejs Tonydev</h1>')
})

app.listen(port, hostname, () => {
  console.log(
    `Hello Tonydev, I'm running server at http(s)://${hostname}:${port}/`
  )
})

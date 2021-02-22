/**
 * Variables for necessary dependencies
 */
const express = require('express')
const app = express()
const projectInfo = require('./data.json')

/**
 * Set the view engine to PUG
 */
app.set('view engine', 'pug')
app.use('/static', express.static('public'))

/**
 * Route handling and error handling
 */
app.get('/', (req, res) => {
  res.render('index', projectInfo)
})

app.get('/about', (req, res) => {
  res.render('about')
})

// Redirects to first project if none other listed
app.get('/project', (req, res) => {
  res.redirect('/project/1')
})

/**
 * Obtains user request and verifies if it is a valid project number.
 * If valid, renders appropriate page.
 * Creates 404 error if not
 */
app.get('/project/:id', (req, res) => {
  const projectIndex = parseInt(req.params.id) - 1
  res.render('project', projectInfo.projects[projectIndex], (err, html) => {
    if (err) {
      res.render('error', {
        err: {
          message: 'Danger, Danger Will Robinson! Errors abound!',
          status: 500
        }
      })
    } else {
      res.send(html)
    }
  })
})

/**
 * Obtains user request at the root level and verifies if it is a valid path.
 * Creates 404 error if invalid
 */
app.get('/*', (req, res, next) => {
  const { invalidPath } = req.params
  if (invalidPath === undefined) {
    const err = new Error()
    err.status = 404
    err.message = 'I am sorry Master Kenobi, but it appears the web page you are looking for, does not exist!'
    console.error('Page does not exist')
    next(err)
  } else {
    next()
  }
})

/**
 * Interprets error.  If 404, displays as such, if not, sets error to 500 
 * and displays the message attached
 */

/**
 * Starting the server:
 */
app.listen(3000, () => {
  console.log('The application is running on localhost: 3000')
})

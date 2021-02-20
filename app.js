/**
 * Variables for necessary dependencies
 */
const express = require('express')
const app = express()
const { projects } = require('./data.json')

/**
 * Set the view engine to PUG
 */
app.set('view engine', 'pug')
app.use('/static', express.static('public'))

/**
 * Route handling and error handling
 */
app.get('/', (req, res) => {
  res.render('index', { projects })
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
app.get('/project/:id', (req, res, next) => {
  const project = projects[req.params.id - 1]
  if (project !== undefined) {
    res.render('project', { projects })
  } else {
    const err = new Error()
    err.status = 404
    err.message = 'It seems we have encountered an error. This Page does not yet exist.'
    console.error('Project page does not exist')
    next(err)
  }
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
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.render('page-not-found', { err })
  } else {
    err.status = 500
    err.message = 'It seems the server encountered an error. How unfortunate!'
    console.error('Server error - check code to verify the nature.')
    res.render('error', { err })
  }
})

/**
 * Starting the server:
 */
app.listen(3000, () => {
  console.log('The application is running on localhost: 3000')
})

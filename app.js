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

// Redirects to first project if no project number is there
app.get('/project', (req, res) => { res.redirect('/project/1') })

/**
 * Obtains user request and verifies if it is a valid project number.
 * If valid, renders appropriate page.
 * Creates 404 error if invalid.
 */
app.get('/project/:id', (req, res, next) => {
  const { id } = req.params
  const project = projects[id - 1]
  if (project !== undefined) {
    res.render('project', { project })
  } else {
    const err = new Error()
    err.status = 404
    err.message = 'I am sorry Master Kenobi, but it appears the web page you are looking for, does not exist!'
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
    err.message = 'Woops! It seems the page you are looking for does not exist.'
    console.error('Page does not exist')
    next(err)
  } else {
    next()
  }
})

/**
 * Interprets error.  If 404, displays page not found.
 * If an error exists but is NOT a 404, sets it to 500 and displays error page.
 */
app.use((err, req, res, next) => {
  if (err.status === 404) {
    res.render('page-not-found', { err })
  } else {
    err.status = 500
    err.message = 'Woah! Seems like the server had a bug. We will get an exterminator on that!'
    console.error('Server error - are there bugs in the code that need squishing?')
    res.render('error', { err })
  }
})

/**
 * Starting the server:
 */
app.listen(3000, () => {
  console.log('The application is running on localhost: 3000')
})

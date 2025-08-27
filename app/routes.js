//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const fs = require('fs')
const path = require('path')

// API routes
router.get('/api/applications', function (req, res) {
  try {
    const dataPath = path.join(__dirname, 'data', 'dps', 'general-apps', 'all-general-apps-data.json')
    console.log('Loading applications from:', dataPath)
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    res.json(data)
  } catch (error) {
    console.error('Error loading applications:', error)
    res.status(500).json({ 
      error: 'Failed to load applications data', 
      details: error.message 
    })
  }
})

router.get('/api/departments', function (req, res) {
  try {
    const dataPath = path.join(__dirname, 'data', 'dps', 'general-apps', 'departments.json')
    console.log('Loading departments from:', dataPath)
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    res.json(data)
  } catch (error) {
    console.error('Error loading departments:', error)
    res.status(500).json({ error: 'Failed to load departments data', details: error.message })
  }
})

router.get('/api/application-types', function (req, res) {
  try {
    const dataPath = path.join(__dirname, 'data', 'dps', 'general-apps', 'general_apps_types.json')
    console.log('Loading application types from:', dataPath)
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    res.json(data)
  } catch (error) {
    console.error('Error loading application types:', error)
    res.status(500).json({ error: 'Failed to load application types data', details: error.message })
  }
})

// Page route for applications (adjust path to match your actual page)
router.get('/application-tool/latest/applications/view', function (req, res) {
  const sessionData = req.session.data || {}
  const sessionApplications = []
  
  // Check if application has been submitted
  if (sessionData.appType && sessionData.pageName === 'submitted') {
    sessionApplications.push({
      app_type: sessionData.appType,
      app_group: sessionData.appGroup,
      status: 'pending',
      date_received: 0,
      prisoner_name: sessionData.prisonerName || 'Current User',
      prisoner_number: sessionData.prisonNumber || 'A1234BC',
      current_dept: 'User Submitted',
      priority: 'standard'
    })
  }
  
  console.log('Session applications:', sessionApplications) // Debug log
  
  res.render('application-tool/latest/applications/view/index', {
    sessionApplications: JSON.stringify(sessionApplications)
  })
})

// Add your routes here

// Early work
require('./routes/early-work/managing-apps-1.js')(router);

// PIN Phones
require('./routes/pin-phones/managing-apps-1-5.js')(router);
require('./routes/pin-phones/managing-apps-1-6.js')(router);
require('./routes/pin-phones/managing-apps-1-7.js')(router);
require('./routes/pin-phones/managing-apps-mvp.js')(router);
require('./routes/pin-phones/managing-apps-mvp-phase-2.js')(router);
require('./routes/pin-phones/pin-phones-latest.js')(router);

// Application tool
require('./routes/application-tool/general-apps-categories.js')(router);
require('./routes/application-tool/general-apps-depts.js')(router);
require('./routes/application-tool/single-general-app.js')(router);
require('./routes/application-tool/single-general-app-v1-2.js')(router);
require('./routes/application-tool/app-type-lookup-latest.js')(router);
require('./routes/application-tool/dept-led-latest.js')(router);
require('./routes/application-tool/latest.js')(router);

// Sandbox
require('./routes/admin-latest.js')(router);
require('./routes/sandbox.js')(router);

module.exports = router;
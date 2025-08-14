//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

router.get('/api/applications', function (req, res) {
  const fs = require('fs')
  const path = require('path')
  
  try {
    const dataPath = path.join(__dirname, 'data', 'dps', 'general-apps', 'all-general-apps-data.json')
    console.log('Loading applications from:', dataPath)
    console.log('File exists:', fs.existsSync(dataPath))
    
    // Read the raw file content first
    const rawData = fs.readFileSync(dataPath, 'utf8')
    console.log('Raw file size:', rawData.length)
    console.log('First 100 characters:', rawData.substring(0, 100))
    
    // Try to parse the JSON
    const data = JSON.parse(rawData)
    console.log('Parsed successfully, array length:', data.length)
    
    res.json(data)
  } catch (error) {
    console.error('Detailed error loading applications:', error)
    res.status(500).json({ 
      error: 'Failed to load applications data', 
      details: error.message,
      stack: error.stack 
    })
  }
})

// In app/routes.js
const fs = require('fs')
const path = require('path')

// API routes with correct file paths
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


// Add your routes here

require('./routes/managing-apps-1.js')(router);
require('./routes/managing-apps-1-5.js')(router);
require('./routes/managing-apps-1-6.js')(router);
require('./routes/managing-apps-1-7.js')(router);
require('./routes/managing-apps-mvp.js')(router);
require('./routes/managing-apps-mvp-phase-2.js')(router);
require('./routes/managing-apps-mvp-phase-2-1.js')(router);
require('./routes/general-apps-categories.js')(router);
require('./routes/general-apps-depts.js')(router);
require('./routes/single-general-app.js')(router);
require('./routes/single-general-app-v1-2.js')(router);
require('./routes/app-type-lookup-latest.js')(router);
require('./routes/dept-led-latest.js')(router);
require('./routes/admin-latest.js')(router);
require('./routes/sandbox.js')(router);


//require('./views/'+version+'/routes/mainrouter.js')(router);
module.exports = router;

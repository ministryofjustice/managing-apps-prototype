module.exports = function (router, content) {

  router.post('/staff/latest/applications/log/select-app-type', function (req, res) {
    res.redirect('/staff/latest/applications/log/details')
})


  router.post('/staff/latest/applications/log/details', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']
    // Check whether the variable matches a condition
    if (appType == "bh_01") {
      // Send user to ineligible page
      res.redirect('/staff/latest/applications/log/new-social-pin-contact')
    }
    if (appType == "bh_02") {
      // Send user to ineligible page
      res.redirect('/staff/latest/applications/log/emergency-pin-credit')
    }
    if (appType == "bh_03") {
      // Send user to ineligible page
      res.redirect('/staff/latest/applications/log/topup-pin-credit')
    }
    if (appType == "bh_04") {
      // Send user to ineligible page
      res.redirect('/staff/latest/applications/log/remove-pin-contact')
    }
    if (appType == "bh_05") {
      // Send user to ineligible page
      res.redirect('/staff/latest/applications/log/swap-vos-pin-credit')
    }
    if (appType == "bh_06") {
      // Send user to ineligible page
      res.redirect('/staff/latest/applications/log/supply-pin-contacts')
    }
    if (appType == "bh_07") {
      // Send user to ineligible page
      res.redirect('/staff/latest/applications/log/new-legal-pin-contact')
    }
  })


  router.post('/staff/latest/applications/omu/apps/app-19/action', function (req, res) {
      res.redirect('/staff/latest/applications/omu/apps/app-19/action-decision')
  })

  router.post('/staff/latest/applications/business-hub/apps/app-16/action', function (req, res) {
      res.redirect('/staff/latest/applications/business-hub/apps/app-16/action-decision')
  })


  router.post('/staff/latest/applications/business-hub/apps/app-1/action', function (req, res) {
      res.redirect('/staff/latest/applications/business-hub/apps/app-1/action-decision')
  })

  router.post('/staff/latest/applications/omu/apps/app-1/action', function (req, res) {
      res.redirect('/staff/latest/applications/omu/apps/app-1/action-decision')
  })

}

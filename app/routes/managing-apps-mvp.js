module.exports = function (router, content) {

  router.post('/staff/mvp/applications/log/select-app-type', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "bh_03") {
      res.redirect('/staff/mvp/applications/log/emergency-pin-credit/prisoner-details.html')
    }
    if (appType == "bh_05") {
      res.redirect('/staff/mvp/applications/log/swap-vos-pin-credit/prisoner-details.html')
    }
    if (appType == "bh_06") {
      res.redirect('/staff/mvp/applications/log/supply-pin-contacts/prisoner-details.html')
    }
  })

  router.post('/staff/mvp/applications/business-hub/apps/swap-vos-pin-credit/forward', function (req, res) {

    var appDept = req.session.data['appDept']

    if (appDept == "Activities") {
      res.redirect('/staff/mvp/applications/business-hub/apps/swap-vos-pin-credit/forward-error.html')
    }
  })


  router.post('/staff/mvp/applications/omu/apps/app-19/action', function (req, res) {
      res.redirect('/staff/mvp/applications/omu/apps/app-19/action-decision')
  })

  router.post('/staff/mvp/applications/business-hub/apps/app-16/action', function (req, res) {
      res.redirect('/staff/mvp/applications/business-hub/apps/app-16/action-decision')
  })

  router.post('/staff/mvp/applications/business-hub/apps/app-1/action', function (req, res) {
      res.redirect('/staff/mvp/applications/business-hub/apps/app-1/action-decision')
  })

  router.post('/staff/mvp/applications/omu/apps/app-1/action', function (req, res) {
      res.redirect('/staff/mvp/applications/omu/apps/app-1/action-decision')
  })

}

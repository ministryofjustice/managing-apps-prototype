module.exports = function (router, content) {

  router.post('/application-tool/single-general-app/applications/log/select-app-type', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "bh_01") {
      res.redirect('/application-tool/single-general-app/applications/log/new-social-pin-contact/prisoner-details.html')
    }
    if (appType == "bh_02") {
      res.redirect('/application-tool/single-general-app/applications/log/new-legal-pin-contact/prisoner-details.html')
    }
    if (appType == "bh_03") {
      res.redirect('/application-tool/single-general-app/applications/log/emergency-pin-credit/prisoner-details.html')
    }
    if (appType == "bh_04") {
      res.redirect('/application-tool/single-general-app/applications/log/remove-pin-phone-contact/prisoner-details.html')
    }
    if (appType == "bh_05") {
      res.redirect('/application-tool/single-general-app/applications/log/swap-vos-pin-credit/prisoner-details.html')
    }
    if (appType == "bh_06") {
      res.redirect('/application-tool/single-general-app/applications/log/supply-pin-contacts/prisoner-details.html')
    }
    if (appType == "bh_07") {
      res.redirect('/application-tool/single-general-app/applications/log/general-app/prisoner-details.html')
    }
  })

  router.post('/application-tool/single-general-app/applications/business-hub/apps/swap-vos-pin-credit/forward', function (req, res) {

    var appDept = req.session.data['appDept']

    if (appDept == "Activities") {
      res.redirect('/application-tool/single-general-app/applications/business-hub/apps/swap-vos-pin-credit/forward-error.html')
    }
  })


  router.post('/application-tool/single-general-app/applications/omu/apps/app-19/action', function (req, res) {
      res.redirect('/application-tool/single-general-app/applications/omu/apps/app-19/action-decision')
  })

  router.post('/application-tool/single-general-app/applications/business-hub/apps/app-16/action', function (req, res) {
      res.redirect('/application-tool/single-general-app/applications/business-hub/apps/app-16/action-decision')
  })

  router.post('/application-tool/single-general-app/applications/business-hub/apps/app-1/action', function (req, res) {
      res.redirect('/application-tool/single-general-app/applications/business-hub/apps/app-1/action-decision')
  })

  router.post('/application-tool/single-general-app/applications/omu/apps/app-1/action', function (req, res) {
      res.redirect('/application-tool/single-general-app/applications/omu/apps/app-1/action-decision')
  })

}

module.exports = function (router, content) {

  router.post('/application-tool/general-apps-categories/applications/log/select-app-group', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appGroup = req.session.data['appGroup']

    if (appGroup == 'group_14') {
      res.redirect('/application-tool/general-apps-categories/applications/log/prisoner-details?appGroup=group_14&appType=app_1401' )
    } 
    else {
      res.redirect('/application-tool/general-apps-categories/applications/log/select-app-type')
    }
  })

  router.post('/application-tool/general-apps-categories/applications/log/select-app-type', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "app_1003") {
      res.redirect('/application-tool/general-apps-categories/applications/log/new-social-pin-contact/prisoner-details')
    }
    else if (appType == "app_1002") {
      res.redirect('/application-tool/general-apps-categories/applications/log/new-legal-pin-contact/prisoner-details')
    }
    else if (appType == "app_1001") {
      res.redirect('/application-tool/general-apps-categories/applications/log/emergency-pin-credit/prisoner-details')
    }
    else if (appType == "app_1304") {
      res.redirect('/application-tool/general-apps-categories/applications/log/swap-vos-pin-credit/prisoner-details')
    }
//   else if (appType == "app_34") {
//      res.redirect('/application-tool/general-apps-categories/applications/log/supply-pin-contacts/prisoner-details')
//    }
    else if (appType == "app_1004") {
      res.redirect('/application-tool/general-apps-categories/applications/log/remove-pin-contact/prisoner-details')
    }
    else {
      res.redirect('/application-tool/general-apps-categories/applications/log/prisoner-details')
    }
  })


}

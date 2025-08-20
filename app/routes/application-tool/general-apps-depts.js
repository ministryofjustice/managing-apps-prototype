module.exports = function (router, content) {


  router.post('/application-tool/general-apps-depts/applications/log/select-app-type', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "app_0208"  ||  appType == "app_52")  {
      res.redirect('/application-tool/general-apps-depts/applications/log/new-social-pin-contact/prisoner-details')
    }
    else if (appType == "app_0209") {
      res.redirect('/application-tool/general-apps-depts/applications/log/new-legal-pin-contact/prisoner-details')
    }
    else if (appType == "app_0210") {
      res.redirect('/application-tool/general-apps-depts/applications/log/emergency-pin-credit/prisoner-details')
    }
    else if (appType == "app_0211") {
      res.redirect('/application-tool/general-apps-depts/applications/log/swap-vos-pin-credit/prisoner-details')
    }
   else if (appType == "app_0212") {
      res.redirect('/application-tool/general-apps-depts/applications/log/supply-pin-contacts/prisoner-details')
    }
    else if (appType == "app_0213") {
      res.redirect('/application-tool/general-apps-depts/applications/log/remove-pin-contact/prisoner-details')
    } else {
      res.redirect('/application-tool/general-apps-depts/applications/log/prisoner-details')
    }

  })


}

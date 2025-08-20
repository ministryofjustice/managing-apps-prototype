module.exports = function (router, content) {


  router.post('/application-tool/latest/applications/log/select-app-type', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "app_1003") {
      res.redirect('/application-tool/latest/applications/log/new-social-pin-contact/prisoner-details')
    }
    else if (appType == "app_1002") {
      res.redirect('/application-tool/latest/applications/log/new-legal-pin-contact/prisoner-details')
    }
    else if (appType == "app_1001") {
      res.redirect('/application-tool/latest/applications/log/emergency-pin-credit/prisoner-details')
    }
    else if (appType == "app_1004") {
      res.redirect('/application-tool/latest/applications/log/remove-pin-phone-contact/prisoner-details')
    }
    else{
      res.redirect('/application-tool/latest/applications/log/prisoner-details')
    }

  })


}

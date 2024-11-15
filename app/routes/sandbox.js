module.exports = function (router, content) {


  router.post('/sandbox/first-night-centre/v1/select-app-type', function (req, res) {
    res.redirect('/sandbox/first-night-centre/v1/details')
  })

  router.post('/sandbox/first-night-centre/v1/details', function (req, res) {

    var appType = req.session.data['appType']

    if (appType === 'bh_01') {
      res.redirect('/sandbox/first-night-centre/v1/new-social-pin-contact')
    } else if (appType === 'bh_07'){
      res.redirect('/sandbox/first-night-centre/v1/new-legal-pin-contact')
    }
  })

}

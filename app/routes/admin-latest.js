module.exports = function (router, content) {


  router.post('/staff/latest/applications/admin/groups/add/department', function (req, res) {
    res.redirect('/staff/latest/applications/admin/groups/')
  })

  router.post('/staff/latest/applications/admin/groups/add/governor', function (req, res) {
    res.redirect('/staff/latest/applications/admin/groups/governors')
  })

  router.post('/staff/latest/applications/admin/groups/add/wing', function (req, res) {
    res.redirect('/staff/latest/applications/admin/groups/wings')
  })


}

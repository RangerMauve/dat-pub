const ejs = require('ejs')
const { getApplicationPubs } = require('../applications')

module.exports = async (request, reply) => {
  reply.type('text/html')

  const archiveListItems = Array.from(getApplicationPubs().entries())
    .map(([applicationKey, archive]) => {
      return `<li><a href="dat://${applicationKey}">${applicationKey}</a> (<a href="${
        archive.url
      }">users</a>)</li>`
    })
    .join('')

  return ejs.render(
    `
<html>
<head>
  <title>Dat Pub</title>
  <link rel="stylesheet" type="text/css" href="public/bootstrap.min.css">
</head>
<body>
  <div class="container">
    <img src="public/pub.svg" style="width: 100px; height: 100px; margin-top: 36px; margin-bottom: 16px;" />
    <!-- pub icon by parkjisun from the Noun Project -->

    <h1 class="sr-only">Dat Pub</h1>
    <h2>Applications</h2>
    <ul><%- archiveListItems %></ul>

    <h2>API</h2>

    <div>
      <h3><span class="badge badge-success">GET</span> /applications</h3>

      <h3><span class="badge badge-primary">POST</span> /applications</h3>

      <h3><span class="badge badge-success">GET</span> /applications/{dat-key}</h3>

      <h3><span class="badge badge-primary">POST</span> /applications/{dat-key}/users</h3>
  </div>

  <script src="https://unpkg.com/github-corner@2.0.3"></script>
  <github-corner>
    <a href="https://github.com/RangerMauve/dat-pub">GitHub</a>
  </github-corner>
</body>
</html>
`,
    { archiveListItems }
  )
}

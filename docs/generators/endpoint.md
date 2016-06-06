### Endpoint
Generates a new API endpoint.

Usage:
```bash
Usage:
  yo angular-fullstack:endpoint [options] <name>

Options:
  -h,   --help               # Print the generator's options and usage
        --skip-cache         # Do not remember prompt answers           Default: false
        --route              # URL for the endpoint
        --models             # Specify which model(s) to use            Options: mongoose, sequelize
        --endpointDirectory  # Parent directory for enpoints

Arguments:
  name    Type: String  Required: true
```

Example:
```bash
yo angular-fullstack:endpoint message
[?] What will the url of your endpoint be? /api/messages
```

Produces:

    server/api/message/index.js
    server/api/message/index.spec.js
    server/api/message/message.controller.js
    server/api/message/message.integration.js
    server/api/message/message.model.js  (optional)
    server/api/message/message.events.js (optional)
    server/api/message/message.socket.js (optional)

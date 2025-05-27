# HttpReply

A lightweight, flexible Node.js utility for standardizing HTTP responses in Express, Fastify, or custom server frameworks. `HttpReply` provides a consistent way to format and send HTTP responses with customizable options, including support for timestamps, error logging, and custom adapters.

## Features
- **Framework Agnostic**: Works with Express, Fastify, or custom adapters.
- **Standardized Responses**: Ensures consistent response structure across your API.
- **Configurable**: Customize response fields, timestamps, and logging behavior.
- **Static Methods**: Easily send responses without instantiating the class.
- **Error Handling**: Built-in validation and logging for invalid configurations or response objects.
- **TypeScript Support**: Fully typed for TypeScript users (types included).

## Installation

Install the package via npm:

```bash
npm install httpreply
```

## Usage

### Basic Setup
Require the `HttpReply` class and use it in your Express or Fastify application.

```javascript
const HttpReply = require('httpreply');

// Express example
const express = require('express');
const app = express();

app.get('/example', (req, res) => {
  HttpReply.success(res, {
    message: 'Operation successful',
    data: { user: 'John Doe' },
    metaData: { requestId: '12345' },
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Creating an Instance with Custom Configuration
You can instantiate `HttpReply` with custom configuration options.

```javascript
const HttpReply = require('httpreply');

const reply = new HttpReply({
  includeTimestamp: true,
  dateFormat: 'iso',
  enableLogging: true,
  customFields: { version: '1.0.0' },
});

app.get('/custom', (req, res) => {
  reply.success(res, {
    message: 'Custom response',
    data: { id: 1 },
  });
});
```

### Static Methods
Use static methods for quick responses without instantiation.

```javascript
HttpReply.created(res, {
  message: 'User created',
  data: { id: 123, name: 'Jane Doe' },
});

HttpReply.notFound(res, {
  message: 'Resource not found',
  error: 'Invalid ID',
});
```

### Supported Response Methods
`HttpReply` supports the following response methods, each corresponding to common HTTP status codes:

| Method               | Status Code | Description                              |
|----------------------|-------------|------------------------------------------|
| `success`            | 200         | Successful request                       |
| `created`            | 201         | Resource created successfully            |
| `accepted`           | 202         | Request accepted for processing          |
| `noContent`          | 204         | No content to return                     |
| `badRequest`         | 400         | Invalid request                          |
| `unauthorized`       | 401         | Authentication required                  |
| `forbidden`          | 403         | Access denied                            |
| `notFound`           | 404         | Resource not found                       |
| `conflict`           | 409         | Resource conflict                        |
| `tooManyRequests`    | 429         | Rate limit exceeded                      |
| `error`              | 500         | Internal server error                    |
| `notImplemented`     | 501         | Feature not implemented                  |
| `serviceUnavailable` | 503         | Service temporarily unavailable          |
| `response`           | Custom      | Generic response with custom status code |

### Configuration Options
When creating an instance of `HttpReply`, you can pass a configuration object with the following options:

| Option              | Type      | Default       | Description                                                                 |
|---------------------|-----------|---------------|-----------------------------------------------------------------------------|
| `includeTimestamp`  | Boolean   | `false`       | Include a timestamp in the response (`iso` or `unix` format).                |
| `includeCode`       | Boolean   | `true`        | Include the status code in the response body.                                |
| `includeMessage`    | Boolean   | `true`        | Include the message in the response body.                                    |
| `includeError`      | Boolean   | `true`        | Include error details in the response body.                                  |
| `includeMetaData`   | Boolean   | `true`        | Include metadata in the response body.                                      |
| `enableLogging`     | Boolean   | `true`        | Enable error logging for invalid configurations or response objects.         |
| `stringify`         | Boolean   | `false`       | Stringify the response body before sending (useful for custom adapters).     |
| `customFields`      | Object    | `{}`          | Additional fields to include in every response.                              |
| `dateFormat`        | String    | `'unix'`      | Format for timestamps (`'iso'` or `'unix'`).                                 |
| `adapter`           | Function  | `null`        | Custom adapter function for non-Express/Fastify frameworks.                  |

### Custom Adapter Example
For frameworks other than Express or Fastify, provide a custom adapter.

```javascript
const reply = new HttpReply({
  adapter: (res, statusCode, payload) => {
    // Custom response handling
    res.writeStatusCode(statusCode);
    res.writeBody(payload);
    return res;
  },
});

reply.success(res, {
  message: 'Custom adapter response',
  data: { key: 'value' },
});
```

### Error Logging
`HttpReply` uses an imported `ErrorLog` function for logging errors (e.g., invalid response objects or configuration). Ensure the `ErrorLog` function is defined in your `./logger` module, or disable logging with `enableLogging: false`.

### Example Response Output
Using the `success` method with default configuration:

```javascript
HttpReply.success(res, {
  message: 'User fetched',
  data: { id: 1, name: 'John' },
  metaData: { total: 1 },
});
```

Output:

```json
{
  "message": "User fetched",
  "data": { "id": 1, "name": "John" },
  "metaData": { "total": 1 }
}
```

With `includeTimestamp: true` and `dateFormat: 'iso'`:

```json
{
  "message": "User fetched",
  "data": { "id": 1, "name": "John" },
  "metaData": { "total": 1 },
  "timestamp": "2025-05-27T17:52:00.000Z"
}
```

## Dependencies
- Node.js >= 12.x
- Express or Fastify (optional, depending on your framework)

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For questions or support, open an issue on the [GitHub repository](https://github.com/HarshDev1809/http-reply/issues) or contact the maintainer at [dev182000@gmail.com](dev182000@gmail.com).
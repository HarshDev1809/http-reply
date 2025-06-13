HttpReply
A lightweight, flexible Node.js utility for standardizing HTTP responses in Express, Fastify, or custom server frameworks. HttpReply provides a consistent, customizable way to format and send HTTP responses, with support for timestamps, error logging, and custom adapters. Available as both ES6 modules and CommonJS, with no need for .default in ES module imports.
Features

Framework Agnostic: Compatible with Express, Fastify, or custom frameworks via adapters.
Standardized Responses: Ensures consistent response structure across your API.
Configurable Options: Customize response fields, timestamps, logging, and more.
Static Methods: Send responses without instantiating the class.
Error Handling: Built-in validation and logging for invalid configurations or response objects.
TypeScript Support: Fully typed with included TypeScript declarations.
ES6 and CommonJS Support: Use with import or require, no .default required for ES modules.

Installation
Install the package via npm:
npm install http-reply

Usage
Importing the Package
The package supports both ES6 modules and CommonJS:
// ES6 Module
import { HttpReply } from 'http-reply';

// CommonJS
const { HttpReply } = require('http-reply');

Basic Example (Express)
Use HttpReply to send standardized responses in your Express or Fastify application.
import { HttpReply } from 'http-reply';
import express from 'express';

const app = express();

app.get('/example', (req, res) => {
  HttpReply.success(res, {
    message: 'Operation successful',
    data: { user: 'John Doe' },
    metaData: { requestId: '12345' },
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));

Centralized Configuration
Create a centralized HttpReply instance for consistent configuration across your application.
Create a file (e.g., responder.js):
import { HttpReply } from 'http-reply';

const reply = new HttpReply({
  includeTimestamp: true,
  dateFormat: 'iso',
  enableLogging: true,
  customFields: { apiVersion: '1.0.0' },
});

export default reply;

Use it in your routes:
import reply from './responder';
import express from 'express';

const app = express();

app.get('/example', (req, res) => {
  reply.success(res, {
    message: 'Custom response',
    data: { id: 1 },
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));

Static Methods
Use static methods for quick responses without instantiation:
import { HttpReply } from 'http-reply';

HttpReply.created(res, {
  message: 'User created',
  data: { id: 123, name: 'Jane Doe' },
});

HttpReply.notFound(res, {
  message: 'Resource not found',
  error: 'Invalid ID',
});

Supported Response Methods
HttpReply provides methods for common HTTP status codes:



Method
Status Code
Description



success
200
Successful request


created
201
Resource created successfully


accepted
202
Request accepted for processing


noContent
204
No content to return


badRequest
400
Invalid request


unauthorized
401
Authentication required


forbidden
403
Access denied


notFound
404
Resource not found


conflict
409
Resource conflict


tooManyRequests
429
Rate limit exceeded


error
500
Internal server error


notImplemented
501
Feature not implemented


serviceUnavailable
503
Service temporarily unavailable


response
Custom
Generic response with custom status code


Configuration Options
Customize HttpReply with the following options when creating an instance:



Option
Type
Default
Description



includeTimestamp
Boolean
false
Include a timestamp in the response (iso or unix format).


includeCode
Boolean
true
Include the status code in the response body.


includeMessage
Boolean
true
Include the message in the response body.


includeError
Boolean
true
Include error details in the response body.


includeMetaData
Boolean
true
Include metadata in the response body.


enableLogging
Boolean
true
Enable error logging for invalid configurations or response objects.


stringify
Boolean
false
Stringify the response body before sending (useful for custom adapters).


customFields
Object
{}
Additional fields to include in every response.


dateFormat
String
'unix'
Format for timestamps ('iso' or 'unix').


adapter
Function
null
Custom adapter for non-Express/Fastify frameworks.


Custom Adapter Example
For non-Express/Fastify frameworks, provide a custom adapter:
import { HttpReply } from 'http-reply';

const reply = new HttpReply({
  adapter: (res, statusCode, payload) => {
    res.setStatusCode(statusCode);
    res.setBody(payload);
    return res;
  },
});

reply.success(res, {
  message: 'Custom adapter response',
  data: { key: 'value' },
});

Example Response Output
Using the success method with default configuration:
HttpReply.success(res, {
  message: 'User fetched',
  data: { id: 1, name: 'John' },
  metaData: { total: 1 },
});

Output:
{
  "message": "User fetched",
  "data": { "id": 1, "name": "John" },
  "metaData": { "total": 1 },
  "code": 200
}

With includeTimestamp: true and dateFormat: 'iso':
{
  "message": "User fetched",
  "data": { "id": 1, "name": "John" },
  "metaData": { "total": 1 },
  "code": 200,
  "timestamp": "2025-06-13T17:25:00.000Z"
}

Dependencies

Node.js >= 12.x
Express or Fastify (optional, depending on your framework)

Contributing
We welcome contributions! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

Please ensure your code follows the project's coding standards and includes tests where applicable.
License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For questions or support, open an issue on the GitHub repository or contact the maintainer at dev182000@gmail.com.

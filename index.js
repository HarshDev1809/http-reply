import { ErrorLog } from "./logger";

function isResponseLike(res) {
  return (
    res &&
    typeof res === "object" &&
    ((typeof res.status === "function" && typeof res.json === "function") ||
      (typeof res.code === "function" && typeof res.send === "function"))
  );
}

class HttpReply {
  constructor(config = {}) {
    this.config = {
      includeTimestamp: false,
      includeCode: true,
      includeMessage: true,
      includeError: true,
      includeMetaData: true,
      enableLogging: true,
      stringify: false,
      customFields: {},
      dateFormat: "unix", // 'iso', 'unix'
      adapter: null, // Optional custom adapter
      ...config,
    };
  }

  _sendResponse(res, responseBody, statusCode, extraFields = {}) {
    if (!isResponseLike(res) && typeof this.config.adapter !== "function") {
      if (this.config.enableLogging) {
        ErrorLog(
          `Response object does not match Express or Fastify, and no custom adapter was provided.`,
          "[HttpReply Error]"
        );
      }
      throw new Error(
        `[HttpReply Error] Invalid response object. Must be Express, Fastify, or use a custom adapter.`
      );
    }

    const response = { ...responseBody };

    // Timestamp
    if (this.config.includeTimestamp) {
      if (this.config.dateFormat === "unix") {
        response.timestamp = Math.floor(Date.now() / 1000);
      } else if (this.config.dateFormat === "iso") {
        response.timestamp = new Date().toISOString();
      } else {
        if (this.config.enableLogging) {
          ErrorLog(
            `Invalid "dateFormat" value: "${this.config.dateFormat}". Expected "iso" or "unix".`,
            "[HttpReply Configuration Error]"
          );
        }
        throw new Error(
          `[HttpReply Configuration Error] Invalid "dateFormat" value: "${this.config.dateFormat}". Expected "iso" or "unix".`
        );
      }
    }

    // Cleanup unwanted fields
    if (!this.config.includeCode) delete response.code;
    if (!this.config.includeMessage) delete response.message;
    if (!this.config.includeError) delete response.error;
    if (!this.config.includeMetaData) delete response.metaData;

    // Merge customFields and extraFields
    Object.assign(response, this.config.customFields, extraFields);

    // Handle stringify
    let payload = response;
    if (this.config.stringify) {
      try {
        payload = JSON.stringify(response);
      } catch (err) {
        if (this.config.enableLogging) {
          ErrorLog(`Failed to stringify response: ${err.message}`, "[HttpReply Error]");
        }
        throw err;
      }
    }

    // Send response via adapter if provided
    if (typeof this.config.adapter === "function") {
      return this.config.adapter(res, statusCode, payload);
    }

    // Express style response
    if (typeof res.status === "function" && typeof res.json === "function") {
      if (this.config.stringify) {
        return res.status(statusCode).type("application/json").send(payload);
      }
      return res.status(statusCode).json(payload);
    }

    // Fastify style response
    if (typeof res.code === "function" && typeof res.send === "function") {
      if (this.config.stringify) {
        return res.code(statusCode).type("application/json").send(payload);
      }
      return res.code(statusCode).send(payload);
    }
  }

  response(
    res,
    {
      message = "Api Processed",
      data = null,
      metaData = {},
      code = 200,
      error = null,
      extra = {},
    }
  ) {
    const body = { message, data, metaData, error };
    return this._sendResponse(res, body, code, extra);
  }

  success(
    res,
    { message = "Success", data = null, metaData = {}, code = 200, extra = {} } = {}
  ) {
    const body = { message, data, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  accepted(
    res,
    { message = "Accepted", data = null, metaData = {}, code = 202, extra = {} } = {}
  ) {
    const body = { message, data, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  noContent(res, { message = "No Content", code = 204, extra = {} } = {}) {
    // No content: Send no body
    if (typeof this.config.adapter === "function") {
      return this.config.adapter(res, code, null);
    }

    if (typeof res.status === "function" && typeof res.send === "function") {
      return res.status(code).send();
    }

    if (typeof res.code === "function" && typeof res.send === "function") {
      return res.code(code).send();
    }
  }

  conflict(
    res,
    { message = "Conflict", error = null, metaData = {}, code = 409, extra = {} } = {}
  ) {
    const body = { message, error, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  tooManyRequests(
    res,
    { message = "Too Many Requests", error = null, metaData = {}, code = 429, extra = {} } = {}
  ) {
    const body = { message, error, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  badRequest(
    res,
    { message = "Bad Request", error = null, metaData = {}, code = 400, extra = {} } = {}
  ) {
    const body = { message, error, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  notImplemented(
    res,
    { message = "Not Implemented", error = null, metaData = {}, code = 501, extra = {} } = {}
  ) {
    const body = { message, error, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  serviceUnavailable(
    res,
    { message = "Service Unavailable", error = null, metaData = {}, code = 503, extra = {} } = {}
  ) {
    const body = { message, error, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  error(
    res,
    { message = "Internal Server Error", error = null, metaData = {}, code = 500, extra = {} } = {}
  ) {
    const body = { message, error, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  rejected(
    res,
    { message = "Request Rejected", error = null, metaData = {}, code = 400, extra = {} } = {}
  ) {
    const body = { message, error, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  created(
    res,
    { message = "Resource Created Successfully", data = null, metaData = {}, code = 201, extra = {} } = {}
  ) {
    const body = { message, data, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  forbidden(
    res,
    { message = "Forbidden", error = null, metaData = {}, code = 403, extra = {} } = {}
  ) {
    const body = { message, error, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  unauthorized(
    res,
    { message = "Unauthorized", error = null, metaData = {}, code = 401, extra = {} } = {}
  ) {
    const body = { message, error, metaData };
    return this._sendResponse(res, body, code, extra);
  }

  notFound(
    res,
    { message = "Not Found", error = null, metaData = {}, code = 404, extra = {} } = {}
  ) {
    const body = { message, error, metaData };
    return this._sendResponse(res, body, code, extra);
  }
}

const methods = [
  "success",
  "error",
  "rejected",
  "created",
  "forbidden",
  "unauthorized",
  "notFound",
  "response",
  "accepted",
  "noContent",
  "conflict",
  "tooManyRequests",
  "badRequest",
  "notImplemented",
  "serviceUnavailable",
];

methods.forEach((method) => {
  HttpReply[method] = function (res, args = {}) {
    const instance = new HttpReply();
    // For noContent, only pass res and args as message/code object
    if (method === "noContent") {
      return instance.noContent(res, args);
    }
    return instance[method](res, args);
  };
});

module.exports = HttpReply;


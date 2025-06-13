import { ErrorLog } from "./logger";

type ResponseLike =
  | {
      status: (code: number) => any;
      json: (body: any) => any;
      type?: (mime: string) => any;
      send: (body?: any) => any;
    }
  | {
      code: (code: number) => any;
      send: (body?: any) => any;
      type?: (mime: string) => any;
    };

type AdapterFunction = (
  res: any,
  statusCode: number,
  payload: any
) => any;

interface HttpReplyConfig {
  includeTimestamp?: boolean;
  includeCode?: boolean;
  includeMessage?: boolean;
  includeError?: boolean;
  includeMetaData?: boolean;
  enableLogging?: boolean;
  stringify?: boolean;
  customFields?: Record<string, any>;
  dateFormat?: "iso" | "unix";
  adapter?: AdapterFunction | null;
}

interface HttpReplyOptions {
  message?: string;
  data?: any;
  metaData?: Record<string, any>;
  code?: number;
  error?: any;
  extra?: Record<string, any>;
}

function isResponseLike(res: any): res is ResponseLike {
  return (
    res &&
    typeof res === "object" &&
    ((typeof res.status === "function" && typeof res.json === "function") ||
      (typeof res.code === "function" && typeof res.send === "function"))
  );
}

export class HttpReply {
  private config: Required<HttpReplyConfig>;

  constructor(config: HttpReplyConfig = {}) {
    this.config = {
      includeTimestamp: false,
      includeCode: true,
      includeMessage: true,
      includeError: true,
      includeMetaData: true,
      enableLogging: true,
      stringify: false,
      customFields: {},
      dateFormat: "unix",
      adapter: null,
      ...config,
    };
  }

  private _sendResponse(
    res: ResponseLike,
    responseBody: Record<string, any>,
    statusCode: number,
    extraFields: Record<string, any> = {}
  ) {
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

    const response: Record<string, any> = { ...responseBody };

    if (this.config.includeTimestamp) {
      response.timestamp =
        this.config.dateFormat === "unix"
          ? Math.floor(Date.now() / 1000)
          : this.config.dateFormat === "iso"
          ? new Date().toISOString()
          : (() => {
              const msg = `[HttpReply Configuration Error] Invalid "dateFormat": "${this.config.dateFormat}". Expected "iso" or "unix".`;
              if (this.config.enableLogging) ErrorLog(msg, "[HttpReply Configuration Error]");
              throw new Error(msg);
            })();
    }

    if (!this.config.includeCode) delete response.code;
    if (!this.config.includeMessage) delete response.message;
    if (!this.config.includeError) delete response.error;
    if (!this.config.includeMetaData) delete response.metaData;

    Object.assign(response, this.config.customFields, extraFields);

    let payload: any = response;
    if (this.config.stringify) {
      try {
        payload = JSON.stringify(response);
      } catch (err: any) {
        if (this.config.enableLogging) {
          ErrorLog(`Failed to stringify response: ${err.message}`, "[HttpReply Error]");
        }
        throw err;
      }
    }

    if (typeof this.config.adapter === "function") {
      return this.config.adapter(res, statusCode, payload);
    }

    if ("status" in res && typeof res.status === "function" && typeof res.json === "function") {
      return this.config.stringify
        ? res.status(statusCode).type?.("application/json").send(payload)
        : res.status(statusCode).json(payload);
    }

    if ("code" in res && typeof res.code === "function" && typeof res.send === "function") {
      return this.config.stringify
        ? res.code(statusCode).type?.("application/json").send(payload)
        : res.code(statusCode).send(payload);
    }
  }

  response(res: ResponseLike, opts: HttpReplyOptions) {
    const { message = "Api Processed", data = null, metaData = {}, code = 200, error = null, extra = {} } = opts;
    const body = { message, data, metaData, error, code };
    return this._sendResponse(res, body, code, extra);
  }

  success(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Success", data = null, metaData = {}, code = 200, extra = {} } = opts;
    const body = { message, data, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  created(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Resource Created Successfully", data = null, metaData = {}, code = 201, extra = {} } = opts;
    const body = { message, data, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  accepted(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Accepted", data = null, metaData = {}, code = 202, extra = {} } = opts;
    const body = { message, data, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  noContent(res: ResponseLike, opts: { message?: string; code?: number; extra?: Record<string, any> } = {}) {
    const { code = 204 } = opts;
    if (typeof this.config.adapter === "function") {
      return this.config.adapter(res, code, null);
    }

    if ("status" in res && typeof res.status === "function" && typeof res.send === "function") {
      return res.status(code).send();
    }

    if ("code" in res && typeof res.code === "function" && typeof res.send === "function") {
      return res.code(code).send();
    }
  }

  error(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Internal Server Error", error = null, metaData = {}, code = 500, extra = {} } = opts;
    const body = { message, error, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  rejected(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Request Rejected", error = null, metaData = {}, code = 400, extra = {} } = opts;
    const body = { message, error, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  conflict(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Conflict", error = null, metaData = {}, code = 409, extra = {} } = opts;
    const body = { message, error, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  badRequest(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Bad Request", error = null, metaData = {}, code = 400, extra = {} } = opts;
    const body = { message, error, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  tooManyRequests(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Too Many Requests", error = null, metaData = {}, code = 429, extra = {} } = opts;
    const body = { message, error, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  notImplemented(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Not Implemented", error = null, metaData = {}, code = 501, extra = {} } = opts;
    const body = { message, error, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  serviceUnavailable(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Service Unavailable", error = null, metaData = {}, code = 503, extra = {} } = opts;
    const body = { message, error, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  forbidden(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Forbidden", error = null, metaData = {}, code = 403, extra = {} } = opts;
    const body = { message, error, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  unauthorized(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Unauthorized", error = null, metaData = {}, code = 401, extra = {} } = opts;
    const body = { message, error, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  notFound(res: ResponseLike, opts: HttpReplyOptions = {}) {
    const { message = "Not Found", error = null, metaData = {}, code = 404, extra = {} } = opts;
    const body = { message, error, metaData, code };
    return this._sendResponse(res, body, code, extra);
  }

  static createMethodShortcuts() {
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
    ] as const;

    for (const method of methods) {
      (HttpReply as any)[method] = (res: ResponseLike, args: HttpReplyOptions = {}) => {
        const instance = new HttpReply();
        return (instance as any)[method](res, args);
      };
    }
  }
}

// Initialize static shortcuts
HttpReply.createMethodShortcuts();

export default HttpReply;

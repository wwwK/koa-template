const _ = require('lodash');

const DESENSITIZE_WORD = {
  password: '*****************',
  token: '*****************',
};

const desensitize = (result) => {
  if (!_.isUndefined(result)) {
    const new_result = _.cloneDeep(result);
    for (const key in DESENSITIZE_WORD) {
      if (_.isObject(result.data)) {
        if (new_result.data[key]) {
          new_result.data[key] = DESENSITIZE_WORD[key];
        }
      } else if (new_result[key]) {
        new_result[key] = DESENSITIZE_WORD[key];
      }
    }

    return new_result;
  }
  return result;
};

const formatRequest = (ctx) => {
  const {
    request,
    request: { method, originalUrl },
  } = ctx;
  const parameter = {
    method,
    request: method === 'GET' ? request.query : desensitize(request.body),
  };
  console.log(`${originalUrl} request begin || ${JSON.stringify(parameter)}`);
};

const formatResponse = (ctx, ms) => {
  const {
    status,
    body,
    request,
    request: { method, originalUrl },
  } = ctx;
  const parameter = {
    method,
    status,
    request: method === 'GET' ? request.query : desensitize(request.body),
    body: desensitize(body),
    time: `${ms} ms`,
  };

  console.log(`${originalUrl} request end || ${JSON.stringify(parameter)}`);
};

const formatError = (error) => {
  let logText = '';
  if (error instanceof Error) {
    logText = `${error.message}\n`;
    logText = error.stack;
  } else {
    logText = error;
  }
  console.error(logText);
};

class ServerMiddleware {
  static async formatUrl(ctx, next) {
    const startTime = new Date();
    try {
      formatRequest(ctx);
      await next();
    } catch (error) {
      formatError(error);
      let message = '';
      switch (error.status) {
        case 401:
          message = 'token 错误';
          break;

        default:
          if (error instanceof Error) {
            message = error.toString();
          }
          break;
      }

      ctx.body = {
        success: false,
        message,
      };
    } finally {
      formatResponse(ctx, new Date() - startTime);
    }
  }
}

module.exports = ServerMiddleware;

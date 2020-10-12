const _ = require('lodash');

const DESENSITIZE_WORD = {
  password: '*****************',
  token: '*****************',
};

const desensitize = result => {
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

const formatRequest = ctx => {
  const {
    // request,
    request: { method, originalUrl },
  } = ctx;
  // let parameter = method === 'GET' ? request.query : request.body;

  console.log(`<--- ${originalUrl} ${method} `);
};

const formatResponse = (ctx, ms) => {
  const {
    status,
    body,
    request: { method, originalUrl },
  } = ctx;
  const resData = typeof body === 'object' ? JSON.stringify(body) : body;

  console.log(`---> ${originalUrl} ${method} ${resData} ${status} ${ms}ms`);
};

const formatError = error => {
  let logText = '';
  if (error instanceof Error) {
    logText = `${error.message}\n`;
    logText = error.stack;
  } else {
    logText = error;
  }
  console.error(logText);
};

module.exports = () => async (ctx, next) => {
  const startTime = new Date();
  try {
    await next();
    formatRequest(ctx);

    const { status } = ctx;
    if (status === 200) {
      ctx.body = {
        success: true,
        code: 1,
        message: '',
        data: ctx.body,
      };
    } else {
      ctx.body = 'not found';
    }
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
      code: -1,
      message,
      data: {},
    };
  } finally {
    formatResponse(ctx, new Date() - startTime);
  }
};

const formatRequest = ctx => {
  const {
    request: { method, originalUrl },
  } = ctx;

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
  } catch (error) {
    formatError(error);
  } finally {
    formatResponse(ctx, new Date() - startTime);
  }
};

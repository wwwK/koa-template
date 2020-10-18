module.exports = () => async (ctx, next) => {
  try {
    await next();
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
  }
};

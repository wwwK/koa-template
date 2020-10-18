class HomeController {
  static index(ctx, next) {
    ctx.body = 'hello word';
    next();
  }
}

module.exports = HomeController;

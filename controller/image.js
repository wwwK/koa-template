class ImageController {
  static getCidByImageName(ctx, next) {
    ctx.body = {
      status: true,
      code: 1,
      data: {
        cid: 'QmWK93BYRUkgPvsWuAj7fo1VJ7mvU1sMz42efumx7t6gsg',
      },
      message: '',
    };

    next();
  }

  static addImage(ctx, next) {
    ctx.body = {
      status: true,
      code: 1,
      data: {},
      message: '',
    };

    next();
  }
}

module.exports = ImageController;

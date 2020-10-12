const Router = require('@koa/router');

const home = require('./home');
const image = require('./image');

const router = new Router();

router.use(home.routes(), home.allowedMethods());
router.use(image.routes(), image.allowedMethods());

module.exports = router;

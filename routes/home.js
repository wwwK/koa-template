const Router = require('@koa/router');

const router = new Router();

const HomeController = require('../controller/home');

router.get('/', HomeController.index);

module.exports = router;

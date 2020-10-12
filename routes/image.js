const Router = require('@koa/router');

const router = new Router({
  prefix: '/image',
});

const ImageController = require('../controller/image');

router.get('/getCidByImageName', ImageController.getCidByImageName);

router.post('/addImage', ImageController.addImage);

module.exports = router;

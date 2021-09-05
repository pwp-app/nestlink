import Router from '@tigojs/lambda-router';
import getStaticFilesHandler from './modules/staticFilesHandler';
import { jumpHandler, registerHandler } from './modules/shortLink';

addEventListener('request', async (event) => {
  event.respondWith(await handleRequest(event.context));
});

const router = new Router();

router.get('/', getStaticFilesHandler('html'));
router.get('/favicon.png', getStaticFilesHandler('favicon'));
router.get('/js/:filename', getStaticFilesHandler('js'));
router.get('/css/:filename', getStaticFilesHandler('css'));

router.get('/:shortId', jumpHandler);
router.post('/register', registerHandler);

async function handleRequest(ctx) {
  try {
    return await router.route(ctx);
  } catch (err) {
    return new Response({
      status: 500,
      body: {
        success: false,
        message: err.message,
      },
    });
  }
}

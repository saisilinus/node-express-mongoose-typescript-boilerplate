import express from 'express';
import authRoute from './auth.route';
import docsRoute from './swagger.route';
import userRoute from './user.route';
import config from '../../config/config';

const router = express.Router();
const defaultIRoute = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
];
const devIRoute = [
  // IRoute available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];
defaultIRoute.forEach((route) => {
  router.use(route.path, route.route);
});
/* istanbul ignore next */
if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.route);
  });
}
export default router;
// # sourceMappingURL=index.js.map

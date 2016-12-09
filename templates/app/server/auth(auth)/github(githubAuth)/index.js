import { Router } from 'express';
import passport from 'passport';
import { setTokenCookie } from '../auth.service';

let router = new Router();

router
  .get('/', passport.authenticate('github', {
    failureRedirect: '/signup',
    scope: [
      'user:email',
    ],
    session: false
  }))
  .get('/callback', passport.authenticate('github', {
    failureRedirect: '/signup',
    session: false
  }), setTokenCookie);

export default router;

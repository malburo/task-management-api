import Passport from 'passport';
import { Strategy } from 'passport-github';

export const configPassportGithub = () => {
  return Passport.use(
    new Strategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV === 'production'
            ? process.env.BASE_URL + 'api/auth/github/callback'
            : 'http://localhost:8000/api/auth/github/callback',
      },
      function (accessToken, refreshToken, profile, cb) {
        cb(null, profile);
      }
    )
  );
};

import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { Request } from 'express';
import { getUserById } from '../../controllers/userController';
import { database } from '../../models/userModel';
require('dotenv').config()

const clientID = String(process.env.DB_clientID)
const clientSecret = String(process.env.DB_clientSecret)
const callbackURL = String(process.env.DB_callbackURL)

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callbackURL,
        passReqToCallback: true,
    },
    
    async (req: Request, accessToken: string, refreshToken: string, profile: any, done: (err?: Error | null, profile?: any) => void) => {
        let user = getUserById(profile.id)
        if (!user) {
            user = { id: profile.id, name: profile.username, email: profile.email, password: profile.password, role:"admin" }
            database.push(user);
        }
        return done(null, user)
    },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;

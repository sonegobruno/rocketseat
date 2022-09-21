import { Request, Response, NextFunction} from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
    const authHeader = request.headers.authorization;

    if(!authHeader) {
        throw new AppError('JWT Token is mising', 401);
    };

    const [, token] = authHeader.split(' ');


    try {
        const decoded = verify(token, String(authConfig.jwt.secret));

        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        }

        return next();
    } catch (err) {
        throw new AppError('JWT invalid', 401);
    }

}

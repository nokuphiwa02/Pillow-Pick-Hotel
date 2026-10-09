import  {OAuthUser } from '../Types/oAutho.types';


declare global {
    namespace Express {
        export interface Request {
            user? : OAuthUser;
        }
    }
}
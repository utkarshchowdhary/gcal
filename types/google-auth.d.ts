import { Credentials } from 'google-auth-library';

type BearerTokenCredentials = Credentials & {
    token_type: 'Bearer';
    access_token: string;
    expiry_date?: number;
};

declare module 'google-auth-library' {
    interface OAuth2Client {
        on(event: 'tokens', listener: (tokens: BearerTokenCredentials) => void): this;
    }
}

export type TClientData = {
    client_id: string;
    client_secret: string;
    scope: string;
};

export type TTokenData = {
    scope?: string;
    access_token: string;
    token_type: "Bearer";
    expires_in?: number; // The token's lifetime in seconds
    issued_at?: number; // The time the token was issued (milliseconds since Unix Epoch)
    expiry_date?: number; // The time the token will expire (milliseconds since Unix Epoch)
    refresh_token?: string;
};

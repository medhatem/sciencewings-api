import * as express from 'express';

export type KeycloakUserInfo = {
  email_verified: string;
  address: { [key: string]: any };
  name: string;
  //groups: string[];
  preferred_username: string;
  given_name: string;
  family_name: string;
  locale: string;
  email: string;
  //sub is the keycloakId
  sub: string;
};

export type UserRequest = express.Request & { keycloakUser?: KeycloakUserInfo; userId?: number };

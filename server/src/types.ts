export interface SessionResponse {
  ok: boolean,
  userCtx: {
    name: string,
    roles: string[]
  },
  info: {
    authentication_handlers: string[],
    authenticated: string
  }
}

export interface UserClaims {
  name: string
  '_couchdb.roles': string[]
}

export interface RefreshTokenClaims {
  name: string
}

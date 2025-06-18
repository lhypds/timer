import { action, computed, observable } from 'mobx';

const storage = localStorage;
const ACCESS_TOKEN = 'accessToken';

export class Auth {
  @observable accessor accessToken = storage.getItem(ACCESS_TOKEN) || '';

  @action
  setToken(token: string) {
    try {
      storage.setItem(ACCESS_TOKEN, token);
    } finally {
      this.accessToken = token;
    }
  }

  @action
  getToken() {
    return this.accessToken;
  }

  @computed
  get loggedIn(): boolean {
    return !!this.accessToken;
  }
}

export default new Auth();

import { $axios } from '~/utils/axios';
const API_URL = process.env.apiUrl;

export const state = () => ({
  authModalActive: false,
  auhtModalType: 'login',
  isLoading: false,
  isLoggedIn: false,
  isRegistered: false,
  userLoading: false,
  user: {
    id: '',
    email: '',
    username: '',
  },
  token: '',
  refreshToken: '',
  tokenExpiration: 0,
  response: {},
  resetStatus: 0,
});

const mainMutations = {
  SHOW_AUTH_MODAL(state, type) {
    state.authModalActive = true;
    state.auhtModalType = type;
  },
  HIDE_AUTH_MODAL(state) {
    state.authModalActive = false;
    state.isRegistered = false;
  },
  CHANGE_AUTH_MODAL_TYPE(state, type) {
    state.auhtModalType = type;
  },
  CLEAR_ERROR(state) {
    state.response = {
      isError: false,
      status: 200,
      msg: 'cleared',
      registered: false,
    };
  },
};

const registerMutations = {
  REGISTER_USER_REQUEST(state) {
    state.isLoading = true;
    state.response = { isError: false, registered: false };
  },
  REGISTER_USER_SUCCESS(state) {
    state.isLoading = false;
    state.isRegistered = true;
    state.response = {
      isError: false,
      status: 200,
      msg: 'Please confirm email',
      registered: true,
    };
  },
  REGISTER_USER_FAILURE(state, payload) {
    state.isLoading = false;
    state.response = {
      isError: true,
      status: payload.response.status,
      data: payload.response.data,
      registered: false,
    };
  },
  RESEND_EMAIL_SUCCESS(state) {
    state.response = {
      isError: false,
      status: 200,
      msg: 'Email was resend',
    };
  },
  ACTIVATE_ACCOUNT_REQUEST(state) {
    state.isLoading = true;
    state.response = { isError: false, registered: false };
  },
  ACTIVATE_ACCOUNT_SUCCESS(state) {
    state.isLoading = false;
    state.response = {
      isError: false,
      status: 200,
      msg: 'Successful activated account',
      registered: false,
    };
    state.isLoggedIn = false;
    state.user = {
      id: '',
      email: '',
      username: '',
    };
    state.token = '';
    state.refreshToken = '';
    state.tokenExpiration = 0;
  },
  ACTIVATE_ACCOUNT_FAILURE(state, payload) {
    state.isLoading = false;
    state.response = {
      isError: true,
      status: payload.response.status,
      data: payload.response.data,
      registered: false,
    };
  },
};

const loginMutations = {
  LOGIN_USER_REQUEST(state) {
    state.isLoading = true;
    state.response = { isError: false };
  },
  LOGIN_USER_SUCCESS(state, payload) {
    state.isLoading = false;
    state.isLoggedIn = true;
    state.user = payload.user;
    state.token = payload.token;
    state.refreshToken = payload.refreshToken;
    state.tokenExpiration = payload.tokenExpiration;
    state.response = {
      isError: false,
      status: 200,
      msg: 'Successful logged in',
    };
  },
  LOGIN_USER_FAILURE(state, payload) {
    state.isLoading = false;
    state.response = {
      isError: true,
      status: payload.response.status,
      data: payload.response.data,
    };
  },
  LOGOUT_USER(state) {
    state.authModalActive = false;
    state.isLoggedIn = false;
    state.user = {
      id: '',
      email: '',
      username: '',
    };
    state.token = '';
    state.refreshToken = '';
    state.tokenExpiration = 0;
  },
};

const refreshMutations = {
  REFRESH_REQUEST(state) {
    state.isLoading = true;
    state.response = { isError: false };
  },
  REFRESH_SUCCESS(state, payload) {
    state.isLoading = false;
    state.isLoggedIn = true;
    state.user = payload.user;
    state.token = payload.token;
    state.refreshToken = payload.refreshToken;
    state.tokenExpiration = payload.tokenExpiration;
    state.response = {
      isError: false,
      status: 200,
      msg: 'Successful refreshed token',
    };
  },
  REFRESH_FAILURE(state, payload) {
    state.isLoading = false;
    state.response = {
      isError: true,
      status: payload.response.status,
      data: payload.response.data,
    };
    state.authModalActive = false;
    state.isLoggedIn = false;
    state.user = {
      id: '',
      email: '',
      username: '',
    };
    state.token = '';
    state.refreshToken = '';
    state.tokenExpiration = 0;
  },
};

const userMutations = {
  CHANGE_USER_REQUEST(state) {
    state.userLoading = true;
    state.response = { isError: false };
  },
  CHANGE_USER_SUCCESS(state, payload) {
    state.userLoading = false;
    state.response = {
      isError: false,
      status: 200,
      msg: 'Successful changed user',
    };
    state.user = payload.user;
  },
  RESET_EMAIL_SUCCESS(state) {
    state.userLoading = false;
    state.response = {
      isError: false,
      status: 200,
      msg: 'Successful resetted email',
    };
    state.isLoggedIn = false;
    state.user = {
      id: '',
      email: '',
      username: '',
    };
    state.token = '';
    state.refreshToken = '';
    state.tokenExpiration = 0;
  },
  CHANGE_USER_FAILURE(state, payload) {
    state.userLoading = false;
    state.response = {
      isError: true,
      status: payload.response.status,
      data: payload.response.data,
    };
  },
  DELETE_USER_SUCCESS(state) {
    state.userLoading = false;
    state.response = {
      isError: false,
      status: 200,
      msg: 'Successful deleted user',
    };
    state.isLoggedIn = false;
    state.user = {
      id: '',
      email: '',
      username: '',
    };
    state.token = '';
    state.refreshToken = '';
    state.tokenExpiration = 0;
  },
};

const forgotPasswordMutations = {
  FORGOT_PASSWORD_REQUEST(state) {
    state.isLoading = true;
    state.response = { isError: false };
  },
  FORGOT_PASSWORD_SUCCESS(state) {
    state.isLoading = false;
    state.response = {
      isError: false,
      status: 200,
      msg: 'Successful request',
    };
  },
  FORGOT_PASSWORD_FAILURE(state, payload) {
    state.isLoading = false;
    state.response = {
      isError: true,
      status: payload.response.status,
      data: payload.response.data,
    };
  },
  RESET_PASSWORD_CHECK_REQUEST(state) {
    state.isLoading = true;
    state.resetStatus = 0;
    state.response = { isError: false };
  },
  RESET_PASSWORD_CHECK_SUCCESS(state) {
    state.isLoading = false;
    state.resetStatus = 1;
    state.response = {
      isError: false,
      status: 200,
      msg: 'Password can be resetted',
    };
  },
  RESET_PASSWORD_CHECK_FAILURE(state, payload) {
    state.isLoading = false;
    state.resetStatus = 1;
    state.response = {
      isError: true,
      status: payload.response.status,
      data: payload.response.data,
    };
  },
  RESET_PASSWORD_REQUEST(state) {
    state.isLoading = true;
    state.resetStatus = 1;
    state.response = { isError: false };
  },
  RESET_PASSWORD_SUCCESS(state) {
    state.isLoading = false;
    state.resetStatus = 2;
    state.response = {
      isError: false,
      status: 200,
      msg: 'Password resetted',
    };
  },
  RESET_PASSWORD_FAILURE(state, payload) {
    state.isLoading = false;
    state.resetStatus = 2;
    state.response = {
      isError: true,
      status: payload.response.status,
      data: payload.response.data,
    };
  },
};

const mainActions = {
  clearError({ commit }) {
    commit('CLEAR_ERROR');
  },
};

const registerActions = {
  async register({ commit }, data) {
    commit('REGISTER_USER_REQUEST');

    try {
      await $axios.$post(`${API_URL}/auth/register`, data);
      commit('REGISTER_USER_SUCCESS');
    } catch (error) {
      commit('REGISTER_USER_FAILURE', error);
    }
  },
  async resendEmail({ commit }, data) {
    try {
      await $axios.$post(`${API_URL}/auth/resend`, data);
      commit('RESEND_EMAIL_SUCCESS');
    } catch (error) {
      commit('REGISTER_USER_FAILURE', error);
    }
  },
  async activateAccoun({ commit }, data) {
    commit('ACTIVATE_ACCOUNT_REQUEST');

    try {
      await $axios.$get(`${API_URL}/auth/confirm/${data.activationToken}`);
      commit('ACTIVATE_ACCOUNT_SUCCESS');
    } catch (error) {
      commit('ACTIVATE_ACCOUNT_FAILURE', error);
    }
  },
};

const loginActions = {
  logout({ commit }) {
    commit('LOGOUT_USER');
  },
  async login({ commit }, data) {
    commit('LOGIN_USER_REQUEST');

    try {
      const result = await $axios.$post(`${API_URL}/auth/login`, data);
      commit('LOGIN_USER_SUCCESS', result);
    } catch (error) {
      commit('LOGIN_USER_FAILURE', error);
    }
  },
};

const refreshActions = {
  async refresh({ commit, state }) {
    const currentUnix = Math.floor(new Date().getTime() / 1000);

    if (state.refreshToken !== '' && state.tokenExpiration > 0) {
      if (currentUnix >= state.tokenExpiration - 100) {
        const data = {
          email: state.user.email,
          refreshToken: state.refreshToken,
        };

        commit('REFRESH_REQUEST');

        try {
          const result = await $axios.$post(
            `${API_URL}/auth/refreshToken`,
            data
          );
          commit('REFRESH_SUCCESS', result);
        } catch (error) {
          commit('REFRESH_FAILURE', error);
        }
      }
    }
  },
};

const userActions = {
  async changeData({ commit, rootState }, data) {
    const token = rootState.auth.token;

    commit('CHANGE_USER_REQUEST');

    try {
      $axios.setToken(token, 'Bearer');

      const result = await $axios.$patch(`${API_URL}/user/me`, data);
      commit('CHANGE_USER_SUCCESS', {
        user: {
          id: result._id,
          email: result.email,
          username: result.username,
        },
      });
    } catch (error) {
      commit('CHANGE_USER_FAILURE', error);
    }
  },
  async changeEmail({ commit, rootState }, data) {
    const token = rootState.auth.token;

    commit('CHANGE_USER_REQUEST');

    try {
      $axios.setToken(token, 'Bearer');

      const result = await $axios.$patch(`${API_URL}/user/email`, data);
      commit('CHANGE_USER_SUCCESS', {
        user: {
          id: result._id,
          email: result.email,
          username: result.username,
        },
      });
    } catch (error) {
      commit('CHANGE_USER_FAILURE', error);
    }
  },
  async resetEmail({ commit }, data) {
    commit('CHANGE_USER_REQUEST');

    try {
      await $axios.$get(`${API_URL}/user/email/reset/${data.resetMailToken}`);
      commit('RESET_EMAIL_SUCCESS');
    } catch (error) {
      commit('CHANGE_USER_FAILURE', error);
    }
  },
  async deleteUser({ commit, rootState }) {
    const token = rootState.auth.token;

    commit('CHANGE_USER_REQUEST');

    try {
      $axios.setToken(token, 'Bearer');

      await $axios.$delete(`${API_URL}/user/me`);
      commit('DELETE_USER_SUCCESS');
    } catch (error) {
      commit('CHANGE_USER_FAILURE', error);
    }
  },
};

const forgotPasswordActions = {
  async forgotPassword({ commit }, data) {
    commit('FORGOT_PASSWORD_REQUEST');

    try {
      await $axios.$post(`${API_URL}/auth/forgotPassword`, data);
      commit('FORGOT_PASSWORD_SUCCESS');
    } catch (error) {
      commit('FORGOT_PASSWORD_FAILURE', error);
    }
  },
  async checkResetPassword({ commit }, data) {
    commit('RESET_PASSWORD_CHECK_REQUEST');

    try {
      await $axios.$get(`${API_URL}/auth/resetPassword/${data.resetToken}`);
      commit('RESET_PASSWORD_CHECK_SUCCESS');
    } catch (error) {
      commit('RESET_PASSWORD_CHECK_FAILURE', error);
    }
  },
  async resetPassword({ commit }, data) {
    commit('RESET_PASSWORD_REQUEST');

    try {
      await $axios.$post(
        `${API_URL}/auth/resetPassword/${data.resetToken}`,
        data.passwords
      );
      commit('RESET_PASSWORD_SUCCESS');
    } catch (error) {
      commit('RESET_PASSWORD_FAILURE', error);
    }
  },
};

export const mutations = {
  ...mainMutations,
  ...registerMutations,
  ...loginMutations,
  ...refreshMutations,
  ...userMutations,
  ...forgotPasswordMutations,
};

export const actions = {
  ...mainActions,
  ...registerActions,
  ...loginActions,
  ...refreshActions,
  ...userActions,
  ...forgotPasswordActions,
};

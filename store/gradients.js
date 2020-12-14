import { $axios } from '~/utils/axios';
const API_URL = process.env.apiUrl;

export const state = () => ({
  paginationMeta: {
    totalItems: 0,
    limit: 0,
    page: 0,
    totalPages: 0,
    pagingCounter: 0,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  },
  gradients: [],
  isFetching: false,
  isCreating: false,
  response: {
    status: 'ok',
    message: 'initial gradients state',
  },
});

const fetchGradientsMutations = {
  FETCH_GRADIENTS_REQUEST(state) {
    state.isFetching = true;
  },
  FETCH_GRADIENTS_SUCCESS(state, payload) {
    state.isFetching = false;
    if (payload.paginate) {
      state.gradients = state.gradients.concat(payload.gradients);
    } else {
      state.gradients = payload.gradients;
    }
    state.paginationMeta = payload.meta;
    state.response = {
      status: 'ok',
      message: `Successful fetched page ${payload.meta.page} of gradients`,
    };
  },
  FETCH_GRADIENTS_FAILURE(state, err) {
    state.isFetching = false;
    state.response = {
      status: 'error',
      message: `Error on fetching gradients: ${err}`,
    };
  },
};

const fetchGradientsActions = {
  async fetchGradients({ commit, rootState }, payload) {
    const token = rootState.auth.token;

    if (!payload.paginate) commit('FETCH_GRADIENTS_REQUEST');

    let page = 1;
    const size = 20;

    if (payload.paginate) page = rootState.gradients.paginationMeta.nextPage;

    try {
      $axios.setToken(token, 'Bearer');

      const { data } = await $axios.$get(
        `${API_URL}/gradients?sort=${payload.sort}&page=${page}&size=${size}`
      );
      const gradients = data.items;
      delete data.items;
      const meta = data;

      commit('FETCH_GRADIENTS_SUCCESS', {
        gradients,
        meta,
        paginate: payload.paginate,
      });
    } catch (e) {
      commit('FETCH_GRADIENTS_FAILURE', e);
    }
  },
};

export const mutations = {
  ...fetchGradientsMutations,
};

export const actions = {
  ...fetchGradientsActions,
};

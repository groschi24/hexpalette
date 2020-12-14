import { $axios } from '~/utils/axios';
const API_URL = process.env.apiUrl;

export const state = () => ({
  paginationMeta: {
    limit: 0,
    page: 0,
    hasNextPage: false,
    nextPage: null,
  },
  collections: [],
  isFetching: false,
  isCreating: false,
  response: {
    status: 'ok',
    message: 'initial collection state',
  },
});

const fetchCollectionsMutations = {
  FETCH_COLLECTIONS_REQUEST(state) {
    state.isFetching = true;
  },
  FETCH_COLLECTIONS_SUCCESS(state, payload) {
    state.isFetching = false;
    if (payload.paginate) {
      state.collections = state.collections.concat(payload.collections);
    } else {
      state.collections = payload.collections;
    }

    state.paginationMeta = payload.meta;
    state.response = {
      status: 'ok',
      message: `Successful fetched page ${payload.meta.page} of collections`,
    };
  },
  FETCH_COLLECTIONS_FAILURE(state, err) {
    state.isFetching = false;
    state.response = {
      status: 'error',
      message: `Error on fetching collections: ${err}`,
    };
  },
};

const fetchCollectionsActions = {
  async fetchCollections({ commit, rootState }, payload) {
    const token = rootState.auth.token;

    if (!payload.paginate) commit('FETCH_COLLECTIONS_REQUEST');

    let page = 1;
    const size = 20;

    if (payload.paginate) page = rootState.collections.paginationMeta.nextPage;

    try {
      $axios.setToken(token, 'Bearer');

      const { data } = await $axios.$get(
        `${API_URL}/collections?page=${page}&size=${size}`
      );
      const collections = data.items;
      delete data.items;
      const meta = data;

      commit('FETCH_COLLECTIONS_SUCCESS', {
        collections,
        meta,
        paginate: payload.paginate,
      });
    } catch (e) {
      commit('FETCH_COLLECTIONS_FAILURE', e);
    }
  },
};

export const mutations = {
  ...fetchCollectionsMutations,
};

export const actions = {
  ...fetchCollectionsActions,
};

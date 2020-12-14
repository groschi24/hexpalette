import { $axios } from '~/utils/axios';
const API_URL = process.env.apiUrl;

export const state = () => ({
  paginationMeta: {
    limit: 0,
    page: 0,
    hasNextPage: false,
    nextPage: null,
  },
  palettes: [],
  isFetching: false,
  isCreating: false,
  response: {
    status: 'ok',
    message: 'initial palette state',
  },
});

const fetchPalettesMutations = {
  FETCH_PALETTES_REQUEST(state) {
    state.isFetching = true;
  },
  FETCH_PALETTES_SUCCESS(state, payload) {
    state.isFetching = false;
    if (payload.paginate) {
      state.palettes = state.palettes.concat(payload.palettes);
    } else {
      state.palettes = payload.palettes;
    }
    state.paginationMeta = payload.meta;
    state.response = {
      status: 'ok',
      message: `Successful fetched page ${payload.meta.page} of palettes`,
    };
  },
  FETCH_PALETTES_FAILURE(state, err) {
    state.isFetching = false;
    state.response = {
      status: 'error',
      message: `Error on fetching palettes: ${err}`,
    };
  },
};

const fetchPalettesActions = {
  async fetchPalettes({ commit, rootState }, payload) {
    const token = rootState.auth.token;

    if (!payload.paginate) commit('FETCH_PALETTES_REQUEST');

    let page = 1;
    const size = 20;
    let search = '';

    if (payload.search) {
      search = payload.search;
    }

    if (payload.paginate) page = rootState.palettes.paginationMeta.nextPage;

    try {
      $axios.setToken(token, 'Bearer');

      const { data } = await $axios.$get(
        `${API_URL}/palettes?sort=${payload.sort}&page=${page}&size=${size}${
          search.length > 0 ? `&search=${search}` : ''
        }`
      );
      const palettes = data.items;
      delete data.items;
      const meta = data;

      commit('FETCH_PALETTES_SUCCESS', {
        palettes,
        meta,
        paginate: payload.paginate,
      });
    } catch (e) {
      commit('FETCH_PALETTES_FAILURE', e);
    }
  },
};

const fetchSavedPalettedMutations = {
  FETCH_SAVED_PALETTES_REQUEST(state) {
    state.isFetching = true;
  },
  FETCH_SAVED_PALETTES_SUCCESS(state, payload) {
    state.isFetching = false;

    const palettes = payload.savedPalettes.map((item) => {
      const palette = item.palette;

      palette.user_saves = {
        user_id: item.user_id,
      };

      return palette;
    });

    if (payload.paginate) {
      state.palettes = state.palettes.concat(palettes);
    } else {
      state.palettes = palettes;
    }
    state.paginationMeta = payload.meta;
    state.response = {
      status: 'ok',
      message: `Successful fetched page ${payload.meta.page} of palettes`,
    };
  },
  FETCH_SAVED_PALETTES_FAILURE(state, err) {
    state.isFetching = false;
    state.response = {
      status: 'error',
      message: `Error on fetching palettes: ${err}`,
    };
  },
};

const fetchSavedPalettedAction = {
  async fetchSavedPalettes({ commit, rootState }, payload) {
    const token = rootState.auth.token;

    if (!payload.paginate) commit('FETCH_SAVED_PALETTES_REQUEST');

    let page = 1;
    const size = 20;

    if (payload.paginate) page = rootState.palettes.paginationMeta.nextPage;

    try {
      $axios.setToken(token, 'Bearer');

      const { data } = await $axios.$get(
        `${API_URL}/palettes/saved?&page=${page}&size=${size}`
      );
      const savedPalettes = data.items;
      delete data.items;
      const meta = data;

      commit('FETCH_SAVED_PALETTES_SUCCESS', {
        savedPalettes,
        meta,
        paginate: payload.paginate,
      });
    } catch (e) {
      commit('FETCH_SAVED_PALETTES_FAILURE', e);
    }
  },
};

const createPaletteMutations = {
  CREATE_PALETTE_REQUEST(state) {
    state.isCreating = true;
  },
  CREATE_PALETTE_SUCCESS(state) {
    state.isCreating = false;
    state.response = {
      status: 'ok',
      message: `Successful created palette`,
    };
  },
  CREATE_PALETTE_FAILURE(state, err) {
    state.isCreating = false;
    state.response = {
      status: 'error',
      message: `Error on creating palette: ${err}`,
    };
  },
};

const createPaletteAction = {
  async createPalette({ commit, rootState }, payload) {
    const token = rootState.auth.token;

    if (token !== '') {
      commit('CREATE_PALETTE_REQUEST');

      try {
        $axios.setToken(token, 'Bearer');

        await $axios.$post(`${API_URL}/palettes`, payload);
        commit('CREATE_PALETTE_SUCCESS');
      } catch (e) {
        commit('FETCH_PALETTES_FAILURE', e);
      }
    } else {
      commit('auth/SHOW_AUTH_MODAL', 'login', { root: true });
    }
  },
};

const savePaletteMutations = {
  SAVE_PALETTE_SUCCESS(state, palette) {
    const paletteIndex = state.palettes.findIndex((x) => x._id === palette._id);

    const clonedPalettes = JSON.parse(JSON.stringify(state.palettes));
    clonedPalettes[paletteIndex] = palette;

    state.palettes = clonedPalettes;
  },
  SAVE_PALETTE_FAILURE(state, err) {
    state.response = {
      status: 'error',
      message: `Error on palette saving: ${err}`,
    };
  },
  REMOVE_SAVE_PALETTE_SUCCESS(state, palette) {
    const paletteIndex = state.palettes.findIndex((x) => x._id === palette._id);

    const clonedPalettes = JSON.parse(JSON.stringify(state.palettes));
    clonedPalettes[paletteIndex] = palette;

    state.palettes = clonedPalettes;
  },
  REMOVE_SAVE_PALETTE_FAILURE(state, err) {
    state.response = {
      status: 'error',
      message: `Error on remove palette saving: ${err}`,
    };
  },
};

const savePaletteActions = {
  async savePalette({ commit, rootState }, paletteId) {
    const token = rootState.auth.token;

    if (token !== '') {
      try {
        $axios.setToken(token, 'Bearer');

        await $axios.$post(`${API_URL}/palettes/${paletteId}`);

        const { data } = await $axios.$get(`${API_URL}/palettes/${paletteId}`);

        commit('SAVE_PALETTE_SUCCESS', data[0]);
      } catch (e) {
        commit('SAVE_PALETTE_FAILURE', e);
      }
    } else {
      commit('auth/SHOW_AUTH_MODAL', 'login', { root: true });
    }
  },
  async removeSavePalette({ commit, rootState }, paletteId) {
    const token = rootState.auth.token;

    if (token !== '') {
      try {
        $axios.setToken(token, 'Bearer');

        await $axios.$patch(`${API_URL}/palettes/${paletteId}`);

        const { data } = await $axios.$get(`${API_URL}/palettes/${paletteId}`);

        commit('REMOVE_SAVE_PALETTE_SUCCESS', data[0]);
      } catch (e) {
        commit('REMOVE_SAVE_PALETTE_FAILURE', e);
      }
    } else {
      commit('auth/SHOW_AUTH_MODAL', 'login', { root: true });
    }
  },
};

export const mutations = {
  ...fetchPalettesMutations,
  ...fetchSavedPalettedMutations,
  ...createPaletteMutations,
  ...savePaletteMutations,
};

export const actions = {
  ...fetchPalettesActions,
  ...fetchSavedPalettedAction,
  ...createPaletteAction,
  ...savePaletteActions,
};

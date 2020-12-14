<template>
  <div class="my-48 md:my-20">
    <div v-if="isLoggedIn">
      <h2 class="text-center text-6xl font-black mb-20">Saved Palettes</h2>

      <div class="flex flex-col">
        <div class="w-full">
          <div v-if="isFetching" class="flex flex-wrap justify-center">
            <div class="palettes-loader">
              <!-- LOADING INDICATOR -->
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#333"
              >
                <g fill="none" fill-rule="evenodd">
                  <g transform="translate(1 1)" stroke-width="2">
                    <circle stroke-opacity=".1" cx="18" cy="18" r="18" />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                </g>
              </svg>
              <!-- END LOADING INDICATOR -->
            </div>
          </div>
          <div
            v-else-if="response.status === 'error'"
            class="flex flex-wrap justify-center"
          >
            <div class="error">
              <pre>{{ response }}</pre>
              <span>Oops something went wrong!</span>
              <b-button @click="handleFetchSavedPalettes(false)"
                >Try Again</b-button
              >
            </div>
          </div>
          <div v-else>
            <div
              v-if="fetchedPalettes.length > 0"
              class="flex flex-wrap justify-center"
            >
              <client-only>
                <div v-for="(item, i) in fetchedPalettes" :key="i">
                  <Palette
                    :palette="item"
                    :open-palette-modal="openPaletteModal"
                  />
                </div>
              </client-only>
            </div>
            <div v-else class="flex flex-wrap justify-center">
              <p>Nothing found</p>
            </div>
            <div v-if="paletteMeta.hasNextPage && finishLoading" class="mt-4">
              <infinite-loading
                ref="infinteloading"
                spinner="spiral"
                @infinite="infiniteScroll"
              ></infinite-loading>
            </div>
          </div>
        </div>
      </div>

      <PaletteModal
        v-show="paletteModalOpen"
        :colors="selectedColors"
        @close="hidePaletteModal"
      />
    </div>
    <div v-else>
      <p>Not Logged In</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const Palette = () => import('~/components/Palette/Palette');

export default {
  comtpontes: {
    Palette,
  },
  data() {
    return {
      finishLoading: false,
      paletteModalOpen: false,
      selectedColors: [],
      // fetchedPalettes: [],
    };
  },
  head() {
    return {
      title: 'Hexpalette - Your saved palettes',
    };
  },
  computed: {
    fetchedPalettes() {
      return this.$store.state.palettes.palettes;
    },
    isFetching() {
      return this.$store.state.palettes.isFetching;
    },
    paletteMeta() {
      return this.$store.state.palettes.paginationMeta;
    },
    response() {
      return this.$store.state.palettes.response;
    },
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn;
    },
  },
  watch: {
    isLoggedIn() {
      this.handleFetchSavedPalettes(false);
    },
    paletteMeta(newPaletteMeta, oldPaletteMeta) {
      if (newPaletteMeta.hasNextPage) {
        this.$refs.infinteloading &&
          this.$refs.infinteloading.stateChanger.loaded();
      } else {
        this.$refs.infinteloading &&
          this.$refs.infinteloading.stateChanger.complete();
      }
    },
    /*
      This fixes error on production for client-side infinte loading
      - DOMException: Failed to execute 'appendChild' on 'Node': This node type does not support this method.
    */
    fetchedPalettes(newFetchedSavedPalettes, oldFetchedSavedPalettes) {
      this.finishLoading = true;
    },
  },
  mounted() {
    this.handleFetchSavedPalettes(false);
  },
  methods: {
    handleFetchSavedPalettes(paginate) {
      if (this.isLoggedIn) {
        this.fetchSavedPalettes({
          paginate,
        });
      }
    },
    openPaletteModal(colors) {
      this.selectedColors = colors;
      this.paletteModalOpen = true;
    },
    hidePaletteModal() {
      this.paletteModalOpen = false;
    },
    infiniteScroll($state) {
      console.log('Next');
      this.handleFetchSavedPalettes(true);
    },
    ...mapActions({
      fetchSavedPalettes: 'palettes/fetchSavedPalettes',
    }),
  },
};
</script>

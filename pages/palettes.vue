<template>
  <div class="my-48 mt-64 md:mt-48 md:my-40">
    <div class="flex flex-col">
      <!-- FILTERS -->
      <div
        class="bg-white dark:bg-gray-800 flex flex-wrap w-full border-b border-solid border-gray-300 dark:border-gray-700 fixed top-0 left-0 right-0 mt-16 max-w-7xl py-4 mx-auto px-4 sm:px-6 lg:px-8 justify-center"
        :style="{ 'z-index': '999' }"
      >
        <div class="flex w-full md:w-1/2 items-center overflow-y-auto">
          <span class="mr-2">Filters:</span>
          <div v-for="(tag, index) in searchTags" :key="tag + index">
            <div
              class="mr-2 mx-1 text-xs inline-flex items-center font-bold leading-sm px-2 py-1 rounded-lg bg-transparent text-black dark:text-white border"
            >
              <a class="cursor-pointer mr-1" @click="removeSearchTag(index)">
                <CloseIcon class="w-3 h-3" />
              </a>
              {{ tag }}
            </div>
          </div>
        </div>
        <div
          class="flex flex-wrap md:flex-no-wrap md:flex-initial w-full md:w-1/2 justify-end"
        >
          <AutocompleteInput
            v-model="searchSelected"
            :options="options"
            :search="search"
            :add-search-tag="addSearchTag"
            @search="(newSearchText) => (search = newSearchText)"
          />

          <div class="flex w-full justify-between mt-4 md:mt-0">
            <a
              class="transition duration-100 ease-in-out flex flex-row items-center h-10 px-2 md:px-4 rounded-lg border-gray-300 dark:border-white hover:bg-gray-900 dark-hover:bg-white hover:text-white dark-hover:text-black border-solid border cursor-pointer select-none"
              :class="
                currentType === 'popular' &&
                'bg-gray-900 dark:bg-white text-white dark:text-black'
              "
              @click="changeType('popular')"
            >
              <span class="flex items-center justify-center text-lg">
                <StarIcon class="w-5 h-5" />
              </span>
              <span class="ml-3">Popular</span>
            </a>
            <a
              class="transition duration-100 ease-in-out mx-2 flex flex-row items-center h-10 px-2 md:px-4 rounded-lg border-gray-300 dark:border-white hover:bg-gray-900 dark-hover:bg-white hover:text-white dark-hover:text-black border-solid border cursor-pointer select-none"
              :class="
                currentType === 'new' &&
                'bg-gray-900 dark:bg-white text-white dark:text-black'
              "
              @click="changeType('new')"
            >
              <span class="flex items-center justify-center text-lg">
                <ClockIcon class="w-5 h-5" />
              </span>
              <span class="ml-3">New</span>
            </a>
            <a
              class="transition duration-100 ease-in-out flex flex-row items-center h-10 px-2 md:px-4 rounded-lg border-gray-300 dark:border-white hover:bg-gray-900 dark-hover:bg-white hover:text-white dark-hover:text-black border-solid border cursor-pointer select-none"
              :class="
                currentType === 'random' &&
                'bg-gray-900 dark:bg-white text-white dark:text-black'
              "
              @click="changeType('random')"
            >
              <span class="flex items-center justify-center text-lg">
                <RandomIcon class="w-5 h-5" />
              </span>
              <span class="ml-3">Random</span>
            </a>
          </div>
        </div>
      </div>
      <!-- END FILTERS -->
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
          class="flex flex-wrap justify-center mt-6"
        >
          <div class="error">
            <span>Oops something went wrong!</span>

            <span
              class="transition duration-100 ease-in-out my-4 mx-auto w-3/4 py-3 rounded-lg border-gray-900 dark:border-white hover:bg-gray-900 dark-hover:bg-white hover:text-white dark-hover:text-black border-solid border-2 flex items-center justify-center cursor-pointer"
              @click="fetchPalettes(currentType.toLowerCase())"
            >
              Try Again
            </span>
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
</template>

<script>
import { mapActions } from 'vuex';

const AutocompleteInput = () =>
  import('~/components/AutocompleteInput/AutocompleteInput');
const Palette = () => import('~/components/Palette/Palette');

const StarIcon = () => import('~/components/Icons/StarIcon');
const ClockIcon = () => import('~/components/Icons/ClockIcon');
const RandomIcon = () => import('~/components/Icons/RandomIcon');

export default {
  comtpontes: {
    AutocompleteInput,
    Palette,
    StarIcon,
    ClockIcon,
    RandomIcon,
  },
  data() {
    return {
      currentType: 'popular',
      finishLoading: false,
      paletteModalOpen: false,
      selectedColors: [],
      searchSelected: null,
      search: '',
      searchTags: [],
      colorOptions: [
        {
          name: 'Red',
          color: '#ea5455',
        },
        {
          name: 'Blue',
          color: '#0779e4',
        },
        {
          name: 'Green',
          color: '#28df99',
        },
        {
          name: 'Yellow',
          color: '#fddb3a',
        },
        {
          name: 'Orange',
          color: '#f08a5d',
        },
        {
          name: 'Purple',
          color: '#9d65c9',
        },
        {
          name: 'Turquoise',
          color: '#32e0c4',
        },
        {
          name: 'Pink',
          color: '#f54291',
        },
        {
          name: 'Sky',
          color: '#d9ecf2',
        },
        {
          name: 'Space',
          color: '#27496d',
        },
      ],
    };
  },
  head() {
    return {
      title: 'Hexpalette - Discover tons of color palettes',
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
    options() {
      return this.colorOptions.filter((option) =>
        option.name.toLowerCase().startsWith(this.search.toLowerCase())
      );
    },
  },
  watch: {
    isLoggedIn(newIsLoggedIn, oldIsLoggedIn) {
      this.fetchPalettes({
        sort: this.currentType.toLowerCase(),
        paginate: false,
        search: this.searchTags.length > 0 ? this.searchTags.join(' ') : '',
      });
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
    fetchedPalettes() {
      this.finishLoading = true;
    },
  },
  mounted() {
    if (this.$route.query.type) {
      const queryType = this.$route.query.type;
      const searchString = this.$route.query.s;

      if (searchString) {
        this.searchTags = searchString.split(' ');
      }

      if (
        queryType.toLowerCase() === 'new' ||
        queryType.toLowerCase() === 'popular' ||
        queryType.toLowerCase() === 'random'
      ) {
        this.currentType = queryType;
      } else {
        this.currentType = 'popular';
      }
    } else {
      this.currentType = 'popular';
    }

    this.fetchPalettes({
      sort: this.currentType.toLowerCase(),
      paginate: false,
      search: this.searchTags.length > 0 ? this.searchTags.join(' ') : '',
    });
  },
  methods: {
    addSearchTag() {
      this.$ga.event('Palettes', 'add search tag');
      const cloneSearchTags = JSON.parse(JSON.stringify(this.searchTags));

      if (this.search.length < 3) {
        this.$toast.open({
          type: 'warning',
          message: `Need minimum of 3 Characters`,
          duration: 800,
          position: 'top',
        });
      }

      if (this.searchTags.includes(this.search)) {
        this.$toast.open({
          type: 'warning',
          message: `Already searchning for this`,
          duration: 800,
          position: 'top',
        });
      }

      const length = this.search.length + this.searchTags.join(' ').length;

      if (length > 254) {
        this.$toast.open({
          type: 'warning',
          message: `Search getting to long`,
          duration: 800,
          position: 'top',
        });
      }

      if (
        this.search.length > 2 &&
        !this.searchTags.includes(this.search) &&
        length < 255
      ) {
        this.search.split(' ').forEach((tag) => {
          if (!cloneSearchTags.includes(tag)) {
            cloneSearchTags.push(tag);
          }
        });

        this.searchTags = cloneSearchTags;

        this.fetchPalettes({
          sort: this.currentType.toLowerCase(),
          search: this.searchTags.length > 0 ? this.searchTags.join(' ') : '',
          paginate: false,
        });

        this.$router.push({
          path: this.$route.path,
          query: {
            type: this.currentType,
            s: this.searchTags.length > 0 ? this.searchTags.join(' ') : '',
          },
        });

        this.search = '';
      }
    },
    removeSearchTag(index) {
      this.$ga.event('Palettes', 'remove search tag');
      const cloneSearchTags = JSON.parse(JSON.stringify(this.searchTags));

      if (this.searchTags.length > 0) {
        cloneSearchTags.splice(index, 1);

        this.searchTags = cloneSearchTags;

        this.fetchPalettes({
          sort: this.currentType.toLowerCase(),
          search: this.searchTags.length > 0 ? this.searchTags.join(' ') : '',
          paginate: false,
        });

        this.$router.push({
          path: this.$route.path,
          query: {
            type: this.currentType,
            s: this.searchTags.length > 0 ? this.searchTags.join(' ') : '',
          },
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
    changeType(type) {
      this.$ga.event('Palettes', 'change type', 'type', type);
      this.currentType = type;
      this.fetchPalettes({
        sort: this.currentType.toLowerCase(),
        paginate: false,
        search: this.searchTags.length > 0 ? this.searchTags.join(' ') : '',
      });

      const query = type.toLowerCase();
      this.$router.push({
        path: this.$route.path,
        query: {
          type: query,
          s: this.searchTags.length > 0 ? this.searchTags.join(' ') : '',
        },
      });
    },
    infiniteScroll($state) {
      this.$ga.event('Palettes', 'fetch next');
      this.fetchPalettes({
        sort: this.currentType.toLowerCase(),
        paginate: true,
        search: this.searchTags.length > 0 ? this.searchTags.join(' ') : '',
      });
    },
    ...mapActions({
      fetchPalettes: 'palettes/fetchPalettes',
    }),
  },
};
</script>

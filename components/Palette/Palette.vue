<template>
  <div
    class="m-2 bg-white dark:bg-gray-900 rounded-lg"
    :style="{ 'min-width': '350px', 'flex-basis': '350px' }"
  >
    <div class="flex h-48 relative rounded-t-lg overflow-hidden">
      <div
        v-for="(color, i) in palette.colors"
        :key="i"
        :style="{ ['background-color']: color.hex }"
        class="flex-1 h-full hover-flex-2 cursor-pointer"
        @click="copyHex(color.hex)"
      >
        <div class="palette-color-hex">
          <span class="text-white"> {{ color.hex }} </span>
        </div>
      </div>
    </div>
    <div
      class="px-4 py-2 flex justify-between items-center border-solid border-b border-l border-r border-gray-300 dark:border-transparent rounded-b-lg"
    >
      <div>
        <p class="text-gray-600 text-sm flex items-center my-1">
          <BookmarkIcon
            class="fill-current"
            :class="
              palette.user_saves &&
              (palette.user_saves.length > 0 ||
                (typeof palette.user_saves === 'object' &&
                  palette.user_saves.user_id === user.id))
                ? ' text-primary'
                : 'text-gray-600 '
            "
            :style="{ width: '18px', height: '18px' }"
          />
          {{ palette.saves }}
        </p>
        <p class="text-gray-600 text-xs my-1">created {{ time }}</p>
      </div>
      <div>
        <Dropdown>
          <template v-slot:toggle-button>
            <HorizontalDotsIcon />
          </template>
          <span
            class="block px-4 py-2 text-sm leading-5 text-gray-600 hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            @click="openGenerator"
          >
            Open in generator
          </span>
          <span
            class="block px-4 py-2 text-sm leading-5 text-gray-600 hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            @click="copyURL"
          >
            Copy URL
          </span>
          <span
            class="block px-4 py-2 text-sm leading-5 text-gray-600 hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            @click="openPalette"
          >
            Open Palette
          </span>
          <span
            v-if="
              palette.user_saves &&
              (palette.user_saves.length > 0 ||
                (typeof palette.user_saves === 'object' &&
                  palette.user_saves.user_id === user.id))
            "
            class="block px-4 py-2 text-sm leading-5 text-gray-600 hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            @click="removeSavePalette"
          >
            Unsave Palette
          </span>
          <span
            v-else
            class="block px-4 py-2 text-sm leading-5 text-gray-600 hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            @click="savePalette"
          >
            Save Palette
          </span>
        </Dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const HorizontalDotsIcon = () =>
  import('~/components/Icons/HorizontalDotsIcon');
const BookmarkIcon = () => import('~/components/Icons/BookmarkIcon');
const Dropdown = () => import('~/components/Dropdown/Dropdown');

export default {
  comtpontes: {
    HorizontalDotsIcon,
    BookmarkIcon,
    Dropdown,
  },
  props: {
    palette: {
      type: Object,
      default: undefined,
    },
    openPaletteModal: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    time() {
      const paletteTime = this.$moment(this.palette.createdAt).format(
        'YYYY-MM-DD HH:mm:ss'
      );

      const diff = this.$moment(paletteTime).fromNow();
      return diff;
    },
    user() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    copyHex(hex) {
      this.$ga.event('Palette', 'copy hex');
      navigator.clipboard.writeText(hex);

      this.$toast.open({
        type: 'default',
        message: `${hex.toUpperCase()} copied`,
        duration: 500,
        position: 'top',
      });
    },
    testActionClick() {
      // eslint-disable-next-line
      console.log('action');
    },
    openGenerator() {
      this.$ga.event('Palette', 'open generator');
      let query = '';
      this.palette.colors.forEach((color, index) => {
        if (index !== 0) {
          query += '-';
        }
        query += color.hex.substring(1);
      });

      this.$router.push({
        path: '/generator',
        query: { colors: query },
      });
    },
    copyURL() {
      this.$ga.event('Palette', 'copy url');
      let query = '';
      this.palette.colors.forEach((color, index) => {
        if (index !== 0) {
          query += '-';
        }
        query += color.hex.substring(1);
      });

      const url = `https://hexpalette.com/palette?colors=${query}`;
      navigator.clipboard.writeText(url);

      this.$toast.open({
        type: 'default',
        message: 'URL copied',
        duration: 500,
        position: 'top',
      });
    },
    openPalette() {
      this.$ga.event('Palette', 'open palette');
      this.openPaletteModal(this.palette.colors);
    },
    savePalette() {
      this.$ga.event('Palette', 'save palette');
      this.store_savePalette(this.palette._id);
    },
    removeSavePalette() {
      this.$ga.event('Palette', 'unsave palette');
      this.store_removeSavePalette(this.palette._id);
    },
    ...mapActions({
      store_removeSavePalette: 'palettes/removeSavePalette',
      store_savePalette: 'palettes/savePalette',
    }),
  },
};
</script>

<style>
.hover-flex-2 {
  transition: all 0.1s ease-in-out;
}
.hover-flex-2:hover {
  flex: 2.5;
}

.hover-flex-2:hover .palette-color-hex {
  opacity: 1;
}

.palette-color-hex {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 10px;
  padding: 2px 7px;
  opacity: 0;
  transition: all 0.25s;
}

.palette-color-hex span {
  margin: 0 auto;
  text-transform: uppercase;
  font-weight: bold;
}
</style>

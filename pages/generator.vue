<template>
  <div class="flex flex-col overflow-hidden height-100">
    <div class="flex w-full height-100">
      <!-- COLORS -->
      <DraggableColors
        :colors="colors"
        :select-color="selectColor"
        :selected-index="selectedIndex"
        :show-history="showHistory"
        :edit-state="editState"
        :change-color="changeColor"
        :edit-dropdown-toggled="editDropdownToggled"
        :change-shade="changeShade"
        :set-seleted-index="setSeletedIndex"
        :shades-open="shadesOpen"
        :set-shades-open="setShadesOpen"
        :lock-colors="lockColors"
        :remove-color="removeColor"
      />
      <!-- END COLORS -->
      <!-- HISTORY SIDEBAR -->
      <div
        class="sidebar has-transition block w-full md:w-64 px-4 py-24 overflow-y-auto bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 border-solid border-l"
        :class="showHistory && 'active'"
      >
        <h3 class="font-bold text-sm text-black dark:text-white">History</h3>
        <div
          v-for="(history, index) in colorsHistory"
          :key="index"
          class="w-full h-32 flex rounded-lg overflow-hidden my-2 border-2 border-solid cursor-pointer"
          :class="
            historyIndex === index
              ? 'border-black dark:border-white'
              : 'border-transparent'
          "
          @click="setHistoryIndex(index)"
        >
          <div
            v-for="(color, hindex) in history"
            :key="hindex"
            class="flex-1"
            :style="{ 'background-color': color.hex }"
          />
        </div>
      </div>
      <!-- END HISTORY SIDEBAR -->
    </div>
    <!-- FOOTER -->
    <div
      id="generator-footer"
      class="w-full bg-white dark:bg-gray-800 h-16 flex justify-between py-3 px-2 md:px-4 border-gray-300 dark:border-gray-700 border-solid border-t z-50"
    >
      <div class="flex">
        <a
          class="transition duration-100 ease-in-out mx-px md:mx-1 flex flex-row items-center h-10 px-1 md:px-2 cursor-pointer select-none text-sm md:text-base"
          @click="generateColors"
        >
          <GenerateIcon class="w-5 h-5 md:w-6 md:h-6" />
          <span class="ml-1">Generate</span>
        </a>
        <a
          class="transition duration-100 ease-in-out mx-px md:mx-1 flex flex-row items-center h-10 px-1 md:px-2 cursor-pointer select-none text-sm md:text-base"
          @click="addColor"
        >
          <PlusIcon class="w-5 h-5 md:w-6 md:h-6" />
          <span class="ml-1">Add</span>
        </a>
        <a
          class="transition duration-100 ease-in-out mx-px md:mx-1 flex flex-row items-center h-10 px-1 md:px-2 cursor-pointer select-none text-sm md:text-base"
          :disabled="paletteCreating"
          @click="openSaveModal"
        >
          <BookmarkIcon class="w-5 h-5 md:w-6 md:h-6" />
          <span class="ml-1">Save</span>
        </a>
      </div>
      <div class="flex">
        <a
          class="transition duration-100 ease-in-out mx-1 flex flex-row items-center h-10 px-1 md:px-2 cursor-pointer select-none"
          @click="changeHistory(false)"
        >
          <ArrowLeftIcon class="w-5 h-5 md:w-6 md:h-6" />
        </a>
        <a
          class="transition duration-100 ease-in-out mx-1 flex flex-row items-center h-10 px-1 md:px-2 cursor-pointer select-none"
          @click="changeHistory(true)"
        >
          <ArrowRightIcon class="w-5 h-5 md:w-6 md:h-6" />
        </a>
        <a
          class="flex transition duration-100 ease-in-out mx-1 flex-row items-center h-10 px-2 md:px-4 cursor-pointer select-none"
          @click="toggleHistory()"
        >
          <div v-if="showHistory">
            <CloseIcon class="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div v-else>
            <BurgerIcon class="w-5 h-5 md:w-6 md:h-6" />
          </div>
        </a>
      </div>
    </div>
    <!-- END FOOTER -->

    <SaveModal v-show="saveModalOpen" :colors="colors" @close="hideSaveModal" />
  </div>
</template>

<script>
import Color from 'color';
import randomColor from 'randomcolor';

import { mapMutations } from 'vuex';

import { shadeColor } from '~/utils/generator';

const DraggableColors = () =>
  import('~/components/DraggableColors/DraggableColors');
const EditDropdown = () => import('~/components/Dropdown/EditDropdown');
const SaveModal = () => import('~/components/SaveModal/SaveModal');

const GenerateIcon = () => import('~/components/Icons/GenerateIcon');
const PlusIcon = () => import('~/components/Icons/PlusIcon');
const BookmarkIcon = () => import('~/components/Icons/BookmarkIcon');
const ArrowLeftIcon = () => import('~/components/Icons/ArrowLeftIcon');
const ArrowRightIcon = () => import('~/components/Icons/ArrowRightIcon');
const BurgerIcon = () => import('~/components/Icons/BurgerIcon');
const CloseIcon = () => import('~/components/Icons/CloseIcon');

export default {
  comtpontes: {
    DraggableColors,
    EditDropdown,
    SaveModal,
    GenerateIcon,
    PlusIcon,
    BookmarkIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    BurgerIcon,
    CloseIcon,
  },
  data() {
    return {
      selectedIndex: 0,
      colors: [],
      colorsHistory: [],
      editingColors: [],
      historyIndex: 0,
      changedHistroy: false,
      showHistory: false,
      saveModalOpen: false,
      editState: {},
      shadesOpen: false,
    };
  },
  computed: {
    paletteCreating() {
      return this.$store.state.palettes.isCreating;
    },
    response() {
      return this.$store.state.palettes.response;
    },
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn;
    },
  },
  watch: {
    paletteCreating(newPaletteCreating, oldPaletteCreating) {
      if (this.response.status === 'error') {
        this.$toast.open({
          type: 'default',
          message: 'Something went wrong on creation',
          duration: 1250,
          position: 'top',
        });
      } else if (oldPaletteCreating && !newPaletteCreating) {
        this.$ga.event('Generator', 'created palette');
        this.$toast.open({
          type: 'success',
          message: 'Palette successful created and saved',
          duration: 1250,
          position: 'top',
        });
      }
    },
    colors(newColors, oldColors) {
      this.shadesOpen = false;
      if (this.editState[this.selectedIndex]) {
        this.editingColors = JSON.parse(JSON.stringify(this.colors));
      } else {
        if (
          JSON.stringify(newColors).toLowerCase() !==
          JSON.stringify(oldColors).toLowerCase()
        ) {
          if (!this.changedHistroy) {
            this.colorsHistory.unshift(newColors);

            this.historyIndex = 0;
          }

          this.updateQuery();
        }
        this.changedHistroy = false;
      }
    },
    editState(oldEditState, newEditState) {
      Object.keys(newEditState).forEach((key) => {
        if (
          newEditState[key] &&
          this.editingColors.length > 0 &&
          JSON.stringify(this.editingColors).toLowerCase() !==
            JSON.stringify(this.colorsHistory[0]).toLowerCase()
        ) {
          this.colorsHistory.unshift(
            JSON.parse(JSON.stringify(this.editingColors))
          );

          this.historyIndex = 0;
          this.updateQuery();
        }
      });
    },
  },
  mounted() {
    if (this.$route.query.colors) {
      const queryColors = this.$route.query.colors.split('-');
      if (queryColors.length >= 3) {
        queryColors.forEach((queryColor) => {
          const testHex = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(queryColor);
          if (testHex) {
            const hexCode = Color('#' + queryColor);

            this.colors.push({
              id: this.colors.length,
              locked: false,
              hex: hexCode.hex(),
              originalHex: hexCode.hex(),
            });
          } else {
            this.colors.push({
              id: this.colors.length,
              locked: false,
              hex: '#000000',
              originalHex: '#000000',
            });
          }
        });

        this.colorsHistory.unshift(this.colors);

        return;
      }
    }

    this.colors = [
      {
        id: 0,
        locked: false,
        hex: '#333333',
        originalHex: '#333333',
      },
      {
        id: 1,
        locked: false,
        hex: '#555555',
        originalHex: '#555555',
      },
      {
        id: 2,
        locked: false,
        hex: '#888888',
        originalHex: '#888888',
      },
      {
        id: 3,
        locked: false,
        hex: '#dddddd',
        originalHex: '#dddddd',
      },
    ];

    this.generateColors();
  },
  methods: {
    setSeletedIndex(index) {
      this.selectedIndex = index;
    },
    setShadesOpen(state) {
      this.shadesOpen = state;
    },
    editDropdownToggled(index, state) {
      const cloneState = JSON.parse(JSON.stringify(this.editState));

      cloneState[index] = state;
      if (state) {
        this.selectColor(index);
      }

      this.editState = cloneState;
    },
    hideSaveModal() {
      this.saveModalOpen = false;
    },
    openSaveModal() {
      if (this.isLoggedIn) {
        this.saveModalOpen = true;
      } else {
        this.showAuthModal('login');
      }
    },
    generateColors() {
      this.$ga.event('Generator', 'generate colors');
      const cloneColors = JSON.parse(JSON.stringify(this.colors));
      cloneColors.forEach((color) => {
        if (!color.locked) {
          const ranColor = randomColor();
          color.hex = ranColor;
          color.originalHex = ranColor;
        }
      });

      if (this.historyIndex > 0) {
        this.colorsHistory = this.colorsHistory.slice(this.historyIndex);
        this.historyIndex = 0;
      }

      this.colors = cloneColors;
    },
    changeColor(color) {
      const cloneColors = JSON.parse(JSON.stringify(this.colors));

      cloneColors[this.selectedIndex].hex = color.hex;
      cloneColors[this.selectedIndex].originalHex = color.hex;

      this.colors = cloneColors;
    },
    isLightColor(hex) {
      const color = Color(hex);
      return color.isLight();
    },
    toggleHistory() {
      this.showHistory = !this.showHistory;
    },
    changeHistory(isNext) {
      if (isNext && this.historyIndex > 0) {
        this.historyIndex -= 1;
        this.changedHistroy = true;
      } else if (!isNext && this.historyIndex < this.colorsHistory.length - 1) {
        this.historyIndex += 1;
        this.changedHistroy = true;
      }

      this.colors = this.colorsHistory[this.historyIndex];
    },
    setHistoryIndex(index) {
      if (index !== this.historyIndex) {
        this.historyIndex = index;
        this.changedHistroy = true;
        this.colors = this.colorsHistory[this.historyIndex];
      }
    },
    updateQuery() {
      let query = '';
      this.colors.forEach((color, index) => {
        if (index !== 0) {
          query += '-';
        }
        query += color.hex.substring(1);
      });

      this.$router.push({
        path: this.$route.path,
        query: { colors: query.toLowerCase() },
      });
    },
    selectColor(index) {
      if (index !== this.selectedIndex) {
        this.selectedIndex = index;
      }
    },
    lockColors(index) {
      this.colors[index].locked = !this.colors[index].locked;
    },
    addColor() {
      this.$ga.event('Generator', 'add color');
      const newColor = {
        id: this.colors.length,
        locked: false,
        hex: shadeColor(this.colors[this.colors.length - 1].hex, 30),
        originalHex: shadeColor(this.colors[this.colors.length - 1].hex, 30),
      };

      const cloneColors = JSON.parse(JSON.stringify(this.colors));

      if (this.colors.length < 10) {
        cloneColors.push(newColor);

        this.colors = cloneColors;
      }
    },
    removeColor(index) {
      this.$ga.event('Generator', 'remove color');
      const cloneColors = JSON.parse(JSON.stringify(this.colors));

      if (this.colors.length > 3) {
        cloneColors.splice(index, 1);

        this.colors = cloneColors;
      }
    },
    changeShade(shade, shadesOpen) {
      const cloneColors = JSON.parse(JSON.stringify(this.colors));
      cloneColors[this.selectedIndex].hex = shade;
      shadesOpen = false;

      this.colors = cloneColors;
    },
    ...mapMutations({
      showAuthModal: 'auth/SHOW_AUTH_MODAL',
    }),
  },
  head() {
    return {
      title: 'Hexpalette - Generate new color palettes',
      bodyAttrs: {
        class: 'disable-scroll',
      },
    };
  },
};
</script>

<style>
.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  transform: translate3d(100%, 0, 0);
}

.sidebar.active {
  transform: none;
}

.editfield {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.editfield.active {
  opacity: 1;
  transform: none;
}

.has-transition {
  transition: transform 0.3s ease, padding 0.3s ease;
}
</style>

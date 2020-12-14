<template>
  <draggable
    tag="ul"
    id="draggable-colors"
    class="h-full w-full pt-16 has-transition"
    :class="showHistory && 'md:pr-64'"
    ghost-class="moving-card"
    :list="colors"
    :animation="200"
    handle=".handle"
  >
    <li
      v-for="(color, index) in colors"
      :key="index"
      :color="color"
      class="w-full h-full relative"
      :style="{
        height: `${100 / colors.length}%`,
      }"
    >
      <div
        class="w-full h-full flex items-center justify-between px-4 md:px-12"
        :style="{
          'background-color': color.hex,
        }"
      >
        <DraggableIcon
          class="w-8 h-8 handle cursor-move opacity-75"
          :class="isLightColor(color.hex) ? 'text-black' : 'text-white'"
        />
        <p
          class="text-base font-semibold opacity-75 uppercase"
          :class="isLightColor(color.hex) ? 'text-black' : 'text-white'"
        >
          {{ color.hex }}
        </p>
        <div class="flex justify-center items-center gap-4">
          <!-- EDIT PENCIL -->
          <EditDropdown
            :toggle-callback="onDropdownToggle"
            :color-index="index"
          >
            <template v-slot:toggle-button>
              <PenIcon
                class="w-6 h-6 cursor-pointer opacity-75 hidden md:block"
                :class="isLightColor(color.hex) ? 'text-black' : 'text-white'"
              />
            </template>
            <div>
              <chrome-picker :value="colors[index].hex" @input="colorInput" />
            </div>
          </EditDropdown>

          <!-- OPEN SHADES -->
          <div @click="openShades(index)">
            <ShadesIcon
              class="w-6 h-6 cursor-pointer opacity-75 hidden md:block"
              :class="isLightColor(color.hex) ? 'text-black' : 'text-white'"
            />
          </div>

          <!-- OPEN LOCK -->
          <div v-if="!color.locked" @click="onLockColors(index)">
            <LockIcon
              class="w-6 h-6 cursor-pointer opacity-75"
              :class="isLightColor(color.hex) ? 'text-black' : 'text-white'"
            />
          </div>
          <!-- CLOSED LOCK -->
          <div v-else @click="onLockColors(index)">
            <CloseLockIcon
              class="w-6 h-6 cursor-pointer opacity-75"
              :class="isLightColor(color.hex) ? 'text-black' : 'text-white'"
            />
          </div>
          <!-- REMOVE X -->
          <div @click="onRemoveColor(index)">
            <CloseIcon
              class="w-6 h-6 cursor-pointer opacity-75"
              :class="isLightColor(color.hex) ? 'text-black' : 'text-white'"
            />
          </div>
        </div>
      </div>
      <!-- SHADE LIST -->
      <div
        v-if="isShading(index)"
        class="absolute top-0 left-0 right-0 bottom-0 hidden md:flex w-full"
      >
        <div
          v-for="(shadeColor, shadeindex) in getShades()"
          :key="shadeindex"
          class="flex-1 cursor-pointer flex items-center justify-center border-2 border-solid border-transparent"
          :class="
            color.hex === shadeColor &&
            `${isLightColor(shadeColor) ? 'border-black' : 'border-white'}`
          "
          :style="{ 'background-color': shadeColor }"
          @click="changeShade(shadeColor)"
        >
          <span
            class="opacity-75 text-sm font-bold"
            :class="isLightColor(shadeColor) ? 'text-black' : 'text-white'"
            >{{ shadeColor }}</span
          >
        </div>
      </div>
      <!-- END SHADE LIST -->
    </li>
  </draggable>
</template>

<script>
import Color from 'color';

import { shadeColor } from '~/utils/generator';

const DraggableIcon = () => import('~/components/Icons/DraggableIcon');
const PenIcon = () => import('~/components/Icons/PenIcon');
const ShadesIcon = () => import('~/components/Icons/ShadesIcon');
const LockIcon = () => import('~/components/Icons/LockIcon');
const CloseLockIcon = () => import('~/components/Icons/CloseLockIcon');
const CloseIcon = () => import('~/components/Icons/CloseIcon');

export default {
  components: {
    DraggableIcon,
    PenIcon,
    ShadesIcon,
    LockIcon,
    CloseLockIcon,
    CloseIcon,
  },
  props: {
    colors: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selectedIndex: {
      type: Number,
      default: 0,
    },
    showHistory: {
      type: Boolean,
    },
    shadesOpen: {
      type: Boolean,
    },
    editState: {
      type: Object,
      default: () => {
        return {};
      },
    },
    selectColor: {
      type: Function,
      default: () => {},
    },
    changeColor: {
      type: Function,
      default: () => {},
    },
    editDropdownToggled: {
      type: Function,
      default: () => {},
    },
    changeShade: {
      type: Function,
      default: () => {},
    },
    setSeletedIndex: {
      type: Function,
      default: () => {},
    },
    setShadesOpen: {
      type: Function,
      default: () => {},
    },
    lockColors: {
      type: Function,
      default: () => {},
    },
    removeColor: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    isLightColor(hex) {
      const color = Color(hex);
      return color.isLight();
    },
    colorInput(color) {
      this.changeColor(color);
    },
    onDropdownToggle(index, state) {
      this.editDropdownToggled(index, state);
    },
    onLockColors(index) {
      this.lockColors(index);
    },
    onRemoveColor(index) {
      this.removeColor(index);
    },
    // SHADING
    isShading(index) {
      if (index === this.selectedIndex && this.shadesOpen) {
        return true;
      } else {
        return false;
      }
    },
    openShades(index) {
      if (this.selectedIndex !== index && this.shadesOpen) {
        this.setSeletedIndex(index);
      } else {
        this.setShadesOpen(!this.shadesOpen);
        this.setSeletedIndex(index);
      }
    },
    getShades() {
      if (this.colors.length > 0) {
        let hexColor = this.colors[this.selectedIndex].originalHex;
        if (hexColor.length === 4) {
          hexColor = '#' + hexColor.substring(1) + hexColor.substring(1);
        }
        let shadeResult = [hexColor];

        const lightenColors = [];
        let isWhite = false;
        let count = 0;

        while (!isWhite && count < 50) {
          const shadedColorHex = shadeColor(
            lightenColors.length <= 0
              ? shadeResult[0]
              : lightenColors[lightenColors.length - 1],
            30
          );
          const shadedColor = Color(shadedColorHex);

          if (shadedColor.luminosity() >= 0.99) {
            isWhite = true;
            if (hexColor !== shadedColorHex) {
              lightenColors.push(shadedColorHex);
            }
          } else {
            lightenColors.push(shadedColorHex);
          }

          count++;
        }

        shadeResult = shadeResult.concat(lightenColors);
        shadeResult = shadeResult.reverse();

        const darkenColors = [];
        let isBlack = false;
        count = 0;

        while (!isBlack && count < 50) {
          const shadedColorHex = shadeColor(
            darkenColors.length <= 0
              ? shadeResult[shadeResult.length - 1]
              : darkenColors[darkenColors.length - 1],
            -30
          );
          const shadedColor = Color(shadedColorHex);

          if (shadedColor.luminosity() <= 0.01) {
            isBlack = true;
            if (hexColor !== shadedColorHex) {
              darkenColors.push(shadedColorHex);
            }
          } else {
            darkenColors.push(shadedColorHex);
          }

          count++;
        }

        shadeResult = shadeResult.concat(darkenColors);

        return shadeResult;
      }

      return [];
    },
  },
};
</script>

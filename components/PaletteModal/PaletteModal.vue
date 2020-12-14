<template>
  <div
    class="bg-black bg-opacity-75 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center"
    :style="{ 'z-index': '9999' }"
  >
    <div
      class="relative bg-white dark:bg-gray-800 pt-4 rounded-lg min-w-9/10 w-9/10 md:min-w-500-px md:h-auto overflow-y-auto"
    >
      <div @click="close">
        <CloseIcon
          class="absolute top-0 left-0 ml-2 mt-2 cursor-pointer w-6 h-6"
        />
      </div>

      <!-- <div>
        <HorizontalDotsIcon
          class="absolute top-0 right-0 mr-2 mt-2 cursor-pointer w-6 h-6"
        />
      </div> -->

      <h4 class="text-center text-xl font-bold mb-8">View Palette</h4>

      <div class="single-palette">
        <div class="single-palette-colors">
          <div
            v-for="(color, index) in getColors"
            :key="index"
            class="single-palette-color"
            :style="{ 'background-color': color.hex }"
          >
            <div
              class="single-palette-color-meta"
              :class="isLightColor(color.hex) ? 'text-black' : 'text-white'"
            >
              <div
                class="single-palette-color-meta-info opacity-75"
                @click="copy(color.hex)"
              >
                <p class="single-palette-color-meta-info-title">HEX</p>
                <p class="single-palette-color-meta-info-text">
                  {{ color.hex }}
                </p>
              </div>
              <div
                class="single-palette-color-meta-info opacity-75"
                @click="copy(color.rgb)"
              >
                <p class="single-palette-color-meta-info-title">RGB</p>
                <p class="single-palette-color-meta-info-text">
                  <span
                    v-for="rgbText in color.rgb.split(',')"
                    :key="rgbText"
                    class="block"
                  >
                    {{ rgbText }}
                  </span>
                </p>
              </div>
              <div
                class="single-palette-color-meta-info opacity-75"
                @click="copy(color.hsl)"
              >
                <p class="single-palette-color-meta-info-title">HSL</p>
                <p class="single-palette-color-meta-info-text">
                  <span
                    v-for="hslText in color.hsl.split(',')"
                    :key="hslText"
                    class="block"
                  >
                    {{ hslText }}
                  </span>
                </p>
              </div>
              <div
                class="single-palette-color-meta-info opacity-75"
                @click="copy(color.cymk)"
              >
                <p class="single-palette-color-meta-info-title">CYMK</p>
                <p class="single-palette-color-meta-info-text">
                  <span
                    v-for="cymkText in color.cymk.split(',')"
                    :key="cymkText"
                    class="block"
                  >
                    {{ cymkText }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Color from 'color';

const CloseIcon = () => import('~/components/Icons/CloseIcon');
// const HorizontalDotsIcon = () => import('~/components/Icons/HorizontalDotsIcon');

export default {
  name: 'PaletteModal',
  components: {
    CloseIcon,
    // HorizontalDotsIcon,
  },
  props: {
    colors: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    getColors() {
      const myColors = [];

      if (this.colors) {
        this.colors.forEach((color) => {
          myColors.push(this.addColor(color.hex));
        });
      }

      return myColors;
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    isLightColor(hex) {
      const color = Color(hex);
      return color.isLight();
    },
    addColor(colorString) {
      const testHex = /^(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3})$/i.test(colorString);
      if (testHex) {
        const color = Color(colorString);
        const rgb =
          color.rgb().color[0].toFixed(0) +
          ', ' +
          color.rgb().color[1].toFixed(0) +
          ', ' +
          color.rgb().color[2].toFixed(0);
        const hsl =
          color.hsl().color[0].toFixed(0) +
          ', ' +
          color.hsl().color[1].toFixed(0) +
          ', ' +
          color.hsl().color[2].toFixed(0);
        const cmyk =
          color.cmyk().round().array()[0] +
          ', ' +
          color.cmyk().round().array()[1] +
          ', ' +
          color.cmyk().round().array()[2] +
          ', ' +
          color.cmyk().round().array()[3];

        return {
          hex: colorString,
          rgb,
          hsl,
          cymk: cmyk,
        };
      } else {
        return { hex: '#000000' };
      }
    },
    copy(copyString) {
      navigator.clipboard.writeText(copyString);

      this.$toast.open({
        type: 'default',
        message: `${copyString.toUpperCase()} copied`,
        duration: 500,
        position: 'top',
      });
    },
  },
};
</script>

<style scoped>
.single-palette {
  width: 100%;
}
.single-palette .single-palette-colors {
  height: 100%;
  display: flex;
}
.single-palette .single-palette-colors .single-palette-color {
  flex: 1;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: column;
  transition: all 0.15s ease;
}
.single-palette
  .single-palette-colors
  .single-palette-color
  .single-palette-color-meta {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: all 0.15s ease;
  opacity: 1;
  height: 100%;
}
.single-palette
  .single-palette-colors
  .single-palette-color
  .single-palette-color-meta
  .single-palette-color-meta-info {
  text-align: center;
  width: 100%;
  background: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 15px 5px;
  cursor: pointer;
}
.single-palette
  .single-palette-colors
  .single-palette-color
  .single-palette-color-meta
  .single-palette-color-meta-info:first-child {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.single-palette
  .single-palette-colors
  .single-palette-color
  .single-palette-color-meta
  .single-palette-color-meta-info:hover {
  background: rgba(255, 255, 255, 0.2);
}
.single-palette
  .single-palette-colors
  .single-palette-color
  .single-palette-color-meta
  .single-palette-color-meta-info
  .single-palette-color-meta-info-title {
  font-weight: 800;
  font-size: 18px;
}
.single-palette
  .single-palette-colors
  .single-palette-color
  .single-palette-color-meta
  .single-palette-color-meta-info
  .single-palette-color-meta-info-text {
  font-weight: 400;
  font-size: 14px;
}
.single-palette
  .single-palette-colors
  .single-palette-color:hover
  .single-palette-color-meta {
  opacity: 1;
}
</style>

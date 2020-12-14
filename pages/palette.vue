<template>
  <div class="single-palette">
    <div class="single-palette-colors">
      <div
        v-for="(color, index) in colors"
        :key="index"
        class="single-palette-color"
        :style="{ 'background-color': color.hex }"
      >
        <div class="single-palette-color-meta">
          <div class="single-palette-color-meta-info" @click="copy(color.hex)">
            <p class="single-palette-color-meta-info-title">HEX</p>
            <p class="single-palette-color-meta-info-text">{{ color.hex }}</p>
          </div>
          <div class="single-palette-color-meta-info" @click="copy(color.rgb)">
            <p class="single-palette-color-meta-info-title">RGB</p>
            <p class="single-palette-color-meta-info-text">{{ color.rgb }}</p>
          </div>
          <div class="single-palette-color-meta-info" @click="copy(color.hsl)">
            <p class="single-palette-color-meta-info-title">HSL</p>
            <p class="single-palette-color-meta-info-text">{{ color.hsl }}</p>
          </div>
          <div class="single-palette-color-meta-info" @click="copy(color.cymk)">
            <p class="single-palette-color-meta-info-title">CYMK</p>
            <p class="single-palette-color-meta-info-text">
              {{ color.cymk }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Color from 'color';

export default {
  data() {
    return {
      colors: [],
    };
  },
  mounted() {
    if (this.$route.query.colors) {
      const queryColors = this.$route.query.colors.split('-');
      if (queryColors && queryColors.length >= 3) {
        queryColors.forEach((queryColor) => {
          this.addColor(queryColor);
        });
      } else {
        this.addColor('333');
        this.addColor('555');
        this.addColor('888');
        this.updateQuery();
      }
    } else {
      this.addColor('333');
      this.addColor('555');
      this.addColor('888');
      this.updateQuery();
    }
  },
  methods: {
    addColor(colorString) {
      const testHex = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(colorString);
      if (testHex) {
        const color = Color('#' + colorString);
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

        this.colors.push({
          hex: '#' + colorString,
          rgb,
          hsl,
          cymk: cmyk,
        });
      } else {
        this.colors.push('#000000');

        this.updateQuery();
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  color: #fff;
  padding: 15px 5px;
  cursor: pointer;
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
  font-size: 22px;
}
.single-palette
  .single-palette-colors
  .single-palette-color
  .single-palette-color-meta
  .single-palette-color-meta-info
  .single-palette-color-meta-info-text {
  font-weight: 400;
}
.single-palette
  .single-palette-colors
  .single-palette-color:hover
  .single-palette-color-meta {
  opacity: 1;
}
</style>

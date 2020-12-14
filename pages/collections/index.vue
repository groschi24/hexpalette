<template>
  <div class="py-20 px-12">
    <h1 class="text-center text-4xl font-black text-black dark:text-white mb-8">
      Collections
    </h1>
    <div class="flex flex-wrap justify-center md:justify-between">
      <div
        v-for="(collection, index) in collections"
        id="collection"
        :key="index"
        class="flex-1 cursor-pointer mx-2 mb-8 flex justify-center items-center"
        :style="{
          'max-width': '350px',
        }"
      >
        <div>
          <div
            class="rounded-lg flex items-center justify-center overflow-hidden"
            :style="{
              'min-width': '350px',
              'min-height': '200px',
              width: '350px',
              height: '200px',
            }"
          >
            <div
              class="flex flex-wrap gap-3 justify-center items-center"
              :style="{
                'min-width': '450px',
                'flex-basis': '450px',
                transform: 'rotate(35deg)',
              }"
            >
              <div
                v-for="(palette, pindex) in getPalettes()"
                :key="pindex"
                class="flex rounded-lg overflow-hidden"
                :style="{
                  width: `${100 * 2}px`,
                  height: `${75 * 2}px`,
                }"
              >
                <div
                  v-for="(color, paletteindex) in palette"
                  :key="paletteindex"
                  class="flex-1"
                  :style="{ 'background-color': color.hex }"
                />
              </div>
            </div>
          </div>
          <p class="text-lg font-bold text-black dark:text-white mt-2">
            {{ collection }}
          </p>
          <p class="text-xs text-gray-700 dark:text-gray-500">12 Palettes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import randomColor from 'randomcolor';

export default {
  data() {
    return {
      collections: [
        'My cool collection',
        'All Blue colors',
        'what I have found',
        'cool colors',
        'My cool collection',
        'All Blue colors',
        'what I have found',
        'cool colors',
        'My cool collection',
        'All Blue colors',
        'what I have found',
        'cool colors',
        'My cool collection',
        'All Blue colors',
        'what I have found',
        'cool colors',
        'My cool collection',
        'All Blue colors',
      ],
    };
  },
  methods: {
    getPalettes() {
      const palettes = [];
      for (let i = 0; i < 6; i++) {
        const palette = [
          {
            hex: '#333',
          },
          {
            hex: '#555',
          },
          {
            hex: '#777',
          },
          {
            hex: '#999',
          },
        ];

        const ranLength = Math.floor(Math.random() * (10 - 3 + 1)) + 3;

        for (let i = 0; i < ranLength; i++) {
          palette[i] = {
            hex: randomColor(),
          };
        }

        palettes.push(palette);
      }

      return palettes;
    },
  },
};
</script>

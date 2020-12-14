<template>
  <div
    class="bg-black bg-opacity-75 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center"
    :style="{ 'z-index': '9999' }"
  >
    <div
      class="relative bg-white dark:bg-gray-800 px-6 md:px-12 py-8 rounded-lg min-w-9/10 w-9/10 md:min-w-500-px md:max-w-500-px h-500 md:h-auto overflow-y-auto"
    >
      <div @click="close">
        <CloseIcon
          class="absolute top-0 left-0 ml-2 mt-2 cursor-pointer w-6 h-6"
        />
      </div>

      <div class="flex flex-col">
        <h4 class="text-center text-xl font-black">Create Palette</h4>

        <div>
          <label
            class="block uppercase tracking-wide text-gray-700 dark:text-gray-500 text-xs font-bold mb-2"
            for="Password"
          >
            <div class="flex flex-wrap mt-4 items-center">
              <span class="mr-2 mt-2">Tags</span>
              <div v-for="(singletag, index) in tags" :key="singletag + index">
                <div
                  class="mr-2 mt-2 text-xs inline-flex items-center font-bold leading-sm px-2 py-1 rounded-lg bg-transparent text-black dark:text-white border"
                >
                  <a class="cursor-pointer mr-1" @click="removeTag(index)">
                    <CloseIcon class="w-3 h-3" />
                  </a>
                  {{ singletag }}
                </div>
              </div>
            </div></label
          >

          <div class="flex w-full justify-center items-center">
            <input
              v-model="tag"
              name="generatortag"
              class="w-full appearance-none block bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
              type="text"
              placeholder="Tag"
              @keydown.enter="addTag"
              @keydown.188="addTag"
            />
            <a
              class="w-24 ml-2 bg-primary rounded-lg py-3 text-white flex items-center justify-center cursor-pointer"
              @click="addTag"
            >
              <span>Add</span>
            </a>
          </div>
        </div>

        <a
          class="w-full bg-primary mt-6 rounded-lg py-3 text-white flex items-center justify-center cursor-pointer"
          @click="handleCreate"
        >
          <span>Save Palette</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
const CloseIcon = () => import('~/components/Icons/CloseIcon');

export default {
  name: 'SaveModal',
  components: {
    CloseIcon,
  },
  props: {
    colors: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      tags: [],
      tag: '',
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    addTag() {
      const cloneTags = JSON.parse(JSON.stringify(this.tags));

      if (this.tag.length < 3) {
        this.$toast.open({
          type: 'warning',
          message: `Tag is too small`,
          duration: 800,
          position: 'top',
        });
      }

      if (this.tag.length > 10) {
        this.$toast.open({
          type: 'warning',
          message: `Tag is too long`,
          duration: 800,
          position: 'top',
        });
      }

      if (this.tags.includes(this.tag)) {
        this.$toast.open({
          type: 'warning',
          message: `Already added for this tag`,
          duration: 800,
          position: 'top',
        });
      }

      if (this.tags.length > 9) {
        this.$toast.open({
          type: 'warning',
          message: `Too many tags`,
          duration: 800,
          position: 'top',
        });
      }

      if (
        this.tag.length > 2 &&
        this.tag.length < 11 &&
        !this.tags.includes(this.tag) &&
        this.tags.length < 10
      ) {
        cloneTags.push(this.tag);
        this.tag = '';

        this.tags = cloneTags;
      }
    },
    removeTag(index) {
      const cloneTags = JSON.parse(JSON.stringify(this.tags));

      if (this.tags.length > 0) {
        cloneTags.splice(index, 1);

        this.tags = cloneTags;
      }
    },
    handleCreate() {
      const colors = [];

      this.colors.forEach((color) => {
        colors.push(color.hex);
      });

      if (this.tags.length > 0) {
        this.createPalette({
          colors,
          tags: this.tags,
        });
      } else {
        this.createPalette({
          colors,
        });
      }

      this.tags = [];
      this.tag = '';
      this.$emit('close');
    },
    ...mapActions({
      createPalette: 'palettes/createPalette',
    }),
  },
};
</script>

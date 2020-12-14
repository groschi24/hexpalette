<template>
  <div class="relative w-full pr-0 md:pr-2">
    <input
      :value="search"
      placeholder="Search..."
      type="text"
      class="w-full h-10 appearance-none block bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg mt-2 md:mt-0 py-2 px-3 leading-tight focus:outline-none"
      style="outline: 0"
      @input="
        (e) => {
          $emit('search', e.target.value);
        }
      "
      @click="open"
      @keydown.up="highlightPrev"
      @keydown.down="highlightNext"
      @keydown.esc="cancel"
      @keydown.tab.prevent
      @keydown.enter="addTag"
    />

    <div
      v-show="isOpen"
      class="mt-1 absolute pin-x bg-white dark:bg-gray-800 p-2 rounded shadow z-50 w-full"
    >
      <ul
        v-show="options.length > 0"
        ref="options"
        class="list-reset relative overflow-y-auto scrolling-touch"
        style="max-height: 200px"
      >
        <li
          v-for="(option, i) in options"
          ref="option"
          :key="option.name"
          class="px-3 py-2 cursor-pointer rounded"
          :class="[
            i === highlightedIndex
              ? '  bg-primary text-white'
              : 'hover:bg-gray-500',
          ]"
          @click="select(i)"
        >
          <div class="flex items-center">
            <div
              class="rounded-full w-3 h-3 mr-2"
              :style="{ 'background-color': option.color }"
            />
            <span>{{ option.name }}</span>
          </div>
        </li>
      </ul>
      <div v-show="options.length === 0" class="px-3 py-2 text-grey">
        Press enter to search for "{{ search }}"
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    search: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
    addSearchTag: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isOpen: false,
      highlightedIndex: 0,
    };
  },
  mounted() {
    document.addEventListener('click', this.closeOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeOutside);
  },
  methods: {
    addTag() {
      this.addSearchTag();
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    closeOutside(e) {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    },
    cancel() {
      this.close();
    },
    commitSelection() {
      this.$emit('input', this.options[this.highlightedIndex].name);
      this.$emit('search', this.options[this.highlightedIndex].name);
      this.addSearchTag();
      this.close();
    },
    select(index) {
      this.highlightedIndex = index;
      this.commitSelection();
    },
    highlight(index) {
      this.open();
      this.highlightedIndex = index;
      this.$nextTick(() => {
        this.$refs.option[index].scrollIntoView({ block: 'nearest' });
      });
    },
    highlightPrev() {
      this.highlight(
        this.highlightedIndex - 1 < 0
          ? this.options.length - 1
          : this.highlightedIndex - 1
      );
    },
    highlightNext() {
      this.highlight(
        this.highlightedIndex + 1 >= this.options.length
          ? 0
          : this.highlightedIndex + 1
      );
    },
  },
};
</script>

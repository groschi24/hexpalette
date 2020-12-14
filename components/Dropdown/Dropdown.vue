<template>
  <div class="relative text-xs cursor-pointer">
    <button
      type="button"
      class="inline-flex border-none justify-center items-center w-full rounded-md border px-4 py-2 text-sm leading-5 font-medium hover:text-gray-500 dark:text-gray-600 focus:outline-none transition ease-in-out duration-150"
      aria-haspopup="true"
      aria-expanded="true"
      @click="toggleDropdown"
    >
      <slot name="toggle-button"></slot>
    </button>

    <!-- Dropdown -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="dropdownOpen"
        class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg"
        :style="{ 'z-index': '1' }"
      >
        <div class="rounded-md bg-white dark:bg-gray-800 shadow-xs">
          <div
            class="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <slot />
          </div>
        </div>
      </div>
    </transition>
    <!-- Dropdown End -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropdownOpen: false,
    };
  },
  mounted() {
    document.addEventListener('click', this.close);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.close);
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    close(e) {
      if (!this.$el.contains(e.target)) {
        this.dropdownOpen = false;
      }
    },
  },
};
</script>

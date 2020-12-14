<template>
  <nuxt-link
    class="px-3 py-2 mx-1 rounded-md text-sm font-medium dark:text-white hover:bg-gray-200 dark-hover:bg-gray-900 focus:outline-none"
    :class="isActive && 'bg-gray-200 dark:bg-gray-900'"
    :to="path"
    ><slot
  /></nuxt-link>
</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
    },
    path: {
      type: String,
      default: '',
    },
  },
};
</script>

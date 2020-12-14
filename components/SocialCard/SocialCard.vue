<template>
  <a
    :href="link"
    target="_blank"
    class="transition duration-100 ease-in-out col-span-8 sm:col-span-4 md:col-span-2 flex rounded-lg border-solid border-2 border-gray-900 dark:border-white hover:border-primary hover:text-primary"
  >
    <div
      class="w-full h-full flex flex-col justify-center items-center p-12 scale-150"
    >
      <slot />
    </div>
  </a>
</template>

<script>
export default {
  props: {
    link: {
      type: String,
      default: '#',
    },
  },
};
</script>

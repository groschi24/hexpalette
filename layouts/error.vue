<template>
  <div class="flex flex-col h-screen">
    <div class="px-6 py-40 flex-grow">
      <section class="main-content main-content-center">
        <img
          v-lazy="require('~/assets/images/14.png')"
          alt="paint"
          height="28"
        />
        <div>
          <h2 class="text-6xl font-extrabold dark:text-white">
            {{ error.statusCode }}
          </h2>
          <p class="text-lg">{{ error.message }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  layout: 'blog', // you can set a custom layout for the error page
};
</script>

<style scoped>
.wrapper {
  padding-bottom: 50px;
}
.main-content-center {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 25px;
}
.main-content-center img {
  max-width: 500px;
  width: 80%;
}
.main-content-center p {
  font-size: 20px;
}
</style>

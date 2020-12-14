<template>
  <div class="py-32 px-12 md:px-48">
    <h1 class="text-center text-4xl font-black text-black dark:text-white">
      Account Activation
    </h1>

    <div
      v-if="
        response &&
        response.status === 200 &&
        response.msg === 'Successful activated account'
      "
    >
      <p class="my-6 text-gray-500 text-center">
        Your account was successful activated! Now you can log in to your
        account.
      </p>
    </div>
    <div v-else-if="response && response.status === 404">
      <p class="my-6 text-gray-500 text-center">Account already activated!</p>
    </div>
    <div v-else>
      <p class="my-6 text-gray-500 text-center">Something went wrong!</p>
    </div>
    <nuxt-link
      class="w-64 transition duration-100 ease-in-out my-4 mx-auto py-3 rounded-lg border-gray-900 dark:border-white hover:bg-gray-900 dark-hover:bg-white hover:text-white dark-hover:text-black border-solid border-2 flex items-center justify-center"
      to="/"
    >
      Go Home
    </nuxt-link>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    response() {
      return this.$store.state.auth.response;
    },
  },
  mounted() {
    const activationToken = this.$route.params.activationToken;

    if (activationToken) {
      this.clearError();
      this.hideAuthModal();

      this.activateAccoun({
        activationToken,
      });
    }
  },
  methods: {
    ...mapMutations({
      hideAuthModal: 'auth/HIDE_AUTH_MODAL',
    }),
    ...mapActions({
      activateAccoun: 'auth/activateAccoun',
      clearError: 'auth/clearError',
    }),
  },
};
</script>

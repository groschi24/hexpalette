<template>
  <div class="py-32 px-12 md:px-48">
    <h1 class="text-center text-4xl font-black text-black dark:text-white">
      Reset Mail
    </h1>

    <div v-if="response && response.status === 200">
      <p class="my-6 text-gray-500 text-center">
        Your E-Mail was successful resetted! Please change your password if this
        was not you.
      </p>
    </div>
    <div v-else-if="response && response.status === 404">
      <p class="my-6 text-gray-500 text-center">
        E-Mail already resetted or token no longer valid!
      </p>
    </div>
    <div v-else>
      <p class="my-6 text-gray-500 text-center">Something went wrong!</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    response() {
      return this.$store.state.auth.response;
    },
  },
  mounted() {
    const emailToken = this.$route.params.emailToken;

    if (emailToken) {
      this.resetEmail({
        resetMailToken: emailToken,
      });
    }
  },
  methods: {
    ...mapActions({
      resetEmail: 'auth/resetEmail',
    }),
  },
};
</script>

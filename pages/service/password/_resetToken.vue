<template>
  <div class="py-32 px-12 md:px-48">
    <h1 class="text-center text-4xl font-black text-black dark:text-white">
      Reset Password
    </h1>

    <div v-if="isLoggedIn">
      <p class="my-6 text-gray-500 text-center">
        Can not reset token with when you logged in!
      </p>
    </div>
    <div v-else-if="resetStatus === 1 && response && response.status !== 200">
      <p class="my-6 text-gray-500 text-center">Password already resetted!</p>
    </div>
    <div
      v-else-if="resetStatus === 1 && response && response.status === 200"
      class="my-6"
    >
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <ValidationProvider
          v-slot="{ errors, valid }"
          rules="required|min:8|max:32"
          name="password"
        >
          <div class="my-4">
            <label
              class="block uppercase tracking-wide text-gray-700 dark:text-gray-500 text-xs font-bold mb-2"
              for="password"
              >Password</label
            >
            <input
              v-model="password"
              name="registerpassword"
              class="appearance-none block w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
              :class="!errors[0] ? '' : 'border-red-500'"
              type="password"
              @keydown.enter="handleSubmit(handleReset)"
              @keydown.188="handleSubmit(handleReset)"
            />
            <span
              class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"
              :class="valid ? 'opacity-0' : 'opacity-100'"
            >
              {{ errors[0] }} &nbsp;
            </span>
          </div>
        </ValidationProvider>

        <ValidationProvider
          v-slot="{ errors, valid }"
          rules="required|min:8|max:32|password:@password"
          name="confirm"
        >
          <div class="my-4">
            <label
              class="block uppercase tracking-wide text-gray-700 dark:text-gray-500 text-xs font-bold mb-2"
              for="confirm"
              >Confirm Password</label
            >
            <input
              v-model="repeatpassword"
              name="registerresetpassword"
              class="appearance-none block w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
              :class="!errors[0] ? '' : 'border-red-500'"
              type="password"
              @keydown.enter="handleSubmit(handleReset)"
              @keydown.188="handleSubmit(handleReset)"
            />
            <span
              class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"
              :class="valid ? 'opacity-0' : 'opacity-100'"
            >
              {{ errors[0] }} &nbsp;
            </span>
          </div>
        </ValidationProvider>

        <a
          class="w-full bg-primary rounded-lg py-3 text-white flex items-center justify-center cursor-pointer"
          @click="handleSubmit(handleReset)"
        >
          <span v-if="isLoading">Loading...</span>
          <span v-else>Reset Password</span>
        </a>
      </ValidationObserver>
    </div>
    <div v-else-if="resetStatus === 2 && response && response.status !== 200">
      <p class="my-6 text-gray-500 text-center">Something went wrong!</p>
    </div>
    <div v-else-if="resetStatus === 2 && response && response.status === 200">
      <p class="my-6 text-gray-500 text-center">
        Your password was successful resetted. Now you can login with your new
        password!
      </p>
      <nuxt-link
        class="w-64 transition duration-100 ease-in-out my-4 mx-auto py-3 rounded-lg border-gray-900 dark:border-white hover:bg-gray-900 dark-hover:bg-white hover:text-white dark-hover:text-black border-solid border-2 flex items-center justify-center"
        to="/"
      >
        Go Home
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      resetToken: '',
      password: '',
      repeatpassword: '',
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.auth.isLoading;
    },
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn;
    },
    response() {
      return this.$store.state.auth.response;
    },
    resetStatus() {
      return this.$store.state.auth.resetStatus;
    },
  },
  mounted() {
    const resetToken = this.$route.params.resetToken;

    if (resetToken) {
      this.resetToken = resetToken;
      this.checkResetPassword({
        resetToken,
      });
    }
  },
  methods: {
    handleReset() {
      const data = {
        password: this.password,
        confirmPassword: this.repeatpassword,
      };

      this.resetPassword({
        resetToken: this.resetToken,
        passwords: data,
      });
    },
    ...mapActions({
      checkResetPassword: 'auth/checkResetPassword',
      resetPassword: 'auth/resetPassword',
    }),
  },
};
</script>

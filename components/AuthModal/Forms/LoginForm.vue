<template>
  <div class="flex flex-col">
    <h2 class="text-center text-6xl font-black">Hi!</h2>
    <p class="text-gray-700 dark:text-gray-500 text-sm text-center">
      Sign into your account here.
    </p>

    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <ValidationProvider
        v-slot="{ errors, valid }"
        rules="required|email"
        name="Email"
      >
        <div class="my-4">
          <label
            class="block uppercase tracking-wide text-gray-700 dark:text-gray-500 text-xs font-bold mb-2"
            for="Email"
            >Email address</label
          >
          <input
            v-model="email"
            name="loginemail"
            class="appearance-none block w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
            :class="!errors[0] ? '' : 'border-red-500'"
            type="email"
            @keydown.enter="handleSubmit(handleLogin)"
            @keydown.188="handleSubmit(handleLogin)"
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
        rules="required|min:8|max:32"
        name="Password"
      >
        <div class="my-4">
          <label
            class="block uppercase tracking-wide text-gray-700 dark:text-gray-500 text-xs font-bold mb-2"
            for="Password"
            >Password</label
          >
          <input
            v-model="password"
            name="loginpassword"
            class="appearance-none block w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
            :class="!errors[0] ? '' : 'border-red-500'"
            type="password"
            @keydown.enter="handleSubmit(handleLogin)"
            @keydown.188="handleSubmit(handleLogin)"
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
        @click="handleSubmit(handleLogin)"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Sign In</span>
      </a>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  name: 'LoginForm',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    bus: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.auth.isLoading;
    },
    response() {
      return this.$store.state.auth.response;
    },
  },
  mounted() {
    if (this.bus) {
      this.bus.$on('resetForm', this.resetForm);
    }
  },
  methods: {
    handleLogin() {
      const data = {
        email: this.email,
        password: this.password,
      };
      this.login(data);
    },
    resetForm() {
      this.email = '';
      this.password = '';
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
    ...mapActions({
      login: 'auth/login',
    }),
  },
};
</script>

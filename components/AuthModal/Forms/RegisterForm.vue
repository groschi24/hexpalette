<template>
  <div class="flex flex-col">
    <div
      v-if="
        response &&
        !response.isError &&
        response.status === 200 &&
        response.registered
      "
    >
      <h2 class="text-center text-4xl font-black">Check your E-Mail</h2>
      <p class="text-gray-700 dark:text-gray-500 text-sm text-center">
        We send you a link to {{ email }} for account activation.
      </p>

      <a
        class="w-full bg-primary rounded-lg py-3 mt-6 text-white flex items-center justify-center cursor-pointer"
        @click="handleResendEmail"
      >
        <span>Resend E-Mail</span>
      </a>
    </div>
    <div v-else>
      <h2 class="text-center text-6xl font-black">Hi!</h2>
      <p class="text-gray-700 dark:text-gray-500 text-sm text-center">
        Sign up to collect your palettes.
      </p>

      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <ValidationProvider
          v-slot="{ errors, valid }"
          rules="required"
          name="FirstName"
        >
          <div class="my-4">
            <label
              class="block uppercase tracking-wide text-gray-700 dark:text-gray-500 text-xs font-bold mb-2"
              for="FirstName"
              >First Name</label
            >
            <input
              v-model="firstname"
              name="registerfirstname"
              class="appearance-none block w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
              :class="!errors[0] ? '' : 'border-red-500'"
              type="text"
              @keydown.enter="handleSubmit(handleRegister)"
              @keydown.188="handleSubmit(handleRegister)"
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
          rules="required"
          name="LastName"
        >
          <div class="my-4">
            <label
              class="block uppercase tracking-wide text-gray-700 dark:text-gray-500 text-xs font-bold mb-2"
              for="LastName"
              >Last Name</label
            >
            <input
              v-model="lastname"
              name="registerlastname"
              class="appearance-none block w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
              :class="!errors[0] ? '' : 'border-red-500'"
              type="text"
              @keydown.enter="handleSubmit(handleRegister)"
              @keydown.188="handleSubmit(handleRegister)"
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
          rules="required|email"
          name="Email"
        >
          <div class="my-4">
            <label
              class="block uppercase tracking-wide text-gray-700 dark:text-gray-500 text-xs font-bold mb-2"
              for="Password"
              >Email address</label
            >
            <input
              v-model="email"
              name="registeremail"
              class="appearance-none block w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
              :class="!errors[0] ? '' : 'border-red-500'"
              type="email"
              @keydown.enter="handleSubmit(handleRegister)"
              @keydown.188="handleSubmit(handleRegister)"
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
              @keydown.enter="handleSubmit(handleRegister)"
              @keydown.188="handleSubmit(handleRegister)"
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
              @keydown.enter="handleSubmit(handleRegister)"
              @keydown.188="handleSubmit(handleRegister)"
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
          rules="required"
          name="policy"
        >
          <label for="policy" class="inline-flex items-center mt-3">
            <input
              id="policy"
              v-model="policyCheckbox"
              name="registerpolicy"
              value="Policy"
              class="form-checkbox h-5 w-5 text-primary"
              type="checkbox"
            /><span class="ml-2 text-gray-700 dark:text-gray-500"
              >I agree to the Terms and Conditions and Privacy Policy
            </span>
          </label>
          <span
            class="flex items-center font-medium tracking-wide text-red-500 text-xs mb-1 ml-1"
            :class="valid ? 'opacity-0' : 'opacity-100'"
          >
            {{ errors[0] }} &nbsp;
          </span>
        </ValidationProvider>

        <a
          class="w-full bg-primary rounded-lg py-3 text-white flex items-center justify-center cursor-pointer"
          @click="handleSubmit(handleRegister)"
        >
          <span v-if="isLoading">Loading...</span>
          <span v-else>Sign Up</span>
        </a>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  name: 'RegisterForm',
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
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      repeatpassword: '',
      policyCheckbox: [],
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
    handleRegister() {
      const data = {
        email: this.email,
        username: this.email,
        password: this.password,
        firstName: this.firstname,
        lastName: this.lastname,
      };

      this.register(data);
    },
    handleResendEmail() {
      this.resendEmail({
        email: this.email,
      });
    },
    resetForm() {
      this.firstname = '';
      this.lastname = '';
      this.email = '';
      this.password = '';
      requestAnimationFrame(() => {
        // @ts-ignore
        this.$refs.observer.reset();
      });
    },
    ...mapActions({
      register: 'auth/register',
      resendEmail: 'auth/resendEmail',
    }),
  },
};
</script>

<style>
input:checked + svg {
  display: block;
}
</style>

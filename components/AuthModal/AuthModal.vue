<template>
  <div
    class="bg-black bg-opacity-75 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center"
    :style="{ 'z-index': '9999' }"
  >
    <div
      class="relative bg-white dark:bg-gray-800 px-6 md:px-12 py-8 rounded-lg min-w-9/10 w-9/10 md:min-w-500-px h-500 md:h-auto overflow-y-auto"
    >
      <div @click="close">
        <CloseIcon
          class="absolute top-0 left-0 ml-2 mt-2 cursor-pointer w-6 h-6"
        />
      </div>

      <!-- LOGIN -->
      <div v-if="type === 'login'">
        <LoginForm :bus="loginFormBus" />

        <div class="w-full my-8 border-solid border-t border-gray-400"></div>

        <div class="flex flex-col gap-2 text-center">
          <span class="text-gray-700 dark:text-gray-500">
            Forgot Password?
            <a class="text-primary cursor-pointer" @click="changeType('reset')"
              >Reset</a
            >
          </span>
          <span class="text-gray-700 dark:text-gray-500">
            Don't have an account?
            <a
              class="text-primary cursor-pointer"
              @click="changeType('register')"
              >Sign Up</a
            >
          </span>
        </div>
      </div>
      <!-- END LOGIN -->

      <!-- REGISTER -->
      <div v-else-if="type === 'register'">
        <RegisterForm :bus="registerFormBus" />

        <div class="w-full my-8 border-solid border-t border-gray-400"></div>

        <div class="flex flex-col gap-2 text-center">
          <span class="text-gray-700 dark:text-gray-500">
            I already have an account!
            <a class="text-primary cursor-pointer" @click="changeType('login')"
              >Sign In</a
            >
          </span>
        </div>
      </div>
      <!-- END REGISTER -->

      <!-- RESET -->
      <div v-else-if="type === 'reset'">
        <ResetForm :bus="resetFormBus" />

        <div class="w-full my-8 border-solid border-t border-gray-400"></div>

        <div class="flex flex-col gap-2 text-center">
          <span class="text-gray-700 dark:text-gray-500">
            Go back to!
            <a class="text-primary cursor-pointer" @click="changeType('login')"
              >Sign In</a
            >
          </span>
        </div>
      </div>
      <!-- END RESET -->

      <p class="text-center mt-3 text-red-500 max-w-1/2 m-auto">
        {{ response && response.data && response.data.msg }}
      </p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapMutations } from 'vuex';

const CloseIcon = () => import('~/components/Icons/CloseIcon');

const LoginForm = () => import('~/components/AuthModal/Forms/LoginForm.vue');
const RegisterForm = () =>
  import('~/components/AuthModal/Forms/RegisterForm.vue');
const ResetForm = () => import('~/components/AuthModal/Forms/ResetForm.vue');

export default {
  name: 'AuthModal',
  components: {
    CloseIcon,
    LoginForm,
    RegisterForm,
    ResetForm,
  },
  data() {
    return {
      loginFormBus: new Vue(),
      registerFormBus: new Vue(),
      resetFormBus: new Vue(),
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.auth.isLoading;
    },
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn;
    },
    isRegistered() {
      return this.$store.state.auth.isRegistered;
    },
    response() {
      return this.$store.state.auth.response;
    },
    type() {
      return this.$store.state.auth.auhtModalType;
    },
  },
  watch: {
    isLoggedIn(newIsLoggedIn, oldIsLoggedIn) {
      if (oldIsLoggedIn) {
        // User Logged out
        this.$ga.event('Authentication', 'logout');
        this.$toast.open({
          type: 'default',
          message: `Logged out`,
          duration: 1000,
          position: 'top',
        });
      } else {
        // User logged in
        this.$ga.event('Authentication', 'login');
        this.$toast.open({
          type: 'success',
          message: `Successful logged in`,
          duration: 1000,
          position: 'top',
        });

        this.close();
      }
    },
  },
  methods: {
    close() {
      this.clearError();
      this.$emit('close');
      this.$ga.event('Authentication', 'close modal');
      this.loginFormBus.$emit('resetForm');
      // this.registerFormBus.$emit('resetForm');
    },
    changeType(type) {
      this.clearError();
      this.$ga.event('Authentication', 'change modal', 'type', type);
      this.changeAuthModalType(type);
    },
    ...mapActions({
      clearError: 'auth/clearError',
    }),
    ...mapMutations({
      changeAuthModalType: 'auth/CHANGE_AUTH_MODAL_TYPE',
    }),
  },
};
</script>

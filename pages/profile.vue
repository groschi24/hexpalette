<template>
  <div class="my-12 p-12">
    <div v-if="isLoggedIn" class="flex flex-col w-full md:w-3/4 m-auto">
      <h2 class="text-center text-6xl font-black">Account</h2>

      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <ValidationProvider
          v-slot="{ errors, valid }"
          rules="required|min:3|max:255"
          name="Username"
        >
          <div class="my-4">
            <label
              class="block uppercase tracking-wide text-gray-700 dark:text-gray-500 text-xs font-bold mb-2"
              for="Username"
              >Username</label
            >
            <div class="flex flex-wrap justify-between">
              <input
                v-model="username"
                name="profileusername"
                class="w-full md:w-4/5 p-3 appearance-none block text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg leading-tight focus:outline-none"
                :class="[
                  !errors[0] ? '' : 'border-red-500',
                  userLoading
                    ? 'pointer-events-none opacity-50 bg-gray-500'
                    : 'pointer-events-auto opacity-100 bg-white dark:bg-gray-800',
                ]"
                type="text"
              />
              <div class="w-full md:w-1/5 pl-3 mt-3 md:mt-0">
                <a
                  class="p-3 rounded-lg text-white flex items-center justify-center cursor-pointer"
                  :class="
                    username === oldUsername || userLoading
                      ? 'pointer-events-none bg-gray-500'
                      : 'pointer-events-auto bg-primary'
                  "
                  @click="handleSubmit(handleChangeUsername)"
                >
                  <span>Save</span>
                </a>
              </div>
            </div>
            <span
              class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"
              :class="valid ? 'opacity-0' : 'opacity-100'"
            >
              {{ errors[0] }} &nbsp;
            </span>
          </div>
        </ValidationProvider>
      </ValidationObserver>

      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <ValidationProvider
          v-slot="{ errors, valid }"
          rules="required|email"
          name="email"
        >
          <div class="my-4">
            <label
              class="block uppercase tracking-wide text-gray-700 dark:text-gray-500 text-xs font-bold mb-2"
              for="email"
              >E-Mail</label
            >
            <div class="flex flex-wrap justify-between">
              <input
                v-model="email"
                name="profileemail"
                class="w-full md:w-4/5 p-3 appearance-none block text-gray-900 dark:text-white font-medium border border-gray-400 rounded-lg leading-tight focus:outline-none"
                :class="[
                  !errors[0] ? '' : 'border-red-500',
                  userLoading
                    ? 'pointer-events-none opacity-50 bg-gray-500'
                    : 'pointer-events-auto opacity-100 bg-white dark:bg-gray-800',
                ]"
                type="text"
              />
              <div class="w-full md:w-1/5 pl-3 mt-3 md:mt-0">
                <a
                  class="p-3 rounded-lg text-white flex items-center justify-center cursor-pointer"
                  :class="
                    email === oldEmail || userLoading
                      ? 'pointer-events-none bg-gray-500'
                      : 'pointer-events-auto bg-primary'
                  "
                  @click="handleSubmit(handleChangeEmail)"
                >
                  <span>Save</span>
                </a>
              </div>
            </div>
            <span
              class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"
              :class="valid ? 'opacity-0' : 'opacity-100'"
            >
              {{ errors[0] }} &nbsp;
            </span>
          </div>
        </ValidationProvider>
      </ValidationObserver>

      <div class="mt-6">
        <h4 class="font-bold select-none">Delete Account</h4>
        <p class="select-none">
          Delete you account and all the data associated permanently.
        </p>
        <a
          class="p-3 rounded-lg text-white flex items-center justify-center cursor-pointer bg-red-500 mt-4"
          @click="handleDeleteUser"
        >
          <span class="select-none"
            >Delete me ( Click {{ deleteCounter }} times to delete )</span
          >
        </a>
      </div>
    </div>
    <div v-else>
      <p>Not Logged In</p>
    </div>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { mapActions } from 'vuex';

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      username: '',
      oldUsername: '',
      email: '',
      oldEmail: '',
      deleteCounter: 5,
      lastClickedTime: Date.now(),
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn;
    },
    user() {
      return this.$store.state.auth.user;
    },
    response() {
      return this.$store.state.auth.response;
    },
    userLoading() {
      return this.$store.state.auth.userLoading;
    },
  },
  watch: {
    user(newUser, oldUser) {
      if (newUser !== oldUser) {
        this.username = newUser.username;
        this.oldUsername = newUser.username;
        this.email = newUser.email;
        this.oldEmail = newUser.email;

        this.$toast.open({
          type: 'success',
          message: `Successful changed`,
          duration: 1000,
          position: 'top',
        });
      }
    },
  },
  mounted() {
    if (this.user) {
      this.username = this.user.username;
      this.oldUsername = this.user.username;
      this.email = this.user.email;
      this.oldEmail = this.user.email;
    }

    window.setInterval(() => {
      if (this.lastClickedTime < Date.now() - 2000) {
        this.deleteCounter = 5;
      }
    }, 2000);
  },
  methods: {
    handleChangeUsername() {
      this.$ga.event('Profile', 'change username');
      if (this.username !== this.oldUsername) {
        const data = {
          username: this.username,
        };

        this.changeData(data);
      }
    },
    handleChangeEmail() {
      this.$ga.event('Profile', 'change email');
      if (this.email !== this.oldEmail) {
        const data = {
          email: this.email,
        };

        this.changeEmail(data);
      }
    },
    handleDeleteUser() {
      if (this.deleteCounter > 1) {
        this.deleteCounter = this.deleteCounter - 1;
        this.lastClickedTime = Date.now();
      } else {
        this.$ga.event('Profile', 'delete user');
        this.deleteUser();
      }
    },
    ...mapActions({
      changeData: 'auth/changeData',
      changeEmail: 'auth/changeEmail',
      deleteUser: 'auth/deleteUser',
    }),
  },
};
</script>

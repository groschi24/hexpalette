<template>
  <nav
    class="bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 border-gray-300 dark:border-gray-700 border-solid border-b"
    :style="{ 'z-index': '1000' }"
  >
    <!-- DESKTOP NAVBAR -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <nuxt-link to="/">
              <img
                v-lazy="require('~/assets/images/logo512.png')"
                class="h-8 w-8"
                alt="Hexpaltte"
              />
            </nuxt-link>
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline">
              <NavItem
                :is-active="currentRoute === 'palettes'"
                path="/palettes"
              >
                Palettes
              </NavItem>
              <NavItem
                :is-active="currentRoute === 'generator'"
                path="/generator"
              >
                Generator
              </NavItem>
            </div>
          </div>
          <!-- THEME SELECT -->
          <div class="relative mr-4">
            <select
              v-model="$colorMode.preference"
              class="cursor-pointer block appearance-none w-full bg-transparent border border-gray-300 text-gray-700 dark:text-white py-2 px-2 mx-1 pr-8 rounded leading-tight focus:outline-none focus:bg-transparent focus:border-gray-500"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-700 dark:text-white"
            >
              <ChevronDownIcon class="h-4 w-4" />
            </div>
          </div>
          <!-- END THEME SELECT -->
        </div>
        <!-- TODO: AD -->
        <!--<div class="hidden md:block">
          <a href="#" class="flex justify-center items-center text-sm">
            <div>
              <img
                v-lazy="require('~/assets/images/sp-logo.png')"
                class="h-6 w-6"
                alt
              />
            </div>
            <div class="mx-2">Company Name</div>
            <div class="text-gray-600">Lorem Ipsum a de impsum a le lorem</div>
          </a>
        </div>-->
        <!-- End AD -->
        <div v-if="isLoggedIn" class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Profile dropdown -->
            <Dropdown>
              <template v-slot:toggle-button>
                {{ user.email }}
                <ChevronDownIcon class="h-4 w-4" />
              </template>
              <nuxt-link
                class="block px-4 py-2 text-sm leading-5 text-gray-600 dark:text-white hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                to="/profile"
                >Open Profile
              </nuxt-link>

              <nuxt-link
                class="block px-4 py-2 text-sm leading-5 text-gray-600 dark:text-white hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                to="/saved"
                >My Saved Palettes
              </nuxt-link>
              <span
                class="block px-4 py-2 text-sm leading-5 text-gray-600 dark:text-white hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                @click="logout"
              >
                Sign out
              </span>
            </Dropdown>

            <!-- END Profile dropdown -->
          </div>
        </div>
        <div v-else class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <a
              class="cursor-pointer transition duration-100 ease-in-out py-2 px-4 mx-1 bg-primary hover:bg-opacity-75 text-white rounded-lg border-solid border border-transparent"
              @click="openAuthModal('login')"
            >
              Sign in
            </a>
            <a
              class="cursor-pointer transition duration-100 ease-in-out py-2 px-4 mx-1 rounded-lg border-gray-900 dark:border-white hover:bg-gray-900 dark-hover:bg-white hover:text-white dark-hover:text-black border-solid border"
              @click="openAuthModal('register')"
            >
              Sign up
            </a>
          </div>
        </div>

        <!-- MOBILE MENU BUTTON NAVBAR -->
        <div class="-mr-2 flex md:hidden">
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 focus:outline-none"
            @click="toggleMobile"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="menu-alt1 w-6 h-6"
              :class="[isMobileOpen ? 'hidden' : 'block', 'h-6 w-6']"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              ></path>
            </svg>
            <svg
              :class="[isMobileOpen ? 'block' : 'hidden', 'h-6 w-6']"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <!-- END MOBILE MENU BUTTON NAVBAR -->
      </div>
    </div>
    <!-- END DESKTOP NAVBAR -->

    <!-- MOBILE NAVBAR -->
    <div :class="[isMobileOpen ? '' : 'hidden', 'md:hidden']">
      <div class="px-2 pt-2 pb-3 sm:px-3">
        <nuxt-link
          class="m-1 block px-3 py-2 rounded-md text-base font-medium dark:text-white focus:outline-none"
          :class="currentRoute === 'palettes' && 'bg-gray-200 dark:bg-gray-900'"
          to="/palettes"
          >Palettes</nuxt-link
        >
        <nuxt-link
          class="m-1 block px-3 py-2 rounded-md text-base font-medium dark:text-white focus:outline-none"
          :class="
            currentRoute === 'generator' && 'bg-gray-200 dark:bg-gray-900'
          "
          to="/generator"
          >Generator</nuxt-link
        >
      </div>
      <div
        v-if="isLoggedIn"
        class="pt-2 pb-3 border-t border-gray-300 dark:border-gray-900"
      >
        <div class="mt-3 px-2">
          <span
            class="block px-3 py-2 text-base font-medium text-gray-700 focus:outline-none"
          >
            {{ user.email }}
          </span>
        </div>
        <div class="mt-3 px-2">
          <nuxt-link
            class="block px-4 py-2 text-sm leading-5 text-gray-600 dark:text-white hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            to="/profile"
            >Open Profile
          </nuxt-link>

          <nuxt-link
            class="block px-4 py-2 text-sm leading-5 text-gray-600 dark:text-white hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            to="/saved"
            >My Saved Palettes
          </nuxt-link>
          <span
            class="block px-4 py-2 text-sm leading-5 text-gray-600 dark:text-white hover:bg-gray-100 dark-hover:bg-gray-900 hover:text-gray-900 dark-hover:text-white focus:outline-none focus:bg-gray-100 focus:text-gray-900"
            @click="logout"
          >
            Sign out
          </span>
        </div>
      </div>
      <div
        v-else
        class="pt-2 pb-3 border-t border-gray-300 dark:border-gray-900"
      >
        <div class="ml-4 flex items-center md:ml-6">
          <a
            class="cursor-pointer transition duration-100 ease-in-out py-2 px-4 mx-1 bg-primary hover:bg-opacity-75 text-white rounded-lg border-solid border-2 border-transparent"
            @click="openAuthModal('login')"
          >
            Sign in
          </a>
          <a
            class="cursor-pointer transition duration-100 ease-in-out py-2 px-4 mx-1 rounded-lg border-gray-900 dark:border-white hover:bg-gray-900 dark-hover:bg-white hover:text-white dark-hover:text-black border-solid border"
            @click="openAuthModal('register')"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
    <!-- END MOBILE NAVBAR -->
  </nav>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

const NavItem = () => import('~/components/Navigation/Items/NavItem');
const ChevronDownIcon = () => import('~/components/Icons/ChevronDownIcon');
const Dropdown = () => import('~/components/Dropdown/Dropdown');

export default {
  components: {
    NavItem,
    ChevronDownIcon,
    Dropdown,
  },
  data() {
    return {
      isProfileDropdownOpen: false,
      isMobileOpen: false,
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn;
    },
    user() {
      return this.$store.state.auth.user;
    },
    currentRoute() {
      return this.$nuxt.$route.name;
    },
  },
  watch: {
    isLoggedIn(newIsLoggedIn, oldIsLoggedIn) {
      if (oldIsLoggedIn) {
        // User Logged out
      } else {
        // User logged in
      }
    },
  },
  methods: {
    openAuthModal(type) {
      this.showAuthModal(type);
    },
    toggleProfileDropdown() {
      this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    },
    toggleMobile() {
      this.isMobileOpen = !this.isMobileOpen;
    },
    ...mapMutations({
      showAuthModal: 'auth/SHOW_AUTH_MODAL',
    }),
    ...mapActions({
      logout: 'auth/logout',
    }),
  },
};
</script>

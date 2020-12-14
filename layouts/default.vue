<template>
  <div>
    <Navigation />

    <div class="height-100">
      <nuxt />
    </div>

    <AuthModal v-show="authModalActive" @close="hideAuthModal" />
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

const Navigation = () => import('~/components/Navigation/Navigation');
const AuthModal = () => import('~/components/AuthModal/AuthModal');

export default {
  components: {
    Navigation,
    AuthModal,
  },
  computed: {
    authModalActive() {
      return this.$store.state.auth.authModalActive;
    },
    routeName() {
      return this.$route.name;
    },
  },
  watch: {
    authModalActive(newAuthModalActive, oldAuthModalActive) {
      if (newAuthModalActive) {
        document.documentElement.style.overflow = 'hidden';
      } else if (this.routeName === 'generator') {
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = 'auto';
      }
    },
    routeName(newRouteName, oldRouteName) {
      if (newRouteName === 'generator') {
        document.documentElement.style.overflow = 'hidden';
      } else if (this.authModalActive) {
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = 'auto';
      }
    },
  },
  mounted() {
    this.refreshToken();
    window.setInterval(() => {
      this.refreshToken();
    }, 10000);
  },
  methods: {
    ...mapMutations({
      hideAuthModal: 'auth/HIDE_AUTH_MODAL',
    }),
    ...mapActions({
      refreshToken: 'auth/refresh',
    }),
  },
};
</script>

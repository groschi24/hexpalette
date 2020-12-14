<template>
  <div class="flex flex-col h-screen">
    <div class="px-6 pt-20 pb-10 flex-grow">
      <div class="flex flex-wrap">
        <div class="my-4 md:my-10 p-4 w-full md:w-2/5 text-center">
          <h1 class="text-5xl md:text-6xl font-extrabold dark:text-white">
            The best and nicest color palettes!
          </h1>
          <p class="my-8 text-gray-600">
            Get inspired by color palettes from the community or create the
            perfect palette for you.
          </p>
          <nuxt-link
            class="transition duration-100 ease-in-out my-4 mx-auto w-3/4 py-3 bg-primary hover:bg-opacity-75 text-white rounded-lg border-solid border-2 border-transparent flex items-center justify-center"
            to="/palettes"
          >
            <PaletteIcon class="fill-current text-white w-4 h-4 mr-2" />
            Palettes
          </nuxt-link>
          <nuxt-link
            class="transition duration-100 ease-in-out my-4 mx-auto w-3/4 py-3 rounded-lg border-gray-900 dark:border-white hover:bg-gray-900 dark-hover:bg-white hover:text-white dark-hover:text-black border-solid border-2 flex items-center justify-center"
            to="/generator"
          >
            <AdjustmentsIcon class="fill-current w-4 h-4 mr-2" />
            Generator
          </nuxt-link>
        </div>
        <div
          class="w-full md:w-3/5 px-4 hidden md:flex justify-center items-center flex-col"
        >
          <div class="object-laptop">
            <div class="screen">
              <div class="lcd">
                <div class="grid grid-cols-4 h-full">
                  <div
                    class="h-full transition duration-200 ease-out"
                    :style="{ 'background-color': colors[0] }"
                  />
                  <div
                    class="h-full transition duration-200 ease-out"
                    :style="{ 'background-color': colors[1] }"
                  />
                  <div
                    class="h-full transition duration-200 ease-out"
                    :style="{ 'background-color': colors[2] }"
                  />
                  <div
                    class="h-full transition duration-200 ease-out"
                    :style="{ 'background-color': colors[3] }"
                  />
                </div>
              </div>
            </div>
            <div class="keyboard one"></div>
            <div class="keyboard two"></div>
          </div>
        </div>
      </div>
      <!-- SOCIAL MEDIA -->
      <div class="grid grid-cols-8 gap-4 my-12 px-4">
        <SocialCard :link="`https://www.producthunt.com/posts/hexpalette-1`">
          <ProductHuntIcon class="fill-current w-8 h-8" />
          <h3 class="mt-2">Product Hunt</h3>
        </SocialCard>
        <SocialCard :link="`https://www.instagram.com/realhexpalette/`">
          <InstagramIcon class="fill-current w-8 h-8" />
          <h3 class="mt-2">Instagram</h3>
        </SocialCard>
        <SocialCard :link="`https://dribbble.com/HeaDTy`">
          <DribbbleIcon class="fill-current w-8 h-8" />
          <h3 class="mt-2">Dribbble</h3>
        </SocialCard>
        <SocialCard :link="`https://www.patreon.com/hexpalette`">
          <PatreonIcon class="fill-current w-8 h-8" />
          <h3 class="mt-2">Patreon</h3>
        </SocialCard>
      </div>
    </div>
    <!-- END SOCIAL MEDIA -->
    <!-- HOW IT WORKS -->
    <div class="w-full px-4 md:px-16 mt-8 mb-16">
      <h3 class="text-3xl font-bold text-center mb-3">How it works?</h3>
      <div class="flex flex-wrap items-center justify-center mb-8 md:mb-0">
        <div class="w-full md:w-1/2 p-1 md:p-8">
          <Explore class="w-full max-w-500-px h-full" />
        </div>
        <div class="w-full md:w-1/2 p-4">
          <h4 class="text-xl font-bold mb-2">Explore Palettes</h4>
          <p>
            Here you can find the perfect matching color scheme for your next
            project!
          </p>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-center">
        <div class="w-full md:w-1/2 p-4 order-2 md:order-1">
          <h4 class="text-xl font-bold mb-2">Generator</h4>
          <p>
            This is an easy to use color generator. Create palettes for yourself
            or the community.
          </p>
        </div>
        <div class="w-full md:w-1/2 p-1 md:p-8 order-1 md:order-2">
          <Generate class="w-full max-w-500-px h-full" />
        </div>
      </div>
    </div>
    <!-- END HOW IT WORKS -->
    <footer
      class="text-2xl px-6 py-5 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 border-solid border-t text-gray-600 dark:text-gray-500"
    >
      <section class="flex flex-col md:flex-row md:justify-between text-sm">
        <div class="flex justify-center items-center">
          <p>&copy; Hexpalette. From a developer to all the others.</p>
        </div>
        <div class="flex justify-center items-center">
          <nuxt-link class="mx-4 my-0" to="/legal">Legal Notice</nuxt-link>
          <nuxt-link class="mx-4 my-0" to="/privacy">Privacy Policy</nuxt-link>
        </div>
      </section>
    </footer>
  </div>
</template>

<script>
import { generatePalette } from '~/utils/generator';

const InstagramIcon = () => import('~/components/Icons/InstagramIcon');
const ProductHuntIcon = () => import('~/components/Icons/ProductHuntIcon');
const DribbbleIcon = () => import('~/components/Icons/DribbbleIcon');
const PatreonIcon = () => import('~/components/Icons/PatreonIcon');
const PaletteIcon = () => import('~/components/Icons/PaletteIcon');
const AdjustmentsIcon = () => import('~/components/Icons/AdjustmentsIcon');

const Explore = () => import('~/components/Images/Explore');
const Generate = () => import('~/components/Images/Generate');

const SocialCard = () => import('~/components/SocialCard/SocialCard');

export default {
  components: {
    InstagramIcon,
    ProductHuntIcon,
    DribbbleIcon,
    PatreonIcon,
    PaletteIcon,
    AdjustmentsIcon,
    SocialCard,
    Explore,
    Generate,
  },
  data() {
    return {
      colors: ['#f9ed69', '#f08a5d', '#b83b5e', '#6a2c70'],
    };
  },
  head() {
    return {
      title: 'Hexpalette - Join the community of color enthusiasts',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content:
            'Get inspired by color palettes from the community or create the perfect palette for you.',
        },
      ],
    };
  },
  mounted() {
    setInterval(() => {
      this.changeColor();
    }, 1500);
  },
  methods: {
    changeColor() {
      this.colors = generatePalette();
    },
  },
};
</script>

<style>
.object-laptop {
  position: relative;
  width: 100%;
}
.object-laptop > .screen {
  position: relative;
  width: 80%;
  margin: 0 auto;
  background-color: #1a1a1a;
  border-radius: 7px 7px 0 0;
}
.object-laptop > .screen::before {
  display: block;
  position: relative;
  content: '';
  padding-top: 62.5%;
}
.object-laptop > .screen > .lcd {
  position: absolute;
  top: 3.5%;
  left: 2.5%;
  bottom: 3.5%;
  right: 2.5%;
  overflow: hidden;
  border-radius: 3px;
  background-color: #000;
}
.object-laptop > .keyboard {
  position: relative;
  margin: 0 auto;
  width: 95%;
}
.object-laptop > .keyboard.one {
  height: 0.25vw;
  border-radius: 1px 1px 0 0;
  background: #a5adb0;
}
.object-laptop > .keyboard.two {
  height: 1.25vw;
  border-radius: 0 0 33% 33%;
  background: #a5adb0;
}
</style>

<template>
  <section class="login-cmp">
    <div class="logo-container">
      <div class="logo-img"></div>
      <h1>Duello</h1>
    </div>
    <router-view @login="login" @signup="signup" />
  </section>
</template>

<script>
import { useUserStore } from "../stores/user.store";
import logIn from "../components/auth/log-in.vue";
import signUp from "../components/auth/sign-up.vue";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  created() {
    window.onSignIn = this.onSignIn;
  },
  methods: {
    async onSignIn(googleUser) {
      // var profile = googleUser.getBasicProfile();
      // const fullname = profile.getName();
      // const imgUrl = profile.getImageUrl();
      // const score = 100;
      // const username = profile.getEmail();
      // const _id = profile.getId();
      // const user = {
      //   fullname,
      //   imgUrl,
      //   score,
      //   username,
      //   _id,
      // };
      // await this.$store.dispatch({
      //   type: 'googleUserLoggedIn',
      //   user,
      // });
      // this.$router.push({ path: '/' });
    },
    async login(creds) {
      await this.userStore.login(creds);
      if (this.userStore.currUser) this.$router.replace("/");
      // this.userStore.loadUser();
      // this.$router.push(`/user/${this.userStore.currUser._id}`);
      // this.user.password = this.user.password.toString();
      // console.log(this.user.password);
      // const user = await this.$store.dispatch({
      //   type: 'login',
      //   user: this.user,
      // });
      // console.log(user);
    },
    async signup(user) {
      try {
        await this.userStore.signup(user);
        if (this.userStore.currUser) {
          this.$router.replace(`/`);
        }
      } catch (error) {
        console.log(error);
      }
      // const user = await this.$store.dispatch({
      //   type: 'signup',
      //   user: this.newUser,
      // });
      // console.log(user);
      // if (user) this.$router.replace('/');
    },
  },
  components: { logIn, signUp },
};
</script>

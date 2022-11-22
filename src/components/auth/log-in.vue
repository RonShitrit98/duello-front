<template>
  <section>
    <div class="login-container">
      <h2>Log in to Duello</h2>
      <form @submit.prevent="login">
        <input
          type="text"
          v-model="creds.username"
          placeholder="Username"
          autocomplete="username"
        />
        <input
          type="password"
          v-model="creds.password"
          placeholder="Password"
          autocomplete="current-password"
        />
        <input class="submit-btn" type="submit" value="Log in" />
      </form>
      <h3 class="separator">OR</h3>
      <a class="google-button" :href="signupWithGoogle" @click="googleSignup">
        <img
          src="https://res.cloudinary.com/dtseyauom/image/upload/v1669133351/gxuu2kraly0pkrho6sfo.png"
          alt=""
        />
        Sign in with Google
      </a>
    </div>
    <p>
      Don't have a user? you can
      <router-link class="router-link" to="/auth/signup"> sign up here</router-link>
    </p>
  </section>
</template>

<script>
  import {getGoogleUrl} from '../../services/google.service'
export default {
  data() {
    return {
      creds: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      this.$emit("login", this.creds);
    },
  },
  computed: {
    signupWithGoogle() {
      return getGoogleUrl("/");
    },
  },
};
</script>

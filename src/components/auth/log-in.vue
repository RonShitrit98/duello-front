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
      <div class="g-signin2" data-onsuccess="onSignIn"></div>
    </div>
    <p>
      If don't have a user you can
      <router-link to="/auth/signup"> sign up here</router-link>
    </p>
  </section>
</template>

<script>
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
};
</script>

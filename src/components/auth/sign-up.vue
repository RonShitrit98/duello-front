<template>
  <div class="login-container">
    <h2>Sign in to Duello</h2>
    <form @submit.prevent="signup">
      <input
        type="text"
        v-model="newUser.username"
        placeholder="Enter username"
      />
      <input
        type="text"
        v-model="newUser.fullname"
        placeholder="Enter full name"
      />
      <input
        type="password"
        v-model="newUser.password"
        placeholder="Enter password"
      />
      <label class="img-label" for="img-input"> Upload profile picture</label>
      <input class="submit-btn" type="submit" value="Sign up" />
      <input
        @change="uploadImg($event)"
        class="img-input"
        type="file"
        accept="image/png, image/gif, image/jpeg"
        id="img-input"
      />
    </form>
    <h3 class="separator">OR</h3>
    <a :href="signupWithGoogle" @click="googleSignup">Signup with Google</a>
    <!-- <div class="g-signin2" data-onsuccess="onSignIn"></div> -->
  </div>
</template>

<script>
import { userService } from "../../services/user.service";
import { imgService } from "../../services/imgUpload.service";
import { getGoogleUrl } from "../../services/google.service";
export default {
  data() {
    return {
      newUser: userService.getEmptyUser(),
    };
  },
  methods: {
    signup() {
      console.log(this.newUser);
      this.$emit("signup", this.newUser);
    },
    async uploadImg(ev) {
      const img = await imgService.uploadImg(ev.target.files);
      this.newUser.imgUrl = img;
    },
  },
  computed: {
    signupWithGoogle() {
      return getGoogleUrl("/");
    },
  },
};
</script>

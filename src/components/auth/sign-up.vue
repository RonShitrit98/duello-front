<template>
  <section>
    <div class="signup-container">
      <h2>Sign up to Duello</h2>
      <form @submit.prevent="signup">
        <input
          type="text"
          v-model="newUser.username"
          placeholder="Email address"
        />
        <input type="text" v-model="newUser.fullname" placeholder="Full name" />
        <input
          type="password"
          v-model="newUser.password"
          placeholder="Password"
        />
        <label class="img-label" for="img-input">
          <img :src="newUser.imgUrl" alt="" />
          <loader v-if="isLoading"/>
          <span v-else>Upload profile picture</span>
        </label>
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
      <a class="google-button" :href="signupWithGoogle" @click="googleSignup">
        <img
          src="https://res.cloudinary.com/dtseyauom/image/upload/v1669133351/gxuu2kraly0pkrho6sfo.png"
          alt=""
        />
        Signup with Google
      </a>
    </div>
    <p>
      Already have a user? you can
      <router-link to="/auth/login"> log in here</router-link>
    </p>
  </section>
</template>

<script>
import { userService } from "../../services/user.service";
import { imgService } from "../../services/imgUpload.service";
import { getGoogleUrl } from "../../services/google.service";
import loader from "../loader.vue";
export default {
  data() {
    return {
      newUser: userService.getEmptyUser(),
      isLoading: false,
    };
  },
  methods: {
    signup() {
      console.log(this.newUser);
      this.$emit("signup", this.newUser);
    },
    async uploadImg(ev) {
      this.isLoading = true;
      const img = await imgService.uploadImg(ev.target.files);
      this.newUser.imgUrl = img;
      this.isLoading = false;
    },
  },
  computed: {
    signupWithGoogle() {
      return getGoogleUrl("/");
    },
  },
  components: { loader },
};
</script>

import { defineStore } from "pinia";
import { userService } from "../services/user.service";
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      currUser: null,
      userToDisplay: null,
    };
  },
  getters: {},
  actions: {
    async signup(user) {
      try {
        const newUser = await userService.signup(user);
        this.currUser = newUser;
      } catch (error) {
        console.log(error);
      }
    },
    async login(creds) {
      const user = await userService.login(creds);
      this.currUser = user;
    },
    async loadUser() {
      try {
        const user = await userService.loadUser();
        this.currUser = user;
      } catch (error) {
        console.log(error);
      }
    },
    async findUserById(id) {
      try {
        const user = await userService.loadUser(id);
        this.userToDisplay = user;
      } catch (error) {
        console.log(error);
      }
    },
    async logout(){
      this.currUser = null
      await userService.logout()
    }
  },
});

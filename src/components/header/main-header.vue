<template>
  <section
    :class="['main-header', txtClr]"
    :style="`background-color: ${bcg};`"
  >
    <nav>
      <div class="buttons">
        <!-- <button>
          <icon-base iconName="grid" class="grid" />
        </button> -->
        <button class="main-logo" @click="goHome">
          <div class="logo-img"></div>
          <span>Duello</span>
        </button>
        <!-- <button>
          Workspaces
          <icon-base iconName="chevron-down" />
        </button>
        <button>
          Recent
          <icon-base iconName="chevron-down" />
        </button> -->
        <button>
          Boards
          <icon-base iconName="chevron-down" />
        </button>
        <button>
          Starred
          <icon-base iconName="chevron-down" />
        </button>
        <button @click="toggleCreateModal" class="create-btn">Create</button>
        <!-- <button @click="toggleCreateModal" class="add-btn-mq create-btn">
          <icon-base iconName="plus"></icon-base>
        </button> -->
      </div>

      <div class="information">
        <div class="search-input">
          <icon-base iconName="search" class="search" />
          <input type="text" placeholder="Search" />
        </div>
        <button>
          <icon-base iconName="information" class="info" />
        </button>
        <button class="bell-btn">
          <icon-base iconName="alert" class="alert" />
        </button>
        <label @click="toggleUserDetails" v-if="user" class="user-icon">
          <img :src="user.imgUrl" referrerpolicy="no-referrer" />
        </label>
        <!-- <button @click="logout">logout</button> -->
      </div>
    </nav>
    <create-board
      v-if="isCreateBoard"
      @closeModal="toggleCreateModal"
      @create="createBoard"
    />
  </section>
  <section v-if="isUserDetails" class="main-user-modal">
    <div class="modal-header">
      <header>
        <div class="header-btn-container">
          <icon-base @click="toggleUserDetails" iconName="x"></icon-base>
        </div>
        <h2>Account</h2>
      </header>
      <div class="main-content">
        <div class="user-details">
          <img class="user-img" :src="user.imgUrl" />
          <div class="user-name">
            <h4>{{ user.fullname }}</h4>
            <h5>{{ user.username }}</h5>
          </div>
        </div>
        <button @click="logout">Log out</button>
      </div>
    </div>
  </section>
</template>

<script>
import { useBoardStore } from "../../stores/board.store";
import { useUserStore } from "../../stores/user.store";
import iconBase from "../icon-base.vue";
import createBoard from "../create-board.vue";
export default {
  setup() {
    const boardStore = useBoardStore();
    const userStore = useUserStore();
    return {
      boardStore,
      userStore,
    };
  },
  data() {
    return {
      isCreateBoard: false,
      isUserDetails: false,
    };
  },
  methods: {
    async logout() {
      await this.userStore.logout();
      this.$router.replace('/welcome');
      // var auth2 = gapi.auth2.getAuthInstance();
      // auth2.signOut().then(function () {
      //   console.log('User signed out.');
      // });
    },
    goHome() {
      this.$router.push({ path: "/" });
      // this.$store.commit('resetBcg');
    },
    toggleCreateModal() {
      this.isCreateBoard = !this.isCreateBoard;
    },
    async createBoard(board) {
      try {
        await this.boardStore.createBoard(board);
        this.$router.replace({
          path: `/board/${this.boardStore.currBoard._id}`,
        });
      } catch (error) {
        console.log(error);
      }
    },
    toggleUserDetails() {
      this.isUserDetails = !this.isUserDetails;
    },
  },
  computed: {
    user() {
      return this.userStore.currUser;
      // return this.$store.getters.user;
    },
    bcg() {
      // return this.$store.getters.bcg;
    },
    txtClr() {
      const isDark = this.boardStore.style.isDark;
      if (!isDark) return "dark-bcg";
      else return "light-bcg";
    },
  },
  async created() {},
  components: { iconBase, createBoard },
};
</script>

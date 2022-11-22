<template>
  <section class="home-page">
    <main-header />

    <loader v-if="loading" color="#aaa" />

    <div v-else class="main-container">
      <div class="nav-bar">
        <div>
          <ul>
            <li
              v-for="option in options"
              :key="option.name"
              :class="[option.class]"
              @click="visit(option.type)"
            >
              <div class="li-icon">
                <icon-base :iconName="option.type" />
              </div>
              <span class="option">{{ option.txt }}</span>
            </li>
          </ul>
        </div>

        <div>
          <div>
            <span>Workspaces</span>
            <div class="icon-plus">
              <icon-base iconName="plus-s" />
            </div>
          </div>

          <div>
            <div :class="['container', direction]" @click="isOpen = !isOpen">
              <div class="letter">S</div>
              <span>Sprint</span>
              <icon-base iconName="presentation" class="presentation" />
            </div>

            <ul :class="['dropdown', direction]">
              <li>
                <div class="li-icon">
                  <icon-base iconName="board" />
                </div>
                <span>Boards</span>
              </li>
              <li>
                <div class="li-icon">
                  <icon-base iconName="hart" />
                </div>
                <span>Highlights</span>
              </li>
              <li>
                <div class="li-icon">
                  <icon-base iconName="views" />
                </div>
                <span>Views</span>
                <div class="icon-plus">
                  <icon-base iconName="forward" />
                </div>
              </li>
              <li>
                <div class="li-icon">
                  <icon-base iconName="members" />
                </div>
                <span>Members</span>
                <div class="icon-plus">
                  <icon-base iconName="plus-s" />
                  <icon-base iconName="forward" />
                </div>
              </li>
              <li>
                <div class="li-icon">
                  <icon-base iconName="settings" />
                </div>
                <span>Settings</span>
                <div class="icon-plus">
                  <icon-base iconName="forward" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <board-list v-if="boards" :boards="boards" @update="updateBoard" />
    </div>
  </section>
</template>

<script>
import { useBoardStore } from "../stores/board.store";
import { useUserStore } from "../stores/user.store";
import iconBase from "../components/icon-base.vue";
import mainHeader from "../components/header/main-header.vue";
import boardList from "../components/board/board-list.vue";
import loader from "../components/loader.vue";

export default {
  setup() {
    const boardStore = useBoardStore();
    const userStore = useUserStore();
    return { boardStore, userStore };
  },
  data() {
    return {
      isOpen: false,
      loading: true,
      options: [
        { type: "board", txt: "Boards", class: "visiting" },
        { type: "template-board", txt: "Templates", class: "" },
        { type: "home", txt: "Home", class: "" },
      ],
    };
  },
  async created() {
    await this.loadUser();
    if (!this.userStore.currUser) {
      this.$router.push(`/welcome`);
    }
    await this.boardStore.loadBoards();
    this.loading = false;
    this.boardStore.resetBoard();
  },
  methods: {
    visit(type) {
      this.options = this.options.map((option) => {
        if (option.type === type) {
          option.class = "visiting";
          return option;
        }
        option.class = "";

        return option;
      });
    },
    updateBoard(board) {
      this.boardStore.updateBoard(board);
    },
    async loadUser() {
      try {
        await this.userStore.loadUser(this.$route.params.id);
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    // direction() {
    //   return this.isOpen ? 'open' : '';
    // },
    // isFavorite() {
    //   if (this.board.isStarred) return 'full-star';
    //   else return 'empty-star';
    // },
    boards() {
      return this.boardStore.currBoards;
    },
  },
  components: {
    mainHeader,
    iconBase,
    boardList,
    loader,
  },
};
</script>

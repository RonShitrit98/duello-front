<template>
  <section v-if="design">
    <section class="create-board">
      <header>
        <div class="header-btn-container">
          <icon-base @click="closeModal" iconName="x"></icon-base>
          <icon-base iconName="icon-back"></icon-base>
        </div>
        <h2>Create board</h2>
      </header>
      <div class="main-content">
        <div class="board-prev" :style="getPrevStyle">
          <icon-base iconName="board-prev"></icon-base>
        </div>
        <p>Background</p>
        <div class="img-container">
          <div class="img-boxes" v-for="img in design.imgs.slice(0, 4)" :key="img.id" @click="setBoardImg(img)">
            <img :src="img.thumb" />
          </div>
        </div>
        <div class="color-container">
          <div
            @click="setBoardClr(color.color)"
            v-for="color in design.colors.slice(0, 5)"
            :key="color.id"
            class="color-boxes"
            :style="'background-color:' + color.color"
          ></div>
          <button @click="toggleCostumizeModal" class="more-btn">
            <icon-base iconName="more"></icon-base>
          </button>
        </div>
        <p>
          Board title
          <span>*</span>
        </p>
        <form @submit.prevent="create">
          <input ref="title" :class="['board-name', isTitle]" type="text" v-model="boardToEdit.title" />
          <h3 v-if="!boardToEdit.title">👋 Board title is required</h3>
          <input class="add-btn" type="submit" value="Create" :disabled="!boardToEdit.title" />
        </form>
      </div>
    </section>
    <section class="costumize-modal" v-if="isCostumize">
      <header>
        <div class="header-btn-container">
          <icon-base @click="toggleCostumizeModal" iconName="x"></icon-base>
          <icon-base v-if="isSearch" @click="toggleSearch" iconName="icon-back"></icon-base>
          <icon-base v-if="isMoreColors" @click="toggleMoreColors" iconName="icon-back"></icon-base>
        </div>
        <h2>{{ modalTitle }}</h2>
      </header>
      <div v-if="!isSearch && !isMoreColors" class="main-content">
        <div class="see-more">
          <h3>Photos</h3>
          <h6 @click="toggleSearch">See more</h6>
        </div>
        <div class="img-container">
          <img @click="setBoardImg(img)" v-for="img in design.imgs" :key="img.url" :src="img.thumb" />
        </div>
        <div @click="toggleMoreColors" class="see-more">
          <h3>colors</h3>
          <h6>See more</h6>
        </div>
        <div class="color-container">
          <div
            v-for="color in design.colors.slice(0, 6)"
            :key="color.color"
            @click="setBoardClr(color.color)"
            :style="'background-color:' + color.color"
            class="color-box"
          ></div>
        </div>
      </div>
      <div v-else-if="isSearch" class="main-content">
        <input type="text" placeholder="Photos" @keyup="searchImgs($event)" />
        <div class="img-container search">
          <img @click="setBoardImg(img)" v-for="img in searchImg" :key="img.url" :src="img.thumb" />
        </div>
      </div>
      <div v-else-if="isMoreColors" class="main-content">
        <div class="color-container">
          <div
            v-for="color in design.colors.slice(1, 10)"
            :key="color.color"
            @click="setBoardClr(color.color)"
            :style="'background-color:' + color.color"
            class="color-box"
          ></div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { boardService } from '../../services/board.service';
import { designService } from '../../services/design.services';
import iconBase from '../icon-base.vue';
import isDarkColor from 'is-dark-color';

export default {
  data() {
    return {
      boardToEdit: boardService.getEmptyBoard(),
      design: designService.query(),
      isCostumize: false,
      isSearch: false,
      isMoreColors: false,
      searchImg: null,
    };
  },
  async created() {
    this.loggedinUser = this.$store.getters.user;
    this.boardToEdit.style.backgroundImg = this.design.imgs[0];
    this.searchImg = await designService.getImgs(100, 'desktop');
  },
  mounted() {
    this.$refs.title.focus();
  },
  methods: {
    setBoardClr(color) {
      this.boardToEdit.style.color = color;
      this.boardToEdit.style.type = 'color';
      this.boardToEdit.style.backgroundImg = '';
      this.boardToEdit.style.isDark = isDarkColor(color);
    },
    async setBoardImg(img) {
      this.boardToEdit.style.backgroundImg = img;
      this.boardToEdit.style.type = 'img';
      const color = await designService.getAvgColor(img.url);
      this.boardToEdit.style.color = color.hex;
      this.boardToEdit.style.isDark = color.isDark;
    },
    closeModal() {
      this.$emit('closeModal');
    },
    create() {
      this.$emit('create', { ...this.boardToEdit });
    },
    async toggleCostumizeModal() {
      this.isCostumize = !this.isCostumize;
    },
    toggleSearch() {
      this.isSearch = !this.isSearch;
    },
    async searchImgs(ev) {
      const imgs = await designService.getImgs(100, ev.target.value);
      this.searchImg = imgs;
    },
    toggleMoreColors() {
      this.isMoreColors = !this.isMoreColors;
    },
  },
  computed: {
    getPrevStyle() {
      if (!this.boardToEdit) return;
      if (this.boardToEdit.style.type === 'color') {
        return `background-color: ${this.boardToEdit.style.color};`;
      } else return `background-image: url(${this.boardToEdit.style.backgroundImg.thumb});`;
    },
    isTitle() {
      if (!this.boardToEdit.title) return 'no-title';
    },
    modalTitle() {
      if (!this.isSearch && !this.isMoreColors) return 'Board background';
      else if (this.isSearch) return 'Photos by Unspalsh';
      else return 'Colors';
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize);
  },
  components: { iconBase },
};
</script>

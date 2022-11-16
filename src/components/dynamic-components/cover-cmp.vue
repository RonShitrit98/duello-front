<template>
  <section v-if="!isSearch" class="cover-cmp">
    <header>
      <div class="header-btn-container">
        <icon-base @click="closeModal" iconName="x"></icon-base>
      </div>
      <h2>Cover</h2>
    </header>
    <div class="main-content">
      <div class="cover-container">
        <div :style="coverStyle" @click="setCoverStyle('solid')" :class="['cover-prev']">
          <img src="../../assets/imgs/cover-img-solid.png" />
          <span class="board-title-fade"></span>
          <span :class="isSolidFocus"></span>
        </div>
        <div :style="coverStyle" @click="setCoverStyle('background')" :class="'cover-prev'">
          <img src="../../assets/imgs/cover-img-bcg.png" />
          <span :class="isBcgFocus"></span>
          <span class="board-title-fade"></span>
        </div>
      </div>
      <div v-if="style.colors">
        <p>Colors</p>
        <div class="color-container">
          <div v-for="color in style.colors" :key="color.id">
            <div @click="setCoverColor(color.color)" class="color-boxes" :style="'background-color:' + color.color">
              <span class="board-title-fade"></span>

              <span :class="color.color === task.style.cover.color ? 'focused' : ''"></span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p>Attachments</p>
        <div class="upload-container">
          <label class="btn" for="uploadImg">
            <span v-if="loading">Uploading Image...</span>
            <div class="search-btn" v-else>
              <span>Upload a cover image</span>
              <input id="uploadImg" type="file" @change="onUploadImg" hidden />
            </div>
          </label>
        </div>
      </div>

      <div v-if="imgs">
        <p>Pohots from Unsplash</p>
        <div class="img-container">
          <div @click="setCoverImg(img.thumb)" class="img-boxes" v-for="img in imgs" :key="img">
            <img :src="img.thumb" />
            <span class="board-title-fade"></span>
            <span :class="img.thumb === task.style.cover.imgUrl ? 'focused' : ''"></span>
          </div>
        </div>
        <button @click="openImgSearch" class="search-btn">Search for photos</button>
      </div>
    </div>
  </section>

  <section v-else class="cover-cmp">
    <header>
      <div class="header-btn-container">
        <icon-base @click="closeModal" iconName="x"></icon-base>
        <icon-base @click="closeSearch" iconName="icon-back"></icon-base>
      </div>
      <h2>Photo search</h2>
    </header>
    <div class="main-content search">
      <input @input="searchImg" type="text" placeholder="Search Unsplash for pohotos" v-model="imgSearch" />
      <label>
        <icon-base v-if="imgSearch" class="x" @click="setSearch('')" iconName="x"></icon-base>
      </label>
      <div v-if="!imgSearch" class="suggested">
        <div class="search-words">
          <p>Suggested searches</p>
          <button v-for="keys in style.suggestedSearches" :key="keys" @click="setSearch(keys)">{{ keys }}</button>
        </div>
        <p>Top photos</p>
        <div class="img-container">
          <div @click="setCoverImg(img.thumb)" class="img-boxes" v-for="img in imgs">
            <img :src="img.thumb" />
            <span class="board-title-fade"></span>
          </div>
        </div>
      </div>
      <div v-else class="results">
        <div class="search-words">
          <p>Suggested searches</p>
        </div>
        <p>Results</p>
        <div class="img-container">
          <div @click="setCoverImg(img.thumb)" class="img-boxes" v-for="img in imgs">
            <img :src="img.thumb" />
            <span class="board-title-fade"></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import iconBase from '../icon-base.vue';
import { designService } from '../../services/design.services.js';
import { imgService } from '../../services/imgUpload.service.js';
import isDarkColor from 'is-dark-color';

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      style: designService.query(),
      imgs: null,
      isSearch: false,
      imgSearch: '',
      loading: false,
    };
  },
  computed: {
    coverStyle() {
      if (this.task.style.cover.imgUrl) return `background-image: url(${this.task.style.cover.imgUrl})`;
      return `background-color: ${this.task.style.cover.color}`;
    },
    isSolidFocus() {
      if (this.task.style.cover.style === 'solid') {
        return 'focused';
      } else return '';
    },
    isBcgFocus() {
      if (this.task.style.cover.style === 'background') return 'focused';
      else return '';
    },
  },
  components: { iconBase },
  methods: {
    async searchImg() {
      if (!this.imgSearch) this.imgs = await designService.getImgs(12);
      else this.imgs = await designService.getImgs(60, this.imgSearch);
    },
    closeModal() {
      this.$emit('close');
    },
    setCoverColor(color) {
      if (color === this.task.style.cover.color) {
        this.resetCover();
      } else {
        this.task.style.cover.color = color;
        this.task.style.cover.imgUrl = '';
        this.task.style.cover.type = 'color';
        if (!this.task.style.cover.style) this.setCoverStyle('solid');
      }
      this.$emit('updateTask', this.task);
    },
    async setCoverImg(imgUrl) {
      if (imgUrl === this.task.style.cover.imgUrl) {
        this.resetCover();
      } else {
        this.task.style.cover.type = 'img';
        this.task.style.cover.imgUrl = imgUrl;
        this.task.style.cover.color = await designService.getAvgColor(imgUrl);
        if (!this.task.style.cover.style) this.setCoverStyle('solid');
      }
      this.$emit('updateTask', this.task);
      if (this.isSearch) {
        this.isSearch = false;
        const imgs = await designService.getImgs(5);
        imgs.unshift(this.task.style.cover.imgUrl);
        this.imgs = imgs;
      }
    },
    resetCover() {
      this.task.style.cover.imgUrl = '';
      this.task.style.cover.color = '';
      this.task.style.cover.type = '';
    },
    setCoverStyle(coverStyle) {
      this.task.style.cover.style = coverStyle;
      this.$emit('updateTask', this.task);
    },
    async openImgSearch() {
      this.isSearch = true;
      const img = await designService.getImgs(12);
      this.imgs = img;
    },
    setSearch(keys) {
      this.imgSearch = keys;
      this.searchImg();
    },
    async closeSearch() {
      this.isSearch = false;
      const imgs = await designService.getImgs();
      if (this.task.style.cover.imgUrl && !imgs.some((img) => img === this.task.style.cover.imgUrl)) {
        imgs.splice(0, 1, this.task.style.cover.imgUrl);
      }
      this.imgs = imgs;
    },
    async onUploadImg(ev) {
      this.loading = true;
      this.loading = true;
      const attachment = {
        type: 'image',
        url: await imgService.uploadImg(ev.target.files),
        name: ev.target.files[0].name,
        created: new Date().getTime(),
      };
      this.loading = false;
      this.task.attachments.push(attachment);
      this.setCoverImg(attachment.url);
    },
  },
  async created() {
    this.imgs = await designService.getImgs();

    // this.$store.dispatch('loadDesign');
    // this.task.style.color = this.task.style.cover.color;
    // this.task.style.imgUrl = this.task.style.cover.imgUrl;
    // const imgs = await designService.getImgs();
    // if (this.task.style.imgUrl && !imgs.some((img) => img === this.task.style.imgUrl)) {
    //   imgs.splice(0, 1, this.currImg);
    // }
    // this.imgs = imgs;
  },
};
</script>

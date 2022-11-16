<template>
  <section class="attachment-cmp">
    <header>
      <h2>Attach from…</h2>
      <button @click="close">
        <icon-base iconName="x" />
      </button>
    </header>
    <div class="upload-container">
      <label for="uploadImg">
        <span v-if="loading">Uploading Image...</span>
        <div v-else>
          Computer
          <input id="uploadImg" type="file" @change="attachLink('image', $event)" hidden />
        </div>
      </label>
    </div>
    <div class="attach-link-container">
      <h2>Attach a link</h2>
      <input v-model="url" type="text" placeholder="Paste any link here..." />
      <div v-if="url !== ''">
        <h2>Link name (optional)</h2>
        <input v-model="linkName" type="text" />
      </div>
      <button class="attach-btn" @click="attachLink('link')">Attach</button>
    </div>
  </section>
</template>
<script>
import iconBase from '../icon-base.vue';
import { imgService } from '../../services/imgUpload.service.js';
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  created() {
    console.log(this.task);
  },
  data() {
    return {
      attachment: {
        linkName: '',
        url: '',
      },
      loading: false,
    };
  },
  methods: {
    async attachLink(type, ev) {
      if (type === 'image') {
        this.loading = true;
        this.url = await imgService.uploadImg(ev.target.files);
        this.loading = false;
        this.linkName = ev.target.files[0].name;
      }
      // if (!this.url.includes('https://')) return;
      const attachment = {
        type,
        url: this.url,
        name: this.linkName,
        created: new Date().getTime(),
      };
      this.task.attachments.push(attachment);
      this.$emit('updateTask', this.task);
      this.close();
      // this.$emit('saveAttachment', attachment);
    },
    // async onUploadImg(ev) {
    //   this.loading = true;
    //   this.url = await imgService.uploadImg(ev);
    //   this.loading = false;
    //   // const { url, original_filename, original_extension, format } = res;
    //   const attachment = {
    //     type: 'image',
    //     url,
    //     fileName: `${original_filename}.${original_extension ?? format}`,
    //     created: new Date().getTime(),
    //   };
    //   this.close();

    //   this.$emit('saveAttachment', attachment);
    // },
    saveAttachment(attachment) {
      // const attachments = [attachment, ...this.task.attachments];
      // this.$store.dispatch({
      //   type: 'updateTask',
      //   taskPartial: { id: this.task, attachments },
      //   groupId: this.group,
      // });
      // this.task.attachments = attachments;
      // const title = attachment.name ? attachment.name : attachment.url;
      // socketService.emit('loading', { ...this.task });
      // this.addActivity({ type: 'activity-cmp', action: `attached ${title} to this card` });
      // this.$emit('updateTask', this.task);
    },
    close() {
      this.$emit('close');
    },
  },
  components: {
    iconBase,
  },
};
</script>

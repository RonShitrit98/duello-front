<template>
  <section class="activity" v-if="task && user">
    <div class="header">
      <icon-base class="activity-icon" iconName="real-activity" />
      <div>
        <h3>Activity</h3>
        <button @click.stop="isFilter = !isFilter">{{ showDetails }}</button>
      </div>
    </div>

    <div class="activity-form">
      <img :src="user.imgUrl" referrerpolicy="no-referrer" alt="user" />

      <div :class="['comment-frame', isShow]">
        <div class="comment-box">
          <resizable-textarea
            :value="newComment.txt"
            @valueChange="edit"
            @click="open"
            @focusOut="close"
            :placeholder="'Write a comment...'"
          />

          <button :class="['save-comment', isAllowed]" @click.stop="save">
            Save
          </button>

          <div class="comment-box-options">
            <icon-base class="option" @click="log" iconName="paperclip" />
            <icon-base class="option" @click="log" iconName="mention" />
            <icon-base class="option" @click="log" iconName="emoji" />
            <icon-base class="option" @click="log" iconName="cardS" />
          </div>
        </div>
      </div>
    </div>

    <div class="activity-list">
      <div v-for="content in contentForDisplay" :key="content.id">
        <component
          :is="content.type"
          :comment="content"
          :info="content"
          @edit="editComment"
          @deleteComment="deleteComment(content.id)"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { taskService } from "../../services/task.service";
// import { socketService } from '../services/socket.service';
import iconBase from "../icon-base.vue";
import commentCmp from "../dynamic-components/comment-cmp.vue";
import activityCmp from "../dynamic-components/activity-cmp.vue";
import resizableTextarea from "../resizable-textarea.vue";

export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      newComment: taskService.getEmptyComment(),
      add: false,
      isAction: false,
      taskToEdit: { ...this.task },
      isFilter: true,
      mixedContent: [],
      cmpType: "",
    };
  },
  created() {
    // this.getContentForDisplay();
    // socketService.on('update', () => {
    //   setTimeout(() => {
    //     this.getContentForDisplay();
    //   }, 1000);
    // });
  },
  methods: {
    edit(txt) {
      this.newComment.txt = txt;
    },
    getContentForDisplay() {
      // this.$nextTick(() => {
      // console.log(this.task.comments);
      const activities = this.board.activities.filter(
        (activity) => activity.task.id === this.taskToEdit.id
      );
      this.mixedContent = this.task.comments
        .concat(activities)
        .sort((a, b) => b.createdAt - a.createdAt);
      // });
    },
    deleteComment(commentId) {
      this.$emit("deleteComment", commentId);
      // this.getContentForDisplay();
    },
    editComment(comment) {
      this.$emit("edit", comment, this.task.id);
      // this.getContentForDisplay();
    },
    log() {
      this.isAction = !this.isAction;
    },
    close() {
      setTimeout(() => {
        if (this.isAction) {
          this.isAction = !this.isAction;
          this.$refs.textarea.focus();
          return;
        }
        this.add = !this.add;
      }, 150);
    },
    open() {
      if (this.add) return;
      this.add = !this.add;
    },
    save() {
      if (!this.newComment.txt) return;
      this.newComment.byMember = {
        id: this.user._id,
        fullname: this.user.fullname,
        imgUrl: this.user.imgUrl,
      };
      this.newComment.createdAt = Date.now();
      this.task.comments.unshift(this.newComment)
      this.$emit('updateTask', this.task);
      this.newComment = taskService.getEmptyComment();
    },
  },
  computed: {
    showDetails() {
      return this.isFilter ? "Show details" : "Hide details";
    },
    isAllowed() {
      return this.newComment.txt ? "allowed" : "";
    },
    isShow() {
      return this.add ? "show" : "";
    },
    contentForDisplay() {
      if (!this.isFilter) return this.getContentForDisplay;
      return this.getContentForDisplay
        .filter((content) => !content.action)
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    getContentForDisplay() {
      // this.$nextTick(() => {
      // console.log(this.task.comments);
      const activities = this.board.activities.filter(
        (activity) => activity.task.id === this.taskToEdit.id
      );
      return this.task.comments
        .concat(activities)
        .sort((a, b) => b.createdAt - a.createdAt);
      // });
    },
  },
  components: {
    iconBase,
    commentCmp,
    activityCmp,
    activityCmp,
    resizableTextarea,
  },
};
</script>

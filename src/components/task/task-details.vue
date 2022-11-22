<template>
  <div @click.self="closeTaskDetails" class="details-bc">
    <div class="task-details" v-if="task">
      <div class="task-header-container">
        <button class="details-btn" @click="closeTaskDetails">
          <icon-base iconName="x" />
        </button>

        <div v-if="task.style.cover.type" class="cover-container">
          <div
            class="cover-clr"
            :style="'background-color:' + task.style.cover.color"
          >
            <img
              class="cover-img"
              v-if="task.style.cover.type === 'img'"
              :src="task.style.cover.imgUrl"
            />
          </div>
        </div>
        <div class="task-details-container">
          <icon-base class="card-header" iconName="cardB" />
          <div>
            <textarea v-model="task.title" @keyup="updateTask"></textarea>
            <!-- <resizable-textarea :value="task.title" @valueChange="handleTitleChange" @focusOut="saveTitle" /> -->
            <div class="info-in-group">
              <p>
                in list
                <span>{{ group.title }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="main-container">
        <div class="content-displayed">
          <div class="container">
            <div v-if="task.members.length" class="member-list">
              <h2>Memebers</h2>
              <div class="member-container">
                <ul>
                  <li v-for="member in task.members" :key="member._id">
                    <img :src="member.imgUrl" />
                  </li>
                </ul>
                <button class="add-btn" @click="selectComponent('member-cmp')">
                  <icon-base iconName="plus" />
                </button>
              </div>
            </div>
            <div class="labels-for-display" v-if="labels.length >= 1">
              <h2>Labels</h2>
              <div class="labels-container">
                <div
                  class="label"
                  v-for="label in labels"
                  :key="label.id"
                  :style="'background-color:' + label.color"
                >
                  {{ label.title }}
                </div>
                <button class="add-btn" @click="selectComponent('label-cmp')">
                  <icon-base iconName="plus" />
                </button>
              </div>
            </div>
            <div
              class="dueDate"
              v-if="task.dueDate"
              @click="selectComponent('calendar-cmp')"
            >
              <h2>Due date</h2>
              <span>
                {{ formatDate(task.dueDate) }}
                <icon-base iconName="chevron-down" />
              </span>
            </div>
          </div>
          <description-details :task="task" @save="saveDesc" />
          <attachment-details :attachments="task.attachments" />
          <checklist-details
            v-for="checklist in task.checklists"
            :key="checklist.id"
            :checklist="checklist"
            @updateCheck="updateChecklist"
          />
          <activity-details
            :task="task"
            :user="loggedinUser"
            :board="board"
            @updateTask="updateTask"
            @save="saveComment"
            @edit="editComment"
            @deleteComment="deleteComment"
          />
        </div>
        <task-details-menu
          :isMember="isMember"
          @joinTask="joinTask"
          @openModal="selectComponent"
          @removeTask="removeTask"
        />
        <div class="dynamic-cmp">
          <component
            :is="cmp"
            :board="board"
            :task="task"
            :groups="groups"
            @close="hideComponent"
            @updateTask="updateTask"
            @updateBoard="updateBoard"
          />
        </div>
      </div>
    </div>
    <loader v-else color="white" />
  </div>
</template>

<script>
import { useBoardStore } from "../../stores/board.store";
import { utilService } from "../../services/util.service";
import { boardService } from "../../services/board.service";
// import { socketService } from '../services/socket.service';
import taskDetailsMenu from "./task-details-menu.vue";
import descriptionDetails from "./description-details.vue";
import activityDetails from "./activity-details.vue";
import attachmentDetails from "./attachment-details.vue";
import checklistDetails from "./checklist-details.vue";
import labelCmp from "../dynamic-components/label-cmp.vue";
import memberCmp from "../dynamic-components/member-cmp.vue";
import checklistCmp from "../dynamic-components/checklist-cmp.vue";
import calendarCmp from "../dynamic-components/calendar-cmp.vue";
import attachmentCmp from "../dynamic-components/attachment-cmp.vue";
import coverCmp from "../dynamic-components/cover-cmp.vue";
import giphyCmp from "../dynamic-components/giphy-cmp.vue";
import copyCmp from "../dynamic-components/copy-cmp.vue";
import iconBase from "../icon-base.vue";
import resizableTextarea from "../resizable-textarea.vue";
// import { threadId } from 'worker_threads';
import loader from "../loader.vue";

export default {
  setup() {
    const boardStore = useBoardStore();
    return { boardStore };
  },
  props: {
    task: {
      type: Object,
      required: true,
    },
    group: {
      type: Object,
      required: true,
    },
    boardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // loggedinUser: null,
      // savedDate: null,
      cmp: null,
    };
  },
  async created() {
    console.log(this.task.style.cover);
    // const user = await this.$store.getters.user;
    // this.loggedinUser = user;
    // const res = await taskService.getById(this.taskId, this.groupId, this.boardId);
    // this.taskToEdit = { ...res.task };
    // this.group = { ...res.group };
    // socketService.emit('details', this.taskToEdit.id);
    // socketService.on('update', async (board) => {
    // const res = await taskService.getById(this.taskId, this.groupId, this.boardId);
    // this.taskToEdit = { ...res.task };
    // });
  },
  methods: {
    async updateTask(task = this.task, activity) {
      try {
        utilService.spliceItem(task.id, this.group.tasks, task);
        utilService.spliceItem(this.group.id, this.board.groups, this.group);
        if (activity) this.addActivity(activity);
        await this.boardStore.updateBoard(this.board);
      } catch (error) {
        console.log(error);
      }
    },
    async updateBoard(board = this.board) {
      await this.boardStore.updateBoard(board);
    },
    removeTask() {
      utilService.spliceItem(this.task.id, this.group.tasks);
      this.updateBoard();
      this.closeTaskDetails();
    },
    addActivity({ type, action }) {
      const activity = boardService.getEmptyActivity();
      activity.type = type;
      activity.action = action;
      activity.byMember = this.loggedinUser._id;
      activity.task = { id: this.task.id, title: this.task.title };
      this.board.activities.unshift(activity);
      // socketService.emit("loading", { ...this.task });
    },
    updateChecklist(action, checklist) {
      const replace = action === "remove" ? false : checklist;
      utilService.spliceItem(checklist.id, this.task.checklists, replace);
      this.updateTask();
      // socketService.emit('loading', { ...this.task });
      // this.addActivity({ type: 'activity-cmp', action: `updated ${checklist.title} in this card` });
    },
    joinTask() {
      this.task.members.unshift(this.loggedinUser);
      const activity = {
        type: "activity-cmp",
        action: `assinged ${this.loggedinUser.fullname}`,
      };
      this.updateTask(this.task, activity);
    },
    deleteComment(commentId) {
      const comments = this.task.comments.filter((com) => com.id !== commentId);
      this.$store.dispatch({
        type: "updateTask",
        taskPartial: { id: this.task, comments },
        groupId: this.group,
      });
      this.task.comments = comments;
    },
    editComment(comment) {
      const comments = this.task.comments.map((com) => {
        if (com.id === comment.id) {
          com = comment;
          return com;
        }
        return com;
      });
      this.$store.dispatch({
        type: "updateTask",
        taskPartial: { id: this.task, comments },
        groupId: this.group,
      });
      this.task.comments = comments;
      this.addActivity({
        type: "activity-cmp",
        action: `edited a comment from this card`,
      });
    },
    async saveComment(comment, taskId) {
      if (!taskId) {
        taskId = this.task.id;
      }
      this.task.comments.unshift(comment);
      await this.$store.dispatch({
        type: "updateTask",
        taskPartial: { id: taskId, comments: [...this.task.comments] },
        groupId: this.group,
      });
      this.addActivity({
        type: "activity-cmp",
        action: `added comment from this card`,
      });
    },
    formatDate(dateString) {
      return new Date(dateString).toDateString();
    },
    saveDesc(task) {
      this.task = task;
      socketService.emit("loading", { ...this.task });
      this.$store.dispatch({
        type: "updateTask",
        taskPartial: task,
        groupId: this.group,
      });
    },
    selectComponent(type) {
      if (this.cmp === type) {
        this.hideComponent();
      } else {
        this.cmp = type;
      }
    },
    hideComponent() {
      this.cmp = null;
    },
    closeTaskDetails() {
      this.$emit("closeTaskDetails");
    },
    addMember(member) {
      // const idx = this.task.members.findIndex(
      //   (mmbr) => mmbr._id === member._id
      // );
      // if (idx === -1) {
      //   this.task.members.unshift(member);
      // } else {
      //   this.task.members.splice(idx, 1);
      // }
      // const activity = {
      //   type: "activity-cmp",
      //   action: `assigned ${member.fullname} to`,
      // };
      // this.updateTask(this.task, activity);
      // // socketService.emit("loading", { ...this.task });
      // // this.doUpdateTask();
    },
    async addChecklist(newChecklist) {
      // this.task.checklist.unshift(newChecklist);
      // await this.doUpdateTask();
      // // socketService.emit('loading', { ...this.task });
      // this.addActivity({
      //   type: "activity-cmp",
      //   action: `added ${newChecklist.title} to this card`,
      // });
      // this.hideComponent();
    },
    removeChecklist(checkId) {
      // const idx = this.task.checklist.findIndex((list) => list.id === checkId);
      // const title = this.task.checklist[idx].title;
      // this.task.checklist.splice(idx, 1);
      // socketService.emit('loading', { ...this.task });
      // this.doUpdateTask();
      // this.addActivity({ type: 'activity-cmp', action: `removed ${title} from this card` });
    },
    doUpdateTask() {
      // this.$store.dispatch({
      //   type: 'updateTask',
      //   taskPartial: JSON.parse(JSON.stringify(this.taskToEdit)),
      //   groupId: this.groupId,
      // });
    },
    setCoverStyle(coverStyle) {
      // this.task.style.cover.style = coverStyle;
      // socketService.emit('loading', { ...this.task });
      // this.doUpdateTask();
    },
    async setCoverImg(imgUrl) {
      // this.task.style.cover.type = 'img';
      // this.task.style.cover.imgUrl = imgUrl;
      // if (imgUrl) this.task.style.cover.color = (await designService.getAvgColor(this.task.style.cover.imgUrl)).hex;
      // else this.task.style.cover.color = '';
      // if (!this.task.style.cover.style && imgUrl) this.task.style.cover.style = 'solid';
      // socketService.emit('loading', { ...this.task });
      // this.doUpdateTask();
    },
    setCoverColor(color) {
      // this.task.style.cover.type = 'color';
      // this.task.style.cover.color = color;
      // this.task.style.cover.imgUrl = '';
      // if (!this.task.style.cover.style && color) this.task.style.cover.style = 'solid';
      // socketService.emit('loading', { ...this.task });
      // this.doUpdateTask();
    },
    deleteBoardLabel(labelId) {
      // this.$store.dispatch({
      //   type: 'deleteBoardLabel',
      //   labelId: labelId,
      //   boardId: this.boardId,
      // });
    },
    updateBoardLabel(label) {
      // this.$store.dispatch({
      //   type: 'updateBoardLabel',
      //   label: label,
      //   boardId: this.boardId,
      // });
    },
    async addLabel(label) {
      // const labelId = label.id;
      // if (!this.task.labelIds) {
      //   this.task.labelIds = [labelId];
      // } else {
      //   if (this.task.labelIds.includes(labelId)) {
      //     this.task.labelIds = this.task.labelIds.filter((id) => id !== labelId);
      //   } else {
      //     this.task.labelIds.unshift(labelId);
      //   }
      // }
      // socketService.emit('loading', { ...this.task });
      // await this.doUpdateTask();
    },
    async removeDate() {
      // this.hideComponent();
      // this.task.dueDate = null;
      // try {
      //   this.$store.dispatch({
      //     type: 'updateTask',
      //     taskPartial: this.task,
      //     groupId: this.group,
      //   });
      // } catch (err) {
      //   console.log(err);
      // }
      // socketService.emit('loading', { ...this.task });
      // this.addActivity({ type: 'activity-cmp', action: `removed the due date from this card` });
    },
    async saveDate(date) {
      // console.log(date);
      // this.hideComponent();
      // this.task.dueDate = date;
      // socketService.emit('loading', { ...this.task });
      // try {
      //   this.$store.dispatch({
      //     type: 'updateTask',
      //     taskPartial: this.task,
      //     groupId: this.group,
      //   });
      // } catch (err) {
      //   console.log(err);
      // }
      // const title = this.formatDate(this.task.dueDate);
      // this.addActivity({ type: 'activity-cmp', action: `set this card to be due ${title}` });
    },
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
    },
    createBoardLabel(labelData) {
      // this.$store.dispatch({
      //   type: 'createBoardLabel',
      //   labelData: labelData,
      //   boardId: this.boardId,
      // });
    },
  },
  computed: {
    loggedinUser() {
      return this.boardStore.currUser;
    },
    labels() {
      return this.task.labelIds.map((labelId) => {
        return this.board.labels.find((label) => label.id === labelId);
      });
    },
    board() {
      return this.boardStore.currBoard;
    },
    isMember() {
      return this.task.members.some(
        (member) => member._id === this.loggedinUser._id
      );
    },
    coverStyle() {
      if (this.task.style.cover.type === "color") {
        return `background-color: ${this.task.style.cover.color}`;
      }
      if (this.task.style.cover.type === "img") {
        return `background-image: url(${this.task.style.cover.imgUrl}); max-height: 160px `;
      }
      return "";
    },
    groups() {
      return this.boardStore.currBoard.groups;
    },
  },
  components: {
    taskDetailsMenu,
    labelCmp,
    memberCmp,
    checklistCmp,
    checklistDetails,
    calendarCmp,
    coverCmp,
    descriptionDetails,
    activityDetails,
    attachmentCmp,
    attachmentDetails,
    iconBase,
    giphyCmp,
    resizableTextarea,
    copyCmp,
    loader,
  },
};
</script>

<template>
  <section class="task-quick-edit">
    <div class="backdrop" @click="close"></div>
    <div class="task-wrapper" :style="style" v-if="task">
      <div class="task-preview-container">
        <div v-if="task.style.cover.style === 'solid'" class="task-prev-cover">
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
        <task-preview
          :style="
            task.style.cover.style === 'background'
              ? `background-image: url(${task.style.cover.imgUrl}); background-color:${task.style.cover.color}`
              : ''
          "
          :class="[
            task.style.cover.style === 'background' &&
            task.style.cover.type === 'img'
              ? 'task-prev-bcg'
              : '',
            task.style.cover.style === 'background' &&
            task.style.cover.type === 'color'
              ? 'task-prev-clr'
              : '',
          ]"
          :task="this.task"
          :canEditTitle="true"
        ></task-preview>
        <span
          class="bcg-helper"
          v-if="task.style.cover.style === 'background'"
        ></span>
      </div>
      <div class="edit-menu">
        <button @click="openDetails">
          <icon-base iconName="cardB" />
          <span>Open Card</span>
        </button>
        <button @click="selectComponent('label-cmp')">
          <icon-base iconName="label" />
          <span>Edit labels</span>
        </button>
        <button @click="selectComponent('member-cmp')">
          <icon-base iconName="member" />
          <span>Change members</span>
        </button>
        <button @click="selectComponent('cover-cmp')">
          <icon-base iconName="cover" />
          <span>Change cover</span>
        </button>
        <button @click="selectComponent('calendar-cmp')">
          <icon-base iconName="clock" />
          <span>Edit dates</span>
        </button>
        <button @click="removeTask">
          <icon-base iconName="archive" />
          <span>Archive</span>
        </button>
      </div>

      <div class="dynamic-cmp-container" v-if="cmp !== null">
        <component
          :is="cmp"
          :board="board"
          :task="task"
          :date="task.dueDate"
          @addMember="addMember"
          @updateTask="updateTask"
          @updateBoard="updateBoard"
          @close="hideComponent"
        />
      </div>
      <button @click="save" class="save-btn">Save</button>
    </div>
  </section>
</template>
<script>
import { boardService } from "../../services/board.service";
import { useBoardStore } from "../../stores/board.store";
import { utilService } from "../../services/util.service";
import iconBase from "../icon-base.vue";
import taskPreview from "./task-preview.vue";
import labelCmp from "../dynamic-components/label-cmp.vue";
import memberCmp from "../dynamic-components/member-cmp.vue";
import coverCmp from "../dynamic-components/cover-cmp.vue";
import calendarCmp from "../dynamic-components/calendar-cmp.vue";

export default {
  setup() {
    const boardStore = useBoardStore();
    return { boardStore };
  },
  props: {
    group: {
      type: Object,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
    position: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      taskPartial: null,
      taskToEdit: null,
      cmp: null,
      loggedinUser: null,
    };
  },
  methods: {
    async updateTask(task = this.task) {
      utilService.spliceItem(task.id, this.group.tasks, task);
      utilService.spliceItem(this.group.id, this.board.groups, this.group);
      await this.boardStore.updateBoard(this.board);
    },
    async updateBoard(board = this.board) {
      await this.boardStore.updateBoard(board);
    },
    removeTask() {
      utilService.spliceItem(this.task.id, this.group.tasks);
      this.updateBoard();
      this.close();
    },
    addMember(member) {
      const idx = this.taskToEdit.members.findIndex(
        (mmbr) => mmbr._id === member._id
      );
      let members;
      if (idx === -1) {
        members = [member, ...this.taskToEdit.members];
      } else {
        members = this.taskToEdit.members.filter(
          (mmbr) => mmbr.id !== member.id
        );
      }
      this.$store.dispatch({
        type: "updateTask",
        taskPartial: {
          id: this.taskToEdit.id,
          members,
        },
        groupId: this.group,
      });
    },
    addActivity({ type, action }) {
      const activity = boardService.getEmptyActivity();
      activity.type = type;
      activity.action = action;
      activity.byMember = this.loggedinUser;
      activity.task = { id: this.taskToEdit.id, title: this.taskToEdit.title };
      this.$store.dispatch({
        type: "updateTask",
        taskPartial: {
          id: this.taskToEdit.id,
          activities: [activity, ...this.taskToEdit.activities],
        },
        groupId: this.group,
      });
      // this.$store.dispatch({
      //   type: 'getActivities',
      // });
    },
    openDetails() {
      this.$emit("openDetails");
    },
    close() {
      this.$emit("close");
    },
    selectComponent(type) {
      this.cmp = type;
    },
    hideComponent() {
      this.cmp = null;
    },
    save() {
      this.updateTask();
      this.close();
    },
  },
  components: {
    iconBase,
    taskPreview,
    labelCmp,
    memberCmp,
    coverCmp,
    calendarCmp,
  },
  computed: {
    style() {
      return {
        left: this.position.left + "px",
        top: this.position.top + "px",
        width: this.width + "px",
      };
    },
    board() {
      return this.boardStore.currBoard;
    },
  },
};
</script>

<template>
  <section class="main-board" :style="bcg">
    <main-header />
    <board-header />

    <section class="groups-container" v-if="board">
      <div class="groups-container-wrapper">
        <Container
          orientation="horizontal"
          @drop="onDrop"
          :get-child-payload="getChildPayload"
          drag-class="card-ghost"
          drop-class="card-ghost-drop"
          :drop-placeholder="dropPlaceholderOptions"
        >
          <Draggable
            v-for="group in board.groups"
            :key="group.id"
            class="group-wrapper"
          >
            <group-list
              :group="group"
              :board="board"
              :draggingCard="draggingCard"
              @onDragTask="onDragTask"
              @setDraggedTask="setDraggedTask"
              @editGroup="editGroup"
              @removeGroup="removeGroup"
              @removeTask="removeTask"
              @addTask="addTask"
              @onOpen="openModal"
              @quickEdit="
                (task, position, width) =>
                  quickEdit(task, position, width, group)
              "
            />
          </Draggable>
          <add-group @addGroup="addGroup" class="group-wrapper" />
        </Container>
      </div>
    </section>
    <task-details
      v-if="isOpenModal"
      :task="taskId"
      :group="groupId"
      :boardId="board._id"
      @closeTaskDetails="isOpenModal = !isOpenModal"
      @updateTask="updateTask"
    />
    <task-quick-edit
      v-if="quickEditData !== null"
      :task="quickEditData.task"
      :position="quickEditData.position"
      :width="quickEditData.width"
      :group="quickEditData.group"
      @close="closeQuickEdit"
      @openDetails="openModal(quickEditData.task.id, quickEditData.group.id)"
      @updateTask="updateTask"
    />
  </section>
</template>

<script>
import { useBoardStore } from "../stores/board.store";
import { useUserStore } from "../stores/user.store";
import { Container, Draggable } from "vue3-smooth-dnd";
import { utilService } from "../services/util.service";
// import { socketService } from '../services/socket.service';
import boardHeader from "../components/header/board-header.vue";
import mainHeader from "../components/header/main-header.vue";
import groupList from "../components/board/group-list.vue";
import addGroup from "../components/board/add-group.vue";
import taskDetails from "../components/task/task-details.vue";
import taskQuickEdit from "../components/task/task-quick-edit.vue";

export default {
  setup() {
    const boardStore = useBoardStore();
    const userStore = useUserStore();
    return { boardStore, userStore };
  },
  data() {
    return {
      isOpenModal: false,
      taskId: null,
      groupId: null,
      quickEditData: null,
      draggingCard: null,
      dropPlaceholderOptions: {
        className: "drop-preview",
        animationDuration: "150",
        showOnTop: false,
      },
    };
  },
  async created() {
    await this.boardStore.loadBoard(this.$route.params.boardId);
    await this.userStore.loadUser();
    console.log(this.userStore.currUser);
    // const board = await this.$store.dispatch({
    //   type: 'loadBoard',
    //   boardId: this.$route.params.boardId,
    // });
    // this.board = this.$store.getters.board;
    // const user = this.$store.getters.user;

    // socketService.emit('on-board', this.board._id, user._id);
    // socketService.emit('set-user-socket', user._id);
    // socketService.on('update', (board, userId) => {
    // if (userId !== user._id) {
    //   console.log('update');
    //   this.board = { ...board };
    //   return;
    // }
    // this.$store.dispatch({ type: 'updateBoardSocket', board });
    // this.board = this.$store.getters.board;
    // });
  },
  destroyed() {
    // socketService.emit('unset-user-socket');
  },
  methods: {
    async onDragTask(group) {
      const updatedGroups = utilService.spliceItem(
        group.id,
        this.board.groups,
        group
      );
      this.board.group = updatedGroups;
      await this.boardStore.updateBoard(this.board);
    },
    setDraggedTask(task) {
      this.draggingCard = task;
    },
    async onDrop(dropResult) {
      dropResult.payload = this.getChildPayload(dropResult.removedIndex);
      const res = utilService.applyDrag(this.board.groups, dropResult);
      this.board.groups = res;
      await this.boardStore.updateBoard(this.board);
    },
    getChildPayload(index) {
      return this.board.groups[index];
    },
    closeQuickEdit() {
      this.quickEditData = null;
    },
    quickEdit(task, position, width, group) {
      this.quickEditData = { task, position, width, group };
    },
    openModal(taskId, groupId) {
      this.groupId = utilService.findItem(groupId, this.board.groups);
      this.taskId = utilService.findItem(taskId, this.groupId.tasks);
      console.log(this.taskId, this.groupId);
      // this.taskId = taskId;
      // this.groupId = groupId;
      this.isOpenModal = true;
      this.quickEditData = null;
    },
    addGroup(group) {
      this.board.groups.push(group);
      this.boardStore.updateBoard(this.board);
    },
    removeGroup(groupId) {
      // this.$store.dispatch({ type: 'removeGroup', groupId });
    },
    editGroup(newGroup) {
      // this.$store.dispatch({ type: 'updateGroup', newGroup });
    },
    removeTask(taskId, groupId) {
      // this.$store.dispatch({ type: 'removeTask', taskId, groupId });
    },
    updateTask(taskPartial, groupId) {
      // console.log(tak)
      // this.$store.dispatch({ type: 'updateTask', taskPartial, groupId });
    },
    addTask(task, groupId, boardId) {
      const group = this.board.groups.find((g) => groupId === g.id);
      group.tasks.push(task);
      this.boardStore.updateBoard(this.board);
    },
  },
  computed: {
    board() {
      return this.boardStore.currBoard;
    },
    bcg() {
      const style = this.boardStore.style;
      if (style.type === "img")
        return `background-image: url(${style.backgroundImg.url})`;
      else return `background-color: ${style.color}`;
    },
    user() {
      return this.boardStore.currUser;
    },
  },
  components: {
    boardHeader,
    mainHeader,
    groupList,
    addGroup,
    taskDetails,
    taskQuickEdit,
    Container,
    Draggable,
  },
};
</script>

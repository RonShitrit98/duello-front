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
          <Draggable v-for="group in board.groups" :key="group.id" class="group-wrapper">
            <board-group
              :group="JSON.parse(JSON.stringify(group))"
              :board="board"
              :draggingCard="draggingCard"
              @onDragTask="onDragTask"
              @setDraggedTask="setDraggedTask"
              @editGroup="editGroup"
              @removeGroup="removeGroup"
              @removeTask="removeTask"
              @updateTask="updateTask"
              @addTask="addTask"
              @onOpen="openModal"
              @quickEdit="(task, position, width) => quickEdit(task, position, width, group)"
            />
          </Draggable>
          <add-group @addGroup="addGroup" class="group-wrapper" />
        </Container>
      </div>
    </section>
    <task-details
      v-if="isOpenModal"
      :taskId="taskId"
      :groupId="groupId"
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
import { useBoardStore } from '../store/board.store';
import { Container, Draggable } from 'vue3-smooth-dnd';
import { socketService } from '../services/socket.service';
import { utilService } from '../services/util.service';
import boardHeader from '../components/board-header.vue';
import mainHeader from '../components/header/main-header.vue';
import boardGroup from '../components/board-group.vue';
import addGroup from '../components/add-group.vue';
import createBoard from '../components/header/create-board.vue';
import taskDetails from '../components/task-details.vue';
import taskQuickEdit from '../components/task-quick-edit.vue';

export default {
  setup() {
    const boardStore = useBoardStore();
    return { boardStore };
  },
  data() {
    return {
      isOpenModal: false,
      taskId: null,
      groupId: null,
      quickEditData: null,
      draggingCard: null,
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: false,
      },
    };
  },
  async created() {
    await this.boardStore.loadBoard(this.$route.params.boardId);
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
    socketService.emit('unset-user-socket');
  },
  methods: {
    async onDragTask(group) {
      const updatedGroups = utilService.spliceItem(group.id, this.board.groups, group);
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
      this.isOpenModal = true;
      this.taskId = taskId;
      this.groupId = groupId;
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
      if (style.type === 'img') return `background-image: url(${style.backgroundImg.url})`;
      else return `background-color: ${style.color}`;
    },
    user() {
      return this.boardStore.currUser;
    },
  },
  components: {
    boardHeader,
    mainHeader,
    boardGroup,
    addGroup,
    taskDetails,
    createBoard,
    taskQuickEdit,
    Container,
    Draggable,
  },
};
</script>

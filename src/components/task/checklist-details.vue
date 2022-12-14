<template>
  <section class="checklist-details" v-if="checklist">
    taskTo
    <div class="header">
      <icon-base class="checklist-icon" iconName="checklist" />
      <div class="container">
        <h3>{{ checklist.title }}</h3>
        <div>
          <button v-if="areDone" @click.stop="isFilter = !isFilter">
            {{ showHide }}
          </button>
          <button @click.stop="isRemoveCheck = !isRemoveCheck">Delete</button>
        </div>
      </div>

      <delete-modal
        :id="checklist"
        element="checklist"
        :pos="{ right: -240, top: 45 }"
        v-if="isRemoveCheck"
        @close="isRemoveCheck = !isRemoveCheck"
        @remove="removeChecklist"
      />

      <div class="progress-bar">
        <span class="percent">{{ percent }}%</span>

        <k-progress
          class="bar"
          :percent="percent"
          :color="isCompleted"
          :line-height="8"
          :show-text="false"
        ></k-progress>
      </div>
    </div>

    <div class="todos-container">
      <div
        class="checklist-item"
        v-for="todo in todosForDisplay"
        :key="todo.id"
      >
        <div
          :class="{ checkbox: true, complete: todo.isDone }"
          @click="
            todo.isDone = !todo.isDone;
            saveChecklist();
          "
        >
          <span>
            <icon-base iconName="check" :class="{ checked: todo.isDone }" />
          </span>
        </div>

        <div class="todo-details" @click="toggleEdit(todo.id)">
          <div class="text-and-controls" v-if="!isEdit || target !== todo.id">
            <span :class="{ done: todo.isDone }">{{ todo.title }}</span>
            <div class="todo-controls">
              <div class="todo-controller">
                <button>
                  <icon-base iconName="trello-clock" />
                </button>
              </div>
              <div class="todo-controller">
                <button class="round">
                  <icon-base iconName="member" />
                </button>
              </div>
              <div
                class="todo-controller"
                @click.stop="setModalType('delete-todo', todo.id)"
              >
                <button class="empty">
                  <icon-base iconName="more" />
                </button>
              </div>

              <component
                :is="modalType"
                :todo="todo"
                v-if="modalType && todo.id === target"
                @remove="removeTodo"
                @close="modalType = null"
              />
            </div>
          </div>

          <div class="add-todo edit-todo" v-if="isEdit && todo.id === target">
            <resizable-textarea
              :autofocus="true"
              :value="todo.title"
              @valueChange="(value) => (todo.title = value)"
            />

            <div class="add-controls">
              <div class="container">
                <button class="add-btn" @click.stop="saveChecklist">
                  Save
                </button>
                <icon-base
                  class="close-btn"
                  iconName="x"
                  @click.stop="toggleEdit('')"
                />
              </div>

              <div class="actions">
                <span>
                  <icon-base iconName="member" />
                  Assign
                </span>

                <span>
                  <icon-base iconName="trello-clock" />
                  Due date
                </span>

                <icon-base class="option" iconName="mention" />
                <icon-base class="option" iconName="emoji" />
                <icon-base
                  class="option"
                  iconName="more"
                  @click.stop="setModalType('delete-todo', todo.id)"
                />
              </div>
            </div>

            <component
              :is="modalType"
              :todo="todo"
              :pos="{ right: -271, top: 105 }"
              v-if="modalType && todo.id === target"
              @remove="removeTodo"
              @close="modalType = null"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="add-todo">
      <button v-if="!isAdd" @click="isAdd = !isAdd">Add an item</button>
      <resizable-textarea
        v-if="isAdd"
        :placeholder="'Add an item'"
        :autofocus="true"
        :value="todoToAdd.title"
        @valueChange="(value) => (todoToAdd.title = value)"
      />

      <div class="add-controls" v-if="isAdd">
        <div class="container">
          <button class="add-btn" @click.stop="addTodo">Add</button>
          <icon-base class="close-btn" iconName="x" @click="isAdd = !isAdd" />
        </div>

        <div class="actions">
          <span>
            <icon-base iconName="member" />
            Assign
          </span>

          <span>
            <icon-base iconName="trello-clock" />
            Due date
          </span>

          <icon-base class="option" iconName="mention" />
          <icon-base class="option" iconName="emoji" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { utilService } from "../../services/util.service";
import iconBase from "../icon-base.vue";
import deleteTodo from "../dynamic-components/delete-todo-cmp.vue";
import deleteModal from "./delete-modal.vue";
import resizableTextarea from "../resizable-textarea.vue";
import { taskService } from "../../services/task.service";

export default {
  props: {
    checklist: {
      type: Object,
      required: true,
    },
    isAllowed: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      length: 0,
      areDone: 0,
      isAdd: false,
      isEdit: false,
      todoToAdd: taskService.getEmptyTodo(),
      modalType: null,
      target: null,
      isRemoveCheck: false,
      isFilter: false,
    };
  },
  created() {
    this.calcDone();
    // socketService.on('update', () => {
    //   setTimeout(() => {
    //     this.checklist = this.checklist;
    //   }, 1000);
    // });
    // socketService.on('loading', (task) => {
    //   setTimeout(() => {
    //     this.listToEdit = task.checklist.find((currChecklist) => currChecklist.id === this.listToEdit.id);
    //     this.calcDone();
    //   }, 500);
    // });
  },
  methods: {
    toggleEdit(todoId) {
      if(!this.isAllowed) return
      this.isEdit = !this.isEdit;
      if (this.target) {
        this.target = null;
        return;
      }
      this.target = todoId;
    },
    setModalType(type, id) {
      if(!this.isAllowed) return
      if (this.modalType) {
        this.modalType = null;
        this.target = null;
        return;
      }
      this.target = id;
      this.modalType = type;
    },
    removeTodo(todoId) {
      if(!this.isAllowed) return
      utilService.spliceItem(todoId, this.checklist);
      this.saveChecklist();
      // const idx = this.checklist.todos.findIndex((todo) => todo.id === todoId);
      // this.checklist.todos.splice(idx, 1);
      // this.$emit('save', { ...this.checklist });
    },
    addTodo() {
      if(!this.isAllowed) return
      if (!this.todoToAdd.title) return;
      this.checklist.todos.push(this.todoToAdd);
      this.saveChecklist();
      this.todoToAdd = taskService.getEmptyTodo();
      this.calcDone();
    },
    saveChecklist() {
      if(!this.isAllowed) return
      this.$emit("updateCheck", "save", this.checklist);
      this.calcDone();
      // if (this.isEdit) this.isEdit = !this.isEdit;
      this.isEdit = !this.isEdit;
    },
    removeChecklist(checklist) {
      if(!this.isAllowed) return
      this.isRemoveCheck = false;
      this.$emit("updateCheck", "remove", checklist);
    },
    calcDone() {
      if (!this.checklist.todos.length || !this.checklist.todos) {
        this.length = 1;
        this.areDone = 0;
        return;
      }
      this.length = this.checklist.todos.length;
      const done = this.checklist.todos.filter((todo) => todo.isDone);
      this.areDone = done.length;
    },
  },
  computed: {
    percent() {
      return +((this.areDone / this.length) * 100).toFixed();
    },
    todosForDisplay() {
      if (this.isFilter) {
        const unchecked = this.checklist.todos.filter((todo) => !todo.isDone);
        return unchecked;
      } else return this.checklist.todos;
    },
    showHide() {
      if (!this.isFilter && this.areDone) return "Hide checked items";
      else return `Show checked items (${this.areDone})`;
    },
    isCompleted() {
      return this.percent === 100 ? "#61bd4f" : "#5ba4cf";
    },
  },
  components: {
    iconBase,
    deleteTodo,
    deleteModal,
    resizableTextarea,
  },
};
</script>

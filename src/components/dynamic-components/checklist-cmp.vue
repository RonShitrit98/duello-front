<template>
  <section class="checklist-cmp">
    <header>
      <span>Add checklist</span>
      <icon-base iconName="x" @click="close"></icon-base>
    </header>

    <div class="container">
      <form @submit.prevent="addChecklist" class="add-checklist">
        <label for="title" class="input-label">Title</label>
        <input
          type="text"
          id="title"
          v-model="newChecklist.title"
          ref="myInput"
        />

        <label class="input-label">Copy items from…</label>

        <!-- <select v-model="selectedChecklist">
          <optgroup>
            <option value="">(none)</option>
          </optgroup>
          <optgroup v-for="check in checklists" :key="check.id" :label="check.taskTitle">
            <option :value="check">{{ check.title }}</option>
          </optgroup>
        </select> -->
        <button @mousedown="toggleFocus" @mouseup="toggleFocus">Add</button>
      </form>
    </div>
  </section>
</template>
<script>
import { taskService } from "../../services/task.service";
import { utilService } from "../../services/util.service";
import iconBase from "../icon-base.vue";

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
    isAllowed: {
      yupe: Boolean,
      required: true,
    },
  },
  data() {
    return {
      // selectedChecklist: null,
      // title: 'Checklist',
      newChecklist: taskService.getEmptyChecklist(),
    };
  },
  created() {
    // this.$store.dispatch({ type: 'getChecklists' });
  },
  methods: {
    addChecklist() {
      if (!this.newChecklist.title || !this.isAllowed) return;
      this.task.checklists.push(this.newChecklist);
      this.$emit("updateTask", this.task, this.newActiv);
      this.close();
      this.newChecklist = taskService.getEmptyChecklist();
      // const todos = this.selectedChecklist === null ? [] : this.selectedChecklist.todos;
      // this.$emit('addChecklist', { id: utilService.makeId(), title: this.title, todos });
      // this.selectedChecklist = null;
    },
    toggleFocus(ev) {
      if (ev.type === "mousedown" && !this.title) {
        this.$refs.myInput.style.backgroundColor = "#fafbfc";
        this.$refs.myInput.style.boxShadow = "none";
      } else {
        this.$refs.myInput.style.backgroundColor = "#fff";
        this.$refs.myInput.style.boxShadow = "inset 0 0 0 2px #0079bf";
      }
    },
    close() {
      this.$emit("close");
    },
  },
  computed: {
    newActiv() {
      return {
        type: "activity-cmp",
        action: `added ${this.newChecklist.title}`,
      };
    },
  },
  watch: {
    // selectedChecklist() {
    //   if (!this.selectedChecklist) {
    //     this.title = 'Checklist';
    //   } else {
    //     this.title = this.selectedChecklist.title;
    //   }
    // },
  },
  // computed: {
  //   checklists() {
  //     // return this.$store.getters.checklists;
  //   },
  // },
  components: { iconBase },
};
</script>

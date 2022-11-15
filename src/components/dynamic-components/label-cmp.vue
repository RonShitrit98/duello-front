<template>
  <section v-if="editingLabel" class="label-cmp">
    <header>
      <button class="back-btn" @click="goBack">
        <icon-base iconName="chevron-left" />
      </button>
      <h2>Change label</h2>
      <button @click="close">
        <icon-base iconName="x" />
      </button>
    </header>
    <div class="main-content">
      <h2>Name</h2>
      <input type="text" v-model="editingLabel.title" />
      <h2>Select a color</h2>
      <ul class="color-options">
        <li v-for="option in labelOptions" @click="updateColor(option)" :style="'background-color:' + option">
          <icon-base iconName="check" v-if="editingLabel.color === option" />
        </li>
      </ul>
      <div class="edit-btns">
        <button class="save-btn" @click="updateLabel">Save</button>
        <button class="delete-btn" @click="deleteLabel">Delete</button>
      </div>
    </div>
  </section>

  <section v-else-if="isCreatingLabel" class="label-cmp">
    <header>
      <button class="back-btn" @click="goBack">
        <icon-base iconName="chevron-left" />
      </button>
      <h2>Create label</h2>
      <button @click="close">
        <icon-base iconName="x" />
      </button>
    </header>
    <div class="main-content">
      <h2>Name</h2>
      <input type="text" v-model="creatingLabel.title" />
      <h2>Select a color</h2>
      <ul class="color-options">
        <li v-for="option in labelOptions" @click="setColor(option)" :style="'background-color:' + option">
          <icon-base iconName="check" v-if="creatingLabel.color === option" />
        </li>
      </ul>
      <button class="create-btn" @click="createLabel">Create</button>
    </div>
  </section>

  <section v-else class="label-cmp">
    <header>
      <h2>Labels</h2>
      <button @click="close">
        <icon-base iconName="x" />
      </button>
    </header>
    <input type="search" placeholder="Search labels..." v-model="search" />
    <div class="main-content">
      <h2>Labels</h2>
      <ul>
        <li v-for="label in filteredLabels" :key="label.id">
          <div @click="toggleLabel(label)" class="edit-label" :style="'background-color:' + label.color">
            <span>{{ label.title }}</span>
            <icon-base iconName="check" v-if="isLabelSelected(label)" />
          </div>
          <button @click="edit(label)">
            <icon-base iconName="pencil" />
          </button>
        </li>
      </ul>
    </div>
    <button class="createNew-btn" @click="create">Create a new label</button>
  </section>
</template>
<script>
import { utilService } from '../../services/util.service';
import { taskService } from '../../services/task.service';
import iconBase from '../icon-base.vue';
export default {
  components: { iconBase },
  props: {
    task: {
      type: Object,
      required: true,
    },
    board: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      editingLabel: null,
      creatingLabel: taskService.getEmptyLabel(),
      isCreatingLabel: false,
      labelOptions: [
        '#61bd4f',
        '#f2d600',
        '#ff9f1a',
        '#eb5a46',
        '#c377e0',
        '#0079bf',
        '#00c2e0',
        '#51e898',
        '#ff78cb',
        '#344563',
      ],
    };
  },
  methods: {
    updateColor(option) {
      this.editingLabel.color = option;
    },
    setColor(option) {
      this.creatingLabel.color = option;
    },
    updateLabel() {
      this.$emit('updateBoard', this.board);
      this.goBack();
      // this.$emit('updateBoardLabel', {
      //   ...this.editingLabel.label,
      //   title: this.editingLabel.title,
      //   color: this.editingLabel.color,
      // });
      // this.editingLabel = null;
    },
    deleteLabel() {
      utilService.spliceItem(this.editingLabel.id, this.board.labels);
      this.$emit('updateBoard', this.board);
      this.goBack();
      // this.$emit('deleteBoardLabel', this.editingLabel.label.id);
      // this.editingLabel = null;
    },
    createLabel() {
      this.board.labels.push(this.creatingLabel);
      this.$emit('updateBoard', this.board);
      this.goBack();
      // this.$emit('createBoardLabel', {
      //   title: this.creatingLabel.title,
      //   color: this.creatingLabel.color,
      // });
      // this.creatingLabel = null;
    },
    goBack() {
      this.editingLabel = null;
      this.creatingLabel = taskService.getEmptyLabel();
      this.isCreatingLabel = false;
    },
    edit(label) {
      this.editingLabel = label;
    },
    create() {
      this.isCreatingLabel = true;
    },
    toggleLabel(label) {
      if (this.task.labelIds.includes(label.id)) {
        const idx = this.task.labelIds.findIndex((labelId) => labelId === label.id);
        this.task.labelIds.splice(idx, 1);
      } else {
        this.task.labelIds.unshift(label.id);
      }
      // console.log(this.task)
      this.$emit('updateTask', this.task);
    },
    close() {
      this.$emit('close');
    },
    isLabelSelected(label) {
      return this.task.labelIds.includes(label.id);
    },
  },
  computed: {
    filteredLabels() {
      console.log(this.board.labels);

      return this.board.labels;
      // return this.board.labels.filter((label) => {
      //   return label.title.toLowerCase().includes(this.search.trim().toLowerCase());
      // });
    },
  },
};
</script>

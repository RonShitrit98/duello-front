<template>
  <section class="calendar-cmp">
    <header>
      <h2>Dates</h2>
      <button @click="close">
        <icon-base iconName="x" />
      </button>
    </header>
    <v-date-picker class="calendar" v-model="task.dueDate" />
    <button class="save-btn" @click="saveDate">Save</button>
    <button class="remove-btn" @click="removeDate">Remove</button>
  </section>
</template>
<script>
import { DatePicker } from 'v-calendar';
import iconBase from '../icon-base.vue';
export default {
  props: {
    task: {
      type: String,
      required: true,
    },
  },
  methods: {
    saveDate() {
      this.$emit('updateTask', this.task);
      this.close();
    },

    removeDate() {
      this.task.dueDate = null;
      this.$emit('updateTask', this.task);
      this.close();
    },
    close() {
      this.$emit('close');
    },
  },
  components: {
    DatePicker,
    iconBase,
  },
};
</script>

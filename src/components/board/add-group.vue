<template>
  <section :class="[{ open: addedGroup }, 'group add-group', txtClr]">
    <div class="add-group-content" @click="showForm">
      <icon-base class="plus-btn" iconName="Plus"></icon-base>
      <span>Add another list</span>
    </div>

    <form class="add-group-form" @submit.prevent="addGroup">
      <div class="input-container">
        <input
          ref="input"
          type="text"
          placeholder="Enter list title..."
          v-model="emptyGroup.title"
          @blur="addedGroup = !addedGroup"
        />
      </div>
      <div class="add-group-btns">
        <button @mousedown="addGroup" @touchstart="addGroup" type="button">
          Add list
        </button>
        <button @click="addedGroup = !addedGroup">
          <img src="../assets/icons/x.svg" alt="close form" />
        </button>
      </div>
    </form>
  </section>
</template>

<script>
import { useBoardStore } from "../../stores/board.store";
import { groupService } from "../../services/group.service";
import iconBase from "../icon-base.vue";
export default {
  setup() {
    const boardStore = useBoardStore();
    return { boardStore };
  },
  data() {
    return {
      addedGroup: false,
      emptyGroup: groupService.getEmptyGroup(),
    };
  },
  methods: {
    addGroup(e) {
      if (!this.emptyGroup.title) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      this.$emit("addGroup", this.emptyGroup);
      this.emptyGroup = groupService.getEmptyGroup();
      // this.title = '';
    },
    showForm() {
      this.title = "";
      this.addedGroup = true;
    },
  },
  components: { iconBase },
  updated() {
    if (this.addedGroup) {
      this.$refs.input.focus();
    }
  },
  computed: {
    txtClr() {
      if (this.boardStore.style.isDark) return "light-bcg";
    },
  },
};
</script>

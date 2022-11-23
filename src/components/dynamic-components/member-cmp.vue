<template>
  <section class="members-cmp">
    <header>
      <h2>Members</h2>
      <button @click="close">
        <icon-base iconName="x" />
      </button>
    </header>
    <div class="main-content">
      <input
        type="search"
        placeholder="Search members..."
        v-model="searchMember"
      />
      <h2>Board members</h2>
      <ul class="memeber-list">
        <li
          v-for="member in filteredMembers"
          :key="member.id"
          @click="toggleMember(member)"
        >
          <img :src="member.imgUrl" />
          <span class="member-name">{{ member.fullname }}</span>
          <label v-if="isMemberSelected(member._id)"
            ><icon-base iconName="check"
          /></label>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
import { utilService } from "../../services/util.service";
import iconBase from "../icon-base.vue";
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
    isAllowed: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      searchMember: "",
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    toggleMember(member) {
      if(!this.isAllowed) return
      var activity = {};
      if (this.task.members.every((mmbr) => member._id != mmbr._id)) {
        this.task.members.unshift(member);
        activity = {
          type: "activity-cmp",
          action: `assigned ${member.fullname}`,
        };
      } else {
        utilService.spliceItem2(member._id, this.task.members);
        console.log(this.task.members);
        activity = {
          type: "activity-cmp",
          action: `uassigned ${member.fullname}`,
        };
      }
      this.$emit("updateTask", this.task, activity);
    },
    isMemberSelected(memberId) {
      return this.task.members.some((member) => member._id === memberId);
    },
  },
  computed: {
    filteredMembers() {
      return this.board.members.filter((member) => {
        return member.fullname
          .toLowerCase()
          .includes(this.searchMember.trim().toLowerCase());
      });
    },
  },
  components: { iconBase },
};
</script>

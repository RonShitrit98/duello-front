import { defineStore } from "pinia";
import { useUserStore } from "./user.store";
import { boardService } from "../services/board.service";
import { isThisSecond } from "date-fns";
import { socketService } from "../services/socket.service";
export const useBoardStore = defineStore("board", {
  state: () => {
    return {
      userStore: useUserStore(),
      board: null,
      boards: null,
    };
  },
  getters: {
    currUser() {
      return this.userStore.currUser;
    },
    currBoard() {
      return JSON.parse(JSON.stringify(this.board));
    },
    currBoards() {
      return JSON.parse(JSON.stringify(this.boards));
    },
    labels() {
      return JSON.parse(JSON.stringify(this.board.labels));
    },
    style() {
      if (!this.board) {
        return {
          isDark: true,
        };
      } else {
        return this.currBoard.style;
      }
    },
    isUserAllowed() {
      if (!this.currUser) return false;
      // console.log(this.board.members.find((member) => member._id === this.currUser._id))
      // console.log(this.board.members)
      if (this.board.members.find((member) => member._id === this.currUser._id))
        return true;
      return false;
    },
  },
  actions: {
    async createBoard(board) {
      try {
        board.createdBy = this.currUser;
        board.members.push(this.currUser);
        const newBoard = await boardService.addNewBoard(board);
        this._setBoard(newBoard);
        if (!this.groups) return;
        this.groups.push(newBoard);
      } catch (err) {
        console.log(err);
      }
    },
    async loadBoards() {
      try {
        const boards = await boardService.query({ userId: this.currUser._id });
        this.boards = boards;
      } catch (err) {
        console.log(err);
      }
    },
    async updateBoard(board) {
      this._setBoard(board);
      try {
        const updatedBoard = await boardService.updateBoard(board);
        socketService.emit("update", updatedBoard);
      } catch (err) {
        console.log(err);
      }
    },
    async loadBoard(id) {
      try {
        const board = await boardService.getById(id);
        this._setBoard(board);
      } catch (err) {
        console.log(err);
      }
    },
    resetBoard() {
      this.board = null;
    },
    toggleLabels() {
      this.board.isLabelExpanded = !this.board.isLabelExpanded;
      this.updateBoard(this.board);
    },
    _setBoard(board) {
      this.board = board;
      // const idx = this.boards.findIndex((b) => board._id === b._id);
      // if (idx < 0) this.boards.push(board);
      // else this.boards.splice(idx, 1, board);
    },
  },
});

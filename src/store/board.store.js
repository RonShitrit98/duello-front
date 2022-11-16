import { defineStore } from 'pinia';
import { useUserStore } from './user.store';
import { boardService } from '../services/board.service';
import { parse } from 'dotenv';
import { utilService } from '../services/util.service';
export const useBoardStore = defineStore('board', {
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
        const boards = await boardService.query();
        this.boards = boards;
      } catch (err) {
        console.log(err);
      }
    },
    async updateBoard(board) {
      try {
        this._setBoard(board);
        const updatedBoard = await boardService.updateBoard(board);
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
    _setBoard(board) {
      this.board = board;
      // const idx = this.boards.findIndex((b) => board._id === b._id);
      // if (idx < 0) this.boards.push(board);
      // else this.boards.splice(idx, 1, board);
    },
  },
});

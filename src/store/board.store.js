import { defineStore } from 'pinia';
import { useUserStore } from './user.store';
import { boardService } from '../services/board.service';
import { parse } from 'dotenv';
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
  },
  actions: {
    async createBoard(board) {
      try {
        board.createdBy = this.currUser;
        board.members.push(this.currUser);
        const newBoard = await boardService.addNewBoard(board);
        this._setBoard(newBoard);
        // state.boardGroups = board.groups;
        // if (board.style.type === 'img') state.bcg = board.style.color;
        // else state.bcg = '#00000029';
        // state.isDark = board.style.isDark;
        // state.boardStyle = board.style;
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
        const updatedBoard = await boardService.updateBoard(board);
        this._setBoard(updatedBoard);
      } catch (err) {
        console.log(err);
      }
    },
    _setBoard(board) {
      this.board = board;
      const idx = this.boards.findIndex((b) => board._id === b._id);
      if (idx < 0) this.boards.push(board);
      else this.boards.splice(idx, 1, board);
    },
  },
});

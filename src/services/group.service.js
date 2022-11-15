import { utilService } from './util.service';

export const groupService = {
  getEmptyGroup,
};

function getEmptyGroup() {
  return {
    id: utilService.makeId(),
    title: '',
    tasks: [],
  };
}

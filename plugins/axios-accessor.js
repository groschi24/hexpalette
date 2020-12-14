import { initializeAxios } from '~/utils/axios';

const accessor = ({ $axios }) => {
  initializeAxios($axios);
};

export default accessor;

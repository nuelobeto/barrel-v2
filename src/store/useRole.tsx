import {create} from 'zustand';
import {RoleType} from '../types/role';

type RoleState = {
  roles: RoleType[];
  setRoles: (roles: RoleType[]) => void;
};

const useRole = create<RoleState>(set => ({
  roles: [],

  setRoles: roles => {
    set({roles});
  },
}));

export default useRole;

import {create} from 'zustand';

interface SidebarState {
  expanded: boolean;
  toggleSidebar: () => void;
}

const useSidebar = create<SidebarState>(set => ({
  expanded: true,
  toggleSidebar: () => set(state => ({expanded: !state.expanded})),
}));

export default useSidebar;

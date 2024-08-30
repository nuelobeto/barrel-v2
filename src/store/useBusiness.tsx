import businessServices from '@/services/businessServices';
import {BusinessType} from '@/types/business';
import {create} from 'zustand';

interface ExampleState {
  business: BusinessType | null;
  getBusiness: () => Promise<void>;
}

const savedBusiness: string | null = localStorage.getItem('business');
const business: BusinessType | null = savedBusiness
  ? JSON.parse(savedBusiness)
  : null;

const useBusiness = create<ExampleState>(set => ({
  business,

  getBusiness: async () => {
    const res = await businessServices.getBusiness();
    set({business: res.data});
  },
}));

export default useBusiness;

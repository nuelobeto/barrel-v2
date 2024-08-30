import { create } from "zustand";

type ExampleState = {
	example: string;
	setExample: () => void;
};

const useTheme = create<ExampleState>((set) => ({
	example: "Example",

	setExample: () => {
		set((state) => ({ example: (state.example = "New Example") }));
	},
}));

export default useTheme;

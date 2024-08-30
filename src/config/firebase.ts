import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCFFKnSBLYCDvzh1KtrtvAAJs_rrvEYSxk",
	authDomain: "barrel-8dbbd.firebaseapp.com",
	projectId: "barrel-8dbbd",
	storageBucket: "barrel-8dbbd.appspot.com",
	messagingSenderId: "912438096806",
	appId: "1:912438096806:web:829d023c5a35b6020cd567",
	measurementId: "G-3BZ36YZFK3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

import { configureStore } from "@reduxjs/toolkit";
import { employeeReducer } from "./employees";
import { UserReducer } from "./users";

export const store = configureStore ( {
    reducer: {
        employees: employeeReducer,
        user: UserReducer
    }
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

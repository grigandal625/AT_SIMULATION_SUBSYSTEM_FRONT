import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOAD_STATUSES } from "../../GLOBAL";

export const loadModels = createAsyncThunk("models/load", async (modelId) => {
    const mockModels = [
        {id: 1, name: "Model 1", user_id: 1, created_at: "1997-07-16T19:20:30+01:00"}
    ]
    return mockModels;
});

export const createModel = createAsyncThunk("models/create", async (model) => {
    return model
});

export const deleteModel = createAsyncThunk("models/delete", async (modelId) => {
    return modelId
});

const modelsSlice = createSlice({
    name: "models",
    initialState: {
        data: [],
        status: LOAD_STATUSES.IDLE,
        error: null,
    },
    reducers: {
        // Define reducers here
    },
    extraReducers: (builder) => {
        builder.addCase(loadModels.pending, (state) => {
            state.status = LOAD_STATUSES.LOADING;
        }).addCase(loadModels.fulfilled, (state, action) => {
            state.status = LOAD_STATUSES.SUCCESS;
            state.data = action.payload;
        }).addCase(createModel.pending, (state) => {
            state.status = LOAD_STATUSES.LOADING;
        }).addCase(createModel.fulfilled, (state, action) => {
            state.status = LOAD_STATUSES.SUCCESS;
            state.data.push(action.payload);
        }).addCase(deleteModel.pending, (state) => {
            state.status = LOAD_STATUSES.LOADING;
        }).addCase(deleteModel.fulfilled, (state, action) => {
            state.status = LOAD_STATUSES.SUCCESS;
            const index = state.data.findIndex((rt) => rt.id === action.payload);
            if (index > -1) {
                state.data.splice(index, 1);
            }
        })
    },
});

export default modelsSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOAD_STATUSES } from "../../GLOBAL";

export const loadTemplates = createAsyncThunk("templates/load", async (modelId) => {
    return [];
});

export const createTemplate = createAsyncThunk("templates/create", async ({ modelId, template }) => {});

export const updateTemplate = createAsyncThunk("templates/update", async ({ modelId, template }) => {});

export const deleteTemplate = createAsyncThunk("templates/delete", async ({ modelId, templateId }) => {});

const templatesSlice = createSlice({
    name: "templates",
    initialState: {
        data: [],
        status: LOAD_STATUSES.IDLE,
        error: null,
    },
    reducers: {
        // Define reducers here
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTemplates.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadTemplates.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload;
            })
            .addCase(createTemplate.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(createTemplate.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data.push(action.payload);
            })
            .addCase(updateTemplate.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(updateTemplate.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((rt) => rt.id === action.payload.id);
                if (index > -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteTemplate.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(deleteTemplate.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((rt) => rt.id === action.payload);
                if (index > -1) {
                    state.data.splice(index, 1);
                }
            });
    },
});

export default templatesSlice.reducer;

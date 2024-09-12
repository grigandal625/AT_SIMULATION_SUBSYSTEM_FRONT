import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOAD_STATUSES } from "../../GLOBAL";

export const loadTemplateUsages = createAsyncThunk("templateUsages/load", async (modelId) => {

});

export const createTemplateUsage = createAsyncThunk("templateUsages/create", async ({modelId, templateUsage}) => {

});

export const updateTemplateUsage = createAsyncThunk("templateUsages/update", async ({modelId, templateUsage}) => {

});

export const deleteTemplateUsage = createAsyncThunk("templateUsages/delete", async ({modelId, templateUsageId}) => {

});

const templateUsagesSlice = createSlice({
    name: "templateUsages",
    initialState: {
        data: [],
        status: LOAD_STATUSES.IDLE,
        error: null,
    },
    reducers: {
        // Define reducers here
    },
    extraReducers: (builder) => {
        builder.addCase(loadTemplateUsages.pending, (state) => {
            state.status = LOAD_STATUSES.LOADING;
        }).addCase(loadTemplateUsages.fulfilled, (state, action) => {
            state.status = LOAD_STATUSES.SUCCESS;
            state.data = action.payload;
        }).addCase(createTemplateUsage.pending, (state) => {
            state.status = LOAD_STATUSES.LOADING;
        }).addCase(createTemplateUsage.fulfilled, (state, action) => {
            state.status = LOAD_STATUSES.SUCCESS;
            state.data.push(action.payload);
        }).addCase(updateTemplateUsage.pending, (state) => {
            state.status = LOAD_STATUSES.LOADING;
        }).addCase(updateTemplateUsage.fulfilled, (state, action) => {
            state.status = LOAD_STATUSES.SUCCESS;
            const index = state.data.findIndex((rt) => rt.id === action.payload.id);
            if (index > -1) {
                state.data[index] = action.payload;
            }
        }).addCase(deleteTemplateUsage.pending, (state) => {
            state.status = LOAD_STATUSES.LOADING;
        }).addCase(deleteTemplateUsage.fulfilled, (state, action) => {
            state.status = LOAD_STATUSES.SUCCESS;
            const index = state.data.findIndex((rt) => rt.id === action.payload);
            if (index > -1) {
                state.data.splice(index, 1);
            }
        })
    },
});

export default templateUsagesSlice.reducer;
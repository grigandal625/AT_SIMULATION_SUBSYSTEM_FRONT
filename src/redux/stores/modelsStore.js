import { createSlice} from "@reduxjs/toolkit";
import { createFrameActionAsyncThunk } from "../frameActor";
import { API_URL, getHeaders, LOAD_STATUSES, MOCKING } from "../../GLOBAL";
import { rejector } from "../rejector";

export const loadModels = createFrameActionAsyncThunk("models/load", async (_, {rejectWithValue}) => {
    const url = `${API_URL}/api/models/`;
    const headers = getHeaders();

    if (MOCKING) {
        console.log(url, {
            headers,
        });
        const json = {
            models: [
                {
                    id: 1,
                    name: "Модель 1",
                    created_at: "2024-09-29T09:11:24.520Z",
                },
            ],
            total: 0,
        };
        return json.models;
    }

    const response = await fetch(url, {
        headers,
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return json.data.models;
});

export const createModel = createFrameActionAsyncThunk("models/create", async (model, {rejectWithValue}) => {
    const url = `${API_URL}/api/models/`;
    const headers = getHeaders();
    if (MOCKING) {
        const json = model;
        if (!json.id) {
            json.id = Math.floor(Math.random() * 10000) + 1; // Generate random ID for new models
        }
        return json;
    }
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(model),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return json.data;
});

export const deleteModel = createFrameActionAsyncThunk("models/delete", async (modelId, {rejectWithValue}) => {
    const url = `${API_URL}/api/models/${modelId}/`;
    const headers = getHeaders();
    
    if (MOCKING) {
        console.log(url, {
            method: "DELETE",
            headers,
        });
        const json = { id: modelId };
        return json.id;
    }

    const response = await fetch(url, {
        method: "DELETE",
        headers,
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return json.data;
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
        builder
            .addCase(loadModels.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadModels.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload;
            })
            .addCase(createModel.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(createModel.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data.push(action.payload);
            })
            .addCase(deleteModel.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(deleteModel.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((rt) => rt.id === action.payload);
                if (index > -1) {
                    state.data.splice(index, 1);
                }
            });
    },
});

export default modelsSlice.reducer;

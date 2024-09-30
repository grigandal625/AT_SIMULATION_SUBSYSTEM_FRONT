import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL, getHeaders, LOAD_STATUSES } from "../../GLOBAL";

export const loadFuncs = createAsyncThunk("funcs/load", async (modelId) => {
    const url = `${API_URL}/api/editor/functions/`;
    const headers = getHeaders({ "model-id": modelId });
    // const response = await fetch(url, {
    //     headers
    // })
    // const json = await response.json()

    const json = {
        functions: [
            {
                id: 1,
                name: "square",
                ret_type: "float",
                body: "return x*x",
                params: [
                    {
                        name: "x",
                        type: "float",
                    },
                ],
            },
        ],
        total: 0,
    };
    return json.functions;
});

export const createFunc = createAsyncThunk("funcs/create", async ({ modelId, func }) => {
    const url = `${API_URL}/api/editor/functions/`;
    const headers = getHeaders({ "model-id": modelId });
    // const response = await fetch(url, {
    //     method: "POST",
    //     headers,
    //     body: JSON.stringify(func),
    // });
    // const json = await response.json();
    const json = func;

    if (!json.id) {
        json.id = Math.floor(Math.random() * 10000) + 1;
    }
    return json;
});

export const updateFunc = createAsyncThunk("funcs/update", async ({ modelId, func }) => {
    const url = `${API_URL}/api/editor/functions/${func.id}/`;
    const headers = getHeaders({ "model-id": modelId });
    // const response = await fetch(url, {
    //     method: "PUT",
    //     headers,
    //     body: JSON.stringify(func),
    // });
    // const json = await response.json();
    const json = func;
    return json;
});

export const deleteFunc = createAsyncThunk("funcs/delete", async ({ modelId, funcId }) => {
    const url = `${API_URL}/api/editor/functions/${funcId}/`;
    const headers = getHeaders({ "model-id": modelId });
    // const response = await fetch(url, {
    //     method: "DELETE",
    //     headers,
    // });
    // const json = await response.json();
    const json = { id: funcId };
    return json.id;
});

const funcsSlice = createSlice({
    name: "funcs", // functions
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
            .addCase(loadFuncs.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadFuncs.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload;
            })
            .addCase(createFunc.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(createFunc.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data.push(action.payload);
            })
            .addCase(updateFunc.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(updateFunc.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((item) => item.id === action.payload.id);
                if (index > -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteFunc.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(deleteFunc.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((item) => item.id === action.payload);
                if (index > -1) {
                    state.data.splice(index, 1);
                }
            });
    },
});

export default funcsSlice.reducer;
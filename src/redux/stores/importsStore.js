import { createSlice } from "@reduxjs/toolkit";
import { createFrameActionAsyncThunk } from "../frameActor";
import { API_URL, getHeaders, LOAD_STATUSES, MOCKING } from "../../GLOBAL";
import { rejector } from "../rejector";

export const loadImports = createFrameActionAsyncThunk("imports/load", async (modelId, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/imports/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            headers,
        });
        const json = {
            data: {
                imports: [
                    {
                        id: 1,
                        model_id: 1,
                        name: "fmt",
                        version: "1.0.0",
                        packages: [
                            {
                                id: 1,
                                name: "fmt",
                                alias: "fmt", // not required
                            },
                        ]
                    },
                ],
                total: 0,
            },
        };
        return { items: json.data.imports, modelId };
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
    return json.data;
});

export const createImport = createFrameActionAsyncThunk("imports/create", async ({ modelId, importData }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/imports/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
            body: JSON.stringify(importData),
        });
        const json = importData;

        if (!json.id) {
            json.id = Math.floor(Math.random() * 10000) + 1;
        }
        return json;
    }
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(importData),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }

    return { ...importData, ...json.data };
});

export const updateImport = createFrameActionAsyncThunk("imports/update", async ({ modelId, importData }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/imports/${importData.id}/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(importData),
        });
        return importData;
    }
    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(importData),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }

    return { ...importData, ...json.data };
});

export const deleteImport = createFrameActionAsyncThunk("imports/delete", async ({ modelId, importId }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/imports/${importId}/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "DELETE",
            headers,
        });
        return importId;
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

    return importId;
});

const importsSlice = createSlice({
    name: "imports",
    initialState: {
        data: [],
        status: LOAD_STATUSES.IDLE,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadImports.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadImports.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload.items;
                state.modelId = action.payload.modelId;
            })
            .addCase(loadImports.rejected, (state, action) => {
                state.status = LOAD_STATUSES.ERROR;
                state.error = action.payload;
            })
            .addCase(createImport.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(createImport.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data.push(action.payload);
            })
            .addCase(updateImport.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(updateImport.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((item) => item.id === action.payload.id);
                if (index !== -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteImport.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(deleteImport.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((item) => item.id === action.payload);
                if (index !== -1) {
                    state.data.splice(index, 1);
                }
            });
    },
});


export default importsSlice.reducer;
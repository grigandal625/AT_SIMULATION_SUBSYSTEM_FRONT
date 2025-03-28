import { createSlice } from "@reduxjs/toolkit";
import { createFrameActionAsyncThunk } from "../frameActor";
import { API_URL, getHeaders, LOAD_STATUSES, MOCKING } from "../../GLOBAL";
import { rejector } from "../rejector";
import { deleteResourceType } from "./resourceTypesStore";

export const loadResources = createFrameActionAsyncThunk("resources/load", async (modelId, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/resources/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            headers,
        });
        const json = {
            resources: [
                {
                    name: "res1",
                    to_be_traced: true,
                    attributes: [
                        {
                            rta_id: 1,
                            value: 5,
                        },
                        {
                            rta_id: 2,
                            value: 6.3,
                        },
                        {
                            rta_id: 3,
                            value: true,
                        },
                        {
                            rta_id: 4,
                            value: "hello",
                        },
                    ],
                    resource_type_id: 1,
                    id: 1,
                },
                {
                    name: "res2",
                    to_be_traced: false,
                    attributes: [
                        {
                            rta_id: 5,
                            value: 5,
                        },
                        {
                            rta_id: 6,
                            value: 6.3,
                        },
                        {
                            rta_id: 7,
                            value: false,
                        },
                        {
                            rta_id: 8,
                            value: "hello",
                        },
                    ],
                    resource_type_id: 2,
                    id: 2,
                },
            ],
            total: 0,
        };

        return { items: json.resources, modelId };
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
    return { items: json.data.resources, modelId };
});

export const createResource = createFrameActionAsyncThunk("resources/create", async ({ modelId, resource }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/resources/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
            body: JSON.stringify(resource),
        });
        const json = resource;
        if (!json.id) {
            json.id = Math.floor(Math.random() * 10000) + 1; // Generate random ID for new resources
        }
        return json;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(resource),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return { ...resource, ...json.data };
});

export const updateResource = createFrameActionAsyncThunk("resources/update", async ({ modelId, resource }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/resources/${resource.id}/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(resource),
        });
        const json = resource;
        return json;
    }

    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(resource),
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

export const deleteResource = createFrameActionAsyncThunk("resources/delete", async ({ modelId, resourceId }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/resources/${resourceId}/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "DELETE",
            headers,
        });
        const json = { id: resourceId };
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
    return json.data.id;
});

const resourcesSlice = createSlice({
    name: "resources",
    initialState: {
        data: [],
        status: LOAD_STATUSES.IDLE,
        error: null,
        modelId: null,
    },
    reducers: {
        // Define reducers here
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadResources.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadResources.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload.items;
                state.modelId = action.payload.modelId;
            })
            .addCase(createResource.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(createResource.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data.push(action.payload);
            })
            .addCase(updateResource.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(updateResource.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((item) => item.id === action.payload.id);
                if (index > -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteResource.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(deleteResource.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((item) => item.id === action.payload);
                if (index > -1) {
                    state.data.splice(index, 1);
                }
            })
            .addCase(deleteResourceType.fulfilled, (state, action) => {
                state.data = state.data.filter((item) => item.resource_type_id !== parseInt(action.payload));
            });
    },
});

export default resourcesSlice.reducer;

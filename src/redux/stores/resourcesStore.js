import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOAD_STATUSES } from "../../GLOBAL";

export const loadResources = createAsyncThunk("resources/load", async (modelId) => {
    const mockResources = [
        {
            id: 1,
            name: "Resource 1",
            to_be_traced: true,
            model_id: 1,
            resource_type_id: 1,
            attributes: [
                { id: 1, name: "Attribute 1", value: "Attribute Value 1", resource_id: 1, rta_id: 1 },
                { id: 2, name: "Attribute 2", value: "Attribute Value 2", resource_id: 1, rta_id: 2 },
                // Add more attributes here
            ],
        },
        {
            id: 2,
            name: "Resource 2",
            to_be_traced: true,
            model_id: 1,
            resource_type_id: 2,
            attributes: [
                { id: 3, name: "Attribute 3", value: "Attribute Value 3", resource_id: 2, rta_id: 3 },
                { id: 4, name: "Attribute 4", value: "Attribute Value 4", resource_id: 2, rta_id: 4 },
                // Add more attributes here
            ],
        },
        // Add more resources here
    ];

    return mockResources;
});

export const createResource = createAsyncThunk("resources/create", async ({modelId, resource}) => {
    // Simulate creating a resource

    // mocking
    if (!resource.id) {
        resource.id = Math.floor(Math.random() * 10000) + 1; // Generate random ID for new resources
    }
    resource.attributes = resource.attributes.map(attr => ({...attr, id: attr.id || Math.floor(Math.random() * 10000) + 1}))
    return resource;
});

export const updateResource = createAsyncThunk("resources/update", async ({modelId, resource}) => {
    // Simulate updating a resource

    return resource;
});

export const deleteResource = createAsyncThunk("resources/delete", async ({modelId, resourceId}) => {
    // Simulate deleting a resource

    return resourceId;
});

const resourcesSlice = createSlice({
    name: "resources",
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
            .addCase(loadResources.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadResources.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload;
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
                const index = state.data.findIndex((rt) => rt.id === action.payload.id);
                if (index > -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteResource.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(deleteResource.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((rt) => rt.id === action.payload);
                if (index > -1) {
                    state.data.splice(index, 1);
                }
            });
    },
});

export default resourcesSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOAD_STATUSES } from "../../GLOBAL";

export const loadResourceTypes = createAsyncThunk("resourceTypes/load", async (modelId) => {
    const mockResourceTypes = [
        {
            id: 1,
            name: "Type_1",
            type: true,
            model_id: 1,
            attributes: [
                { id: 1, name: "Attribute_1", type: 1, default_value: 0, resource_type_id: 1 },
                { id: 2, name: "Attribute_2", type: 2, default_value: "Attribute Value 2", resource_type_id: 1 },
                // Add more attributes here
            ],
        },
        {
            id: 2,
            name: "Type_2",
            type: true,
            model_id: 1,
            attributes: [
                { id: 3, name: "Attribute_3", type: 1, default_value: 5, resource_type_id: 2 },
                { id: 4, name: "Attribute_4", type: 2, default_value: "Attribute Value 4", resource_type_id: 2 },
                // Add more attributes here
            ],
        },
        // Add more resource types here
    ];

    return mockResourceTypes;
});

export const createResourceType = createAsyncThunk("resourceTypes/create", async ({modelId, resourceType}) => {
    // Simulate creating a resource type
    
    // mocking
    if (!resourceType.id) {
        resourceType.id = Math.floor(Math.random() * 10000) + 1; // Generate random ID for new resource types
    }
    resourceType.attributes = resourceType.attributes.map(attr => ({...attr, id: attr.id || Math.floor(Math.random() * 10000) + 1}))
    return resourceType;
});

export const updateResourceType = createAsyncThunk("resourceTypes/update", async ({modelId, resourceType}) => {
    // Simulate updating a resource type

    //mocking
    resourceType.attributes = resourceType.attributes.map(attr => ({...attr, id: attr.id || Math.floor(Math.random() * 10000) + 1}))
    return resourceType;
});

export const deleteResourceType = createAsyncThunk("resourceTypes/delete", async ({modelId, resourceTypeId}) => {
    // Simulate deleting a resource type

    return resourceTypeId;
});

const resourceTypesSlice = createSlice({
    name: "resourceTypes",
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
            .addCase(loadResourceTypes.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadResourceTypes.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload;
            })
            .addCase(createResourceType.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(createResourceType.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data.push(action.payload);
            })
            .addCase(updateResourceType.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(updateResourceType.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((rt) => rt.id === action.payload.id);
                if (index > -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteResourceType.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(deleteResourceType.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((rt) => rt.id === action.payload);
                if (index > -1) {
                    state.data.splice(index, 1);
                }
            });
    },
});

export default resourceTypesSlice.reducer;

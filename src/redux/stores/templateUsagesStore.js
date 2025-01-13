import { createSlice } from "@reduxjs/toolkit";
import { createFrameActionAsyncThunk } from "../frameActor";
import { API_URL, getHeaders, LOAD_STATUSES, MOCKING } from "../../GLOBAL";
import { rejector } from "../rejector";
import { deleteTemplate } from "./templatesStore";
import { deleteResource } from "./resourcesStore";
import { deleteResourceType } from "./resourceTypesStore";

export const loadTemplateUsages = createFrameActionAsyncThunk("templateUsages/load", async (modelId, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/templates/usages/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            headers,
        });
        const json = {
            usages: [
                {
                    id: 1,
                    name: "usage1",
                    template_id: 1,
                    arguments: [
                        {
                            id: 1,
                            relevant_resource_id: 1,
                            resource_id: 1,
                        },
                    ],
                },
            ],
            total: 0,
        };
        return { items: json.usages, modelId };
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
    return { items: json.data.usages, modelId };
});

export const createTemplateUsage = createFrameActionAsyncThunk("templateUsages/create", async ({ modelId, templateUsage }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/templates/usages/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
            body: JSON.stringify(templateUsage),
        });
        const json = templateUsage;

        if (!json.id) {
            json.id = Math.floor(Math.random() * 10000) + 1;
        }
        return json;
    }
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(templateUsage),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return { ...templateUsage, ...json.data };
});

export const updateTemplateUsage = createFrameActionAsyncThunk("templateUsages/update", async ({ modelId, templateUsage }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/templates/usages/${templateUsage.id}/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(templateUsage),
        });
        const json = templateUsage;
        return json;
    }

    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(templateUsage),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return { ...templateUsage, ...json.data };
});

export const deleteTemplateUsage = createFrameActionAsyncThunk("templateUsages/delete", async ({ modelId, templateUsageId }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/templates/usages/${templateUsageId}/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "DELETE",
            headers,
        });
        const json = { id: templateUsageId };
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

const templateUsagesSlice = createSlice({
    name: "templateUsages",
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
            .addCase(loadTemplateUsages.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadTemplateUsages.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload.items;
                state.modelId = action.payload.modelId;
            })
            .addCase(createTemplateUsage.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(createTemplateUsage.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data.push(action.payload);
            })
            .addCase(updateTemplateUsage.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(updateTemplateUsage.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((item) => item.id === action.payload.id);
                if (index > -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteTemplateUsage.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(deleteTemplateUsage.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((item) => item.id === action.payload);
                if (index > -1) {
                    state.data.splice(index, 1);
                }
            })
            .addCase(deleteTemplate.fulfilled, (state, action) => {
                state.data = state.data.filter((item) => item.template.id !== parseInt(action.payload));
            })
            .addCase(deleteResource.fulfilled, (state, action) => {
                state.data = state.data.filter((item) => !item.arguments.map((a) => a.resource_id).includes(parseInt(action.payload)));
            })
            .addCase(deleteResourceType.fulfilled, (state) => {
                // поскольку ресурсы могут быть не загруженными, а операции загруженными, мы возможно не сможем отфильтровать операции, поэтому просто чистим
                state.status = LOAD_STATUSES.CLEARED
                state.data = []
            });
    },
});

export default templateUsagesSlice.reducer;

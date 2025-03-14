import { createSlice } from "@reduxjs/toolkit";
import { createFrameActionAsyncThunk } from "../frameActor";
import { API_URL, getHeaders, LOAD_STATUSES, MOCKING } from "../../GLOBAL";
import { rejector } from "../rejector";
import { deleteResourceType } from "./resourceTypesStore";

export const loadTemplates = createFrameActionAsyncThunk("templates/load", async (modelId, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/templates/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            headers,
        });
        const json = {
            irregular_events: [
                {
                    meta: {
                        id: 1,
                        name: "event1",
                        type: "IRREGULAR_EVENT",
                        rel_resources: [
                            {
                                id: 1,
                                name: "rel_res1",
                                resource_type_id: 1,
                            },
                        ],
                    },
                    generator: {
                        type: "normal",
                        value: 2,
                        dispersion: 0,
                    },
                    body: {
                        body: "rel_res1.attr1 = 5",
                    },
                },
            ],
            operations: [
                {
                    meta: {
                        id: 2,
                        name: "operation1",
                        type: "OPERATION",
                        rel_resources: [
                            {
                                id: 1,
                                name: "rel_res1",
                                resource_type_id: 1,
                            },
                        ],
                    },
                    body: {
                        condition: "rel_res1.attr1 == 5",
                        body_before: "rel_res1.attr2 = 7",
                        delay: 3,
                        body_after: "rel_res1.attr3 = false",
                    },
                },
            ],
            rules: [
                {
                    meta: {
                        id: 3,
                        name: "rule1",
                        type: "RULE",
                        rel_resources: [
                            {
                                id: 1,
                                name: "rel_res1",
                                resource_type_id: 1,
                            },
                        ],
                    },
                    body: {
                        condition: "rel_res1.attr1 == 5",
                        body: "rel_res1.attr2 = 7",
                    },
                },
            ],
        };
        return { items: json.irregular_events.concat(json.operations.concat(json.rules)), modelId };
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
    return { items: json.data.irregular_events.concat(json.data.operations.concat(json.data.rules)), modelId };
});

export const createTemplate = createFrameActionAsyncThunk("templates/create", async ({ modelId, template }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/templates/${template.meta.type.toLowerCase()}/`;
    const headers = getHeaders({ "model-id": modelId });
    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
            body: JSON.stringify(template),
        });
        const json = template;

        if (!json.meta.id) {
            json.meta.id = Math.floor(Math.random() * 10000) + 1;
        }
        return json;
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(template),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }

    const { id } = json.data;

    const retrieveUrl = `${API_URL}/api/editor/templates/${id}/${template.meta.type.toLowerCase()}`;
    const retrieveResponse = await fetch(retrieveUrl, { headers });

    if (!retrieveResponse.ok) {
        return await rejector(retrieveResponse, rejectWithValue);
    }
    const retrieveJson = await retrieveResponse.json();
    if (retrieveJson.is_error) {
        return await rejector(retrieveResponse, rejectWithValue);
    }

    return { ...template, ...retrieveJson.data };
});

export const updateTemplate = createFrameActionAsyncThunk("templates/update", async ({ modelId, template }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/templates/${template.meta.id}/${template.meta.type.toLowerCase()}/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(template),
        });
        const json = template;
        return json;
    }

    const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(template),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }

    const { id } = json.data;

    const retrieveUrl = `${API_URL}/api/editor/templates/${id}/${template.meta.type.toLowerCase()}`;
    const retrieveResponse = await fetch(retrieveUrl, { headers });

    if (!retrieveResponse.ok) {
        return await rejector(retrieveResponse, rejectWithValue);
    }
    const retrieveJson = await retrieveResponse.json();
    if (retrieveJson.is_error) {
        return await rejector(retrieveResponse, rejectWithValue);
    }

    return { ...template, ...retrieveJson.data };
});

export const deleteTemplate = createFrameActionAsyncThunk("templates/delete", async ({ modelId, templateId }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/templates/${templateId}/`;
    const headers = getHeaders({ "model-id": modelId });

    if (MOCKING) {
        console.log(url, {
            method: "DELETE",
            headers,
        });
        const json = { id: templateId };
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

const templatesSlice = createSlice({
    name: "templates",
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
            .addCase(loadTemplates.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadTemplates.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload.items;
                state.modelId = action.payload.modelId;
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
                const index = state.data.findIndex((item) => item.meta.id === action.payload.meta.id);
                if (index > -1) {
                    state.data[index] = action.payload;
                }
            })
            .addCase(deleteTemplate.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(deleteTemplate.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                const index = state.data.findIndex((item) => item.meta.id === action.payload);
                if (index > -1) {
                    state.data.splice(index, 1);
                }
            })
            .addCase(deleteResourceType.fulfilled, (state) => {
                state.status = LOAD_STATUSES.TO_REFRESH;
                state.data = [];
            });
    },
});

export default templatesSlice.reducer;

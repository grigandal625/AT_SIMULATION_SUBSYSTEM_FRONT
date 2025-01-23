import { createSlice } from "@reduxjs/toolkit";
import { createFrameActionAsyncThunk } from "../frameActor";
import { API_URL, getHeaders, LOAD_STATUSES, MOCKING } from "../../GLOBAL";
import { rejector } from "../rejector";

export const loadTranslatedModels = createFrameActionAsyncThunk("translatedModels/load", async (_, { rejectWithValue }) => {
    const url = `${API_URL}/api/translator/files`;
    const headers = getHeaders();

    if (MOCKING) {
        console.log(url, {
            headers,
        });
        const json = {
            translated_models: [
                {
                    id: 1,
                    name: "translated model 1 (21.12.2021)",
                    model_id: 1,
                },
            ],
            total: 0,
        };
        return { items: json.translated_models };
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
    return { items: json.data.files };
});

export const createTranslatedModel = createFrameActionAsyncThunk("translatedModels/create", async ({ modelId, name }, { rejectWithValue }) => {
    const url = `${API_URL}/api/translator/files/${modelId}`;
    const headers = getHeaders({ "model-id": modelId });

    // return rejectWithValue(new ApiError("Translate error", 500, { error_message: "Translate error" }, "Test error"))

    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
            body: JSON.stringify({ name }),
        });
        const json = { name, file_content: "GENERATED GO CODE", translate_logs: "> File ok." };

        if (!json.id) {
            json.id = Math.floor(Math.random() * 10000) + 1;
        }
        return json;
    }
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return { name, ...json.data };
});

const translatedModelsSlice = createSlice({
    name: "translatedModels",
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
            .addCase(loadTranslatedModels.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadTranslatedModels.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload.items;
            })
            .addCase(createTranslatedModel.fulfilled, (state, action) => {
                state.data.push(action.payload);
            });
    },
});

export default translatedModelsSlice.reducer;

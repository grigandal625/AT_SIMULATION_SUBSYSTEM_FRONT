import { createSlice } from "@reduxjs/toolkit";
import { createFrameActionAsyncThunk } from "../frameActor";
import { API_URL, getHeaders, LOAD_STATUSES, MOCKING } from "../../GLOBAL";

export const loadSimulationProcesses = createFrameActionAsyncThunk("simulationProcesses/load", async () => {
    const url = `${API_URL}/api/editor/simulationProcesses/`;
    const headers = getHeaders();

    if (MOCKING) {
        console.log(url, {
            headers,
        });
        const json = {
            simulation_processes: [
                {
                    id: 1,
                    name: "translated model 1 (21.12.2021)",
                    translated_model_id: 1,
                },
            ],
            total: 0,
        };
        return { items: json.simulation_processes };
    }

    const response = await fetch(url, {
        headers,
    });
    const json = await response.json();
    return { items: json.data.simulation_processes };
});

export const createSimulationProcess = createFrameActionAsyncThunk("simulationProcesses/create", async ({ translatedModelId, name }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/simulationProcesses/`;
    const headers = getHeaders();

    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
            body: JSON.stringify({ name, translated_model_id: translatedModelId }),
        });
        const json = { name, translated_model_id: translatedModelId };

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
    if (response.ok) {
        const json = await response.json();
        return json.data;
    }
    try {
        return rejectWithValue(await response.json());
    } catch (error) {
        return rejectWithValue({ error_message: await response.text(), status_code: response.status });
    }
});

export const runSimulationProcess = createFrameActionAsyncThunk("simulationProcesses/run", async ({id, tacts, wait}, {rejectWithValue}) => {

})

const simulationProcessesSlice = createSlice({
    name: "simulationProcesses",
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
            .addCase(loadSimulationProcesses.pending, (state) => {
                state.status = LOAD_STATUSES.LOADING;
            })
            .addCase(loadSimulationProcesses.fulfilled, (state, action) => {
                state.status = LOAD_STATUSES.SUCCESS;
                state.data = action.payload.items;
            })
            .addCase(createSimulationProcess.fulfilled, (state, action) => {
                state.data.push(action.payload);
            });
    },
});

export default simulationProcessesSlice.reducer;

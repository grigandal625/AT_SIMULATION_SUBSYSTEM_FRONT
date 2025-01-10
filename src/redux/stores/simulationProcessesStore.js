import { createSlice } from "@reduxjs/toolkit";
import { createFrameActionAsyncThunk } from "../frameActor";
import { API_URL, getHeaders, LOAD_STATUSES, MOCKING, PROCES_STATUSES } from "../../GLOBAL";
import { rejector } from "../rejector";

export const loadSimulationProcesses = createFrameActionAsyncThunk("simulationProcesses/load", async (_, {rejectWithValue}) => {
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
                    name: "Experiment 1 (21.12.2021)",
                    translated_model_id: 1,
                    status: "paused",
                    tact: 0,
                },
            ],
            total: 0,
        };
        return { items: json.simulation_processes };
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
        const json = { name, translated_model_id: translatedModelId, status: PROCES_STATUSES.PAUSED, tact: 0 };

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
    return json.data
});

export const runSimulationProcess = createFrameActionAsyncThunk("simulationProcesses/run", async ({ id, tacts, wait }, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/simulationProcesses/${id}/run/`;
    const headers = getHeaders();

    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
            body: JSON.stringify({ tacts, wait }),
        });
        return { id, status: PROCES_STATUSES.RUNNING };
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ tacts, wait }),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return json.data
});

export const pauseSimulationProcess = createFrameActionAsyncThunk("simulationProcesses/pause", async (id, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/simulationProcesses/${id}/pause/`;
    const headers = getHeaders();

    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
        });
        return { id, status: PROCES_STATUSES.PAUSED };
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return json.data
});

export const killSimulationProcess = createFrameActionAsyncThunk("simulationProcesses/kill", async (id, { rejectWithValue }) => {
    const url = `${API_URL}/api/editor/simulationProcesses/${id}/kill/`;
    const headers = getHeaders();

    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
        });
        return { id, status: PROCES_STATUSES.KILLED };
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return json.data
});

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
            })
            .addCase(runSimulationProcess.fulfilled, (state, action) => {
                const index = state.data.findIndex((process) => process.id === action.payload.id);
                if (index >= 0) {
                    state.data[index] = { ...state.data[index], ...action.payload };
                }
            })
            .addCase(pauseSimulationProcess.fulfilled, (state, action) => {
                const index = state.data.findIndex((process) => process.id === action.payload.id);
                if (index >= 0) {
                    state.data[index] = { ...state.data[index], ...action.payload };
                }
            })
            .addCase(killSimulationProcess.fulfilled, (state, action) => {
                const index = state.data.findIndex((process) => process.id === action.payload.id);
                if (index >= 0) {
                    state.data[index] = { ...state.data[index], ...action.payload };
                }
            });
    },
});

export default simulationProcessesSlice.reducer;

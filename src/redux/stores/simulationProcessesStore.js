import { createSlice } from "@reduxjs/toolkit";
import { createFrameActionAsyncThunk } from "../frameActor";
import { API_URL, getHeaders, LOAD_STATUSES, MOCKING, PROCES_STATUSES } from "../../GLOBAL";
import { rejector } from "../rejector";

export const loadSimulationProcesses = createFrameActionAsyncThunk("simulationProcesses/load", async (_, { rejectWithValue }) => {
    const url = `${API_URL}/api/processor`;
    const headers = getHeaders();

    if (MOCKING) {
        console.log(url, {
            headers,
        });
        const json = {
            processes: [
                {
                    id: 0,
                    process_name: "experiment 1",
                    file_id: "1",
                    status: "PAUSE",
                    current_tick: 0,
                },
            ],
            total: 0,
        };
        return { items: json.processes };
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
    return { items: json.data.processes };
});

export const createSimulationProcess = createFrameActionAsyncThunk("simulationProcesses/create", async (process, { rejectWithValue }) => {
    const url = `${API_URL}/api/processor`;
    const headers = getHeaders();

    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
            body: JSON.stringify(process),
        });
        const json = { ...process, status: PROCES_STATUSES.PAUSED, current_tick: 0 };

        if (!json.id) {
            json.id = Math.floor(Math.random() * 10000) + 1;
        }
        return json;
    }
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(process),
    });
    if (!response.ok) {
        return await rejector(response, rejectWithValue);
    }
    const json = await response.json();
    if (json.is_error) {
        return await rejector(response, rejectWithValue);
    }
    return { ...process, ...json.data };
});

export const runSimulationProcess = createFrameActionAsyncThunk("simulationProcesses/run", async ({ id, ticks, delay }, { rejectWithValue }) => {
    const url = `${API_URL}/api/processor/${id}/run/`;
    const headers = getHeaders();

    if (MOCKING) {
        console.log(url, {
            method: "POST",
            headers,
            body: JSON.stringify({ ticks, delay }),
        });
        return { id, status: PROCES_STATUSES.RUNNING };
    }

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ ticks, delay }),
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

export const pauseSimulationProcess = createFrameActionAsyncThunk("simulationProcesses/pause", async (id, { rejectWithValue }) => {
    const url = `${API_URL}/api/processor/${id}/pause/`;
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
    return json.data;
});

export const killSimulationProcess = createFrameActionAsyncThunk("simulationProcesses/kill", async (id, { rejectWithValue }) => {
    const url = `${API_URL}/api/processor/${id}/kill/`;
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
    return json.data;
});

const simulationProcessesSlice = createSlice({
    name: "simulationProcesses",
    initialState: {
        data: [],
        status: LOAD_STATUSES.IDLE,
        error: null,
    },
    reducers: {
        addTicks: (state, action) => {
            const index = state.data.findIndex((process) => process.id === action.payload.id);
            if (index >= 0) {
                const currentProcess = state.data[index];
                const ticks = currentProcess?.ticks || [];
                const newTicks = [action.payload.ticks, ...ticks];
                state.data[index].ticks = newTicks;
                state.data[index].status = action.payload.ticks?.currents_status || state.data[index].status;
                state.data[index].current_tick = action.payload.ticks?.current_tick || state.data[index].current_tick;
            }
        },
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

export const { addTicks } = simulationProcessesSlice.actions;

export default simulationProcessesSlice.reducer;

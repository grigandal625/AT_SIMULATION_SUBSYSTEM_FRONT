import { configureStore } from "@reduxjs/toolkit";

import modelsStore from "./stores/modelsStore";
import resourceTypesStore from "./stores/resourceTypesStore";
import resourcesStore from "./stores/resourcesStore";
import templatesStore from "./stores/templatesStore";
import templateUsagesStore from "./stores/templateUsagesStore";
import funcsStore from "./stores/funcsStore";
import translatedModelsStore from "./stores/translatedModelsStore";
import simulationProcessesStore from "./stores/simulationProcessesStore";
import importsStore from "./stores/importsStore";

const addGetStateMiddleware = (storeAPI) => (next) => (action) => {
    if (typeof action === "object" && action.type) {
        action.meta = { ...action.meta, fullState: storeAPI.getState() };
    }
    return next(action);
};

export default configureStore({
    reducer: {
        models: modelsStore,
        resourceTypes: resourceTypesStore,
        resources: resourcesStore,
        templates: templatesStore,
        templateUsages: templateUsagesStore,
        funcs: funcsStore,
        translatedModels: translatedModelsStore,
        simulationProcesses: simulationProcessesStore,
        imports: importsStore,
        // Add other store reducers here
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(addGetStateMiddleware),
    // Other store configuration goes here
});

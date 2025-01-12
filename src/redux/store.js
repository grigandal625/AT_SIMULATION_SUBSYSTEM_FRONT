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
    // Other store configuration goes here
});

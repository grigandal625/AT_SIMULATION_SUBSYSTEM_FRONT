import MonacoEditor from "@uiw/react-monacoeditor";
import { useState, useEffect } from "react";

export const defaultEditorBackground = "#e9e9ff";
export const defaultEditorSidersBackground = "#d8d8ed";
export const defaultEditorDidMount = (_, monaco) => {
    monaco.editor.defineTheme("at-sym", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": defaultEditorBackground,
            "scrollbarSlider.background": defaultEditorSidersBackground,
            "editorGutter.background": defaultEditorSidersBackground,
        },
    });
};

export const defaultEditorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: "line",
    automaticLayout: false,
    theme: "at-sym",
    scrollbar: {
        useShadows: true,
        verticalHasArrows: true,
        horizontalHasArrows: true,
        vertical: "visible",
        horizontal: "visible",
        verticalScrollbarSize: 17,
        horizontalScrollbarSize: 17,
        arrowSize: 30,
    },
    suggest: {
        showFields: false,
        showFunctions: false,
    },
};

const CodeEditorItem = ({ value, onChange, onCodeChanged, relevantResources, ...props }) => {
    const [code, setCode] = useState(value);
    useEffect(() => {
        setCode(value);
    }, []);

    useEffect(() => {
        try {
            onChange(code);
        } catch (e) {}
        try {
            onCodeChanged(code);
        } catch (e) {}
    }, [code]);

    return <MonacoEditor onChange={setCode} {...props} />;
};

export default CodeEditorItem;
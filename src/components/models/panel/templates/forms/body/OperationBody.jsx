import { useEffect, useState } from "react";

import { theme, Row, Col, Form, InputNumber, Collapse } from "antd";
import CodeEditorItem, { defaultEditorDidMount, defaultEditorOptions } from "../../../../../../utils/CodeEditorItem";
import { makeAutoComplete } from "./autoComplete";
import TinyFormItem from "../../../../../../utils/TinyFormItem";
// import {} from "monaco-editor/esm/vs/editor/browser/services/editorWorkerService";

export default ({ form, relevantResources, resourceTypes }) => {
    const {
        token: { colorInfoBg },
    } = theme.useToken();
    
    const editorDidMount = defaultEditorDidMount;
    const codeEditorOptions = defaultEditorOptions;

    const autoComplete = makeAutoComplete(relevantResources, resourceTypes);

    const conditionItem = {
        key: "condition",
        label: "Предусловие",
        children: (
            <TinyFormItem name={["body", "condition"]}>
                <CodeEditorItem
                    language="go"
                    relevantResources={relevantResources}
                    options={codeEditorOptions}
                    height="75px"
                    autoComplete={autoComplete}
                    editorDidMount={editorDidMount}
                />
            </TinyFormItem>
        ),
    };

    const bodyBeforeItem = {
        key: "body_before",
        label: "Действия в начале",
        children: (
            <TinyFormItem name={["body", "body_before"]}>
                <CodeEditorItem
                    language="go"
                    relevantResources={relevantResources}
                    options={codeEditorOptions}
                    height="200px"
                    // autoComplete={autoComplete}
                    editorDidMount={editorDidMount}
                />
            </TinyFormItem>
        ),
    };

    const bodyAfterItem = {
        key: "body_after",
        label: "Действия в конце",
        children: (
            <TinyFormItem name={["body", "body_after"]}>
                <CodeEditorItem
                    language="go"
                    relevantResources={relevantResources}
                    options={codeEditorOptions}
                    height="200px"
                    // autoComplete={autoComplete}
                    editorDidMount={editorDidMount}
                />
            </TinyFormItem>
        ),
    };

    return (
        <div>
            <Form.Item labelCol={6} layout="horizontal" name={["body", "delay"]} label="Длительность">
                <InputNumber style={{width: "100%"}} placeholder="Укажите длительность" />
            </Form.Item>
            <Row gutter={[5, 5]}>
                <Col span={24}>
                    <Collapse size="small" defaultActiveKey="condition" items={[conditionItem]} />
                </Col>
                <Col flex={12} style={{ maxWidth: "50%" }}>
                    <Collapse size="small" defaultActiveKey="body_before" items={[bodyBeforeItem]} />
                </Col>
                <Col flex={12} style={{ maxWidth: "50%" }}>
                    <Collapse size="small" defaultActiveKey="body_after" items={[bodyAfterItem]} />
                </Col>
            </Row>
        </div>
    );
};

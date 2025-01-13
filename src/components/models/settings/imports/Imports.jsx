import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createImport, deleteImport, loadImports, updateImport } from "../../../../redux/stores/importsStore";
import { Button, Empty, Skeleton, Space, Table, Tag, Typography, Modal, Form, Col, Row } from "antd";
import { LOAD_STATUSES } from "../../../../GLOBAL";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import ImportForm from "./forms/ImportForm";

export default () => {
    const imports = useSelector((state) => state.imports);
    const params = useParams();
    const dispatch = useDispatch();
    const [modal, contextHandler] = Modal.useModal();

    useEffect(() => {
        dispatch(loadImports(params.modelId));
    }, [params.modelId]);

    const [form] = Form.useForm();

    const performCreate = async () => {
        const importData = await form.validateFields();
        await dispatch(createImport({ modelId: params.modelId, importData }));
    };

    const handleCreate = () => {
        form.resetFields();
        modal
            .confirm({
                width: 1300,
                title: "Добавление новой библиотеки",
                content: <ImportForm form={form} layout="vertical" />,
                onOk: performCreate,
                okText: "Добавить",
                cancelText: "Отмена",
            })
            .then()
            .catch();
    };

    const performEdit = async () => {
        const importData = await form.validateFields();
        await dispatch(updateImport({ modelId: params.modelId, importData }));
    };

    const handleEdit = (importData) => () => {
        form.setFieldsValue(importData);
        modal
            .confirm({
                width: 1300,
                title: "Редактирование библиотеки",
                content: <ImportForm form={form} layout="vertical" />,
                onOk: performEdit,
                okText: "Сохранить",
                cancelText: "Отмена",
            })
            .then()
            .catch();
    };

    const performDelete = (importData) => async () => {
        await dispatch(deleteImport({ modelId: params.modelId, importId: importData.id }));
    };

    const handleDelete = (importData) => () => {
        modal
            .confirm({
                title: "Удаление библиотеки",
                content: `Вы уверены, что хотите удалить библиотеку "${importData.name}"?`,
                onOk: performDelete(importData),
                okText: "Удалить",
                cancelText: "Отмена",
                okButtonProps: {
                    danger: true,
                },
            })
            .then()
            .catch();
    };

    const columns = [
        {
            title: "Имя библиотеки",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Версия",
            dataIndex: "version",
            key: "version",
        },
        {
            title: "Используемые пакеты",
            dataIndex: "pkgs",
            key: "packages",
            render: (packages) => (
                <Space>
                    {packages.map((p) => (
                        <Tag style={{ maxWidth: 120, textOverflow: "ellipsis", overflow: "hidden" }}>
                            {p.alias && ![".", "_"].includes(p.alias) ? `${p.alias} (${p.name})` : p.name}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: "Действия",
            key: "actions",
            render: (importData) => (
                <Space>
                    <Button size="small" onClick={handleEdit(importData)} icon={<EditOutlined />} />
                    <Button size="small" onClick={handleDelete(importData)} icon={<DeleteOutlined />} danger />
                </Space>
            ),
        },
    ];

    const importsView = imports.data.length ? (
        <Table
            size="small"
            title={() => (
                <Row align="middle">
                    <Col flex="auto">
                        <Typography.Title style={{ marginTop: 10 }} level={5}>
                            Подключаемые библиотеки Golang
                        </Typography.Title>
                    </Col>
                    <Button onClick={handleCreate} icon={<PlusOutlined />}>
                        Добавить
                    </Button>
                </Row>
            )}
            columns={columns}
            dataSource={imports.data}
            pagination={false}
        />
    ) : (
        <Empty description="Подключаемых библиотек не добавлено">
            <Button type="primary" onClick={handleCreate} icon={<PlusOutlined />}>
                Добавить
            </Button>
        </Empty>
    );

    return imports.status === LOAD_STATUSES.SUCCESS ? (
        <>
            {importsView}
            {contextHandler}
        </>
    ) : (
        <Skeleton active />
    );
};

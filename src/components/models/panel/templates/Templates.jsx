import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useMatches, useNavigate, useParams } from "react-router-dom";
import { deleteTemplate, loadTemplates } from "../../../../redux/stores/templatesStore";
import { LOAD_STATUSES } from "../../../../GLOBAL";
import { Button, Col, Dropdown, Empty, Menu, Modal, Row, Skeleton, Typography } from "antd";
import { EditOutlined, PlusOutlined, CopyOutlined, DeleteOutlined, DashOutlined } from "@ant-design/icons";

import "../PanelMenu.css";
import CreateTemplateModal from "./dialogs/CreateTemplateModal";
import EditTemplateModal from "./dialogs/EditTemplateModal";

export default ({ closed }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modal, contextHandler] = Modal.useModal();

    const templates = useSelector((state) => state.templates);
    const params = useParams();
    const matches = useMatches();
    const createOpen = Boolean(matches.find((match) => /models\/\d+\/templates\/new/g.test(match.pathname)));
    const editOpen = Boolean(matches.find((match) => /models\/\d+\/templates\/\d+\/edit/g.test(match.pathname)));

    useEffect(() => {
        if (templates.status === LOAD_STATUSES.TO_REFRESH) {
            dispatch(loadTemplates(params.modelId));
        }
    }, [templates.status]);

    useEffect(() => {
        dispatch(loadTemplates(params.modelId));
    }, [params.modelId]);

    const dropDownItems = (template) => [
        {
            key: "edit",
            label: "Редактировать",
            icon: <EditOutlined />,
        },
        {
            key: "duplicate",
            label: "Дублировать",
            icon: <CopyOutlined />,
        },
        {
            key: "delete",
            label: "Удалить",
            icon: <DeleteOutlined />,
            danger: true,
        },
    ];

    const handleEditTemplate = (template) => navigate(`/models/${params.modelId}/templates/${template.meta.id}/edit`);

    const handleDuplicateTemplate = async (template) => {
        // duplicate template
        // dispatch(duplicateTemplate({modelId: params.modelId, templateId: template.meta.id}));
    };

    const handleDeleteTemplate = async (template) => {
        // delete template
        await dispatch(deleteTemplate({ modelId: params.modelId, templateId: template.meta.id }));
        navigate(`/models/${params.modelId}/templates`);
    };

    const confirmDeleteTemplate = (template) => {
        modal.confirm({
            title: "Удаление образца операции",
            content: (
                <>
                    <Typography.Paragraph>
                        Вы уверены, что хотите удалить образец операции <b>{template.meta.name}?</b>
                    </Typography.Paragraph>
                    <Typography.Paragraph>При удалении образца операции удалятся все операции данного образца</Typography.Paragraph>
                </>
            ),
            okText: "Удалить",
            cancelText: "Отмена",
            icon: <DeleteOutlined />,
            onOk: () => handleDeleteTemplate(template),
        });
    };

    const options = {
        edit: handleEditTemplate,
        duplicate: handleDuplicateTemplate,
        delete: confirmDeleteTemplate,
    };

    const itemLabel = (template) => (
        <Row style={{ width: "100%" }} gutter={10}>
            <Col flex="auto">
                <Link to={`/models/${params.modelId}/templates/${template.meta.id}`}>{template.meta.name}</Link>
            </Col>
            <Col>
                <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: dropDownItems(template),
                        onClick: ({ key }) => options[key](template),
                    }}
                >
                    <Button size="small" icon={<DashOutlined />} />
                </Dropdown>
            </Col>
        </Row>
    );

    const itemsMenu = templates.data.length ? (
        <Menu
            selectedKeys={[params.templateId]}
            items={templates.data.map((template) => {
                return {
                    key: template.meta.id.toString(),
                    label: itemLabel(template),
                };
            })}
        />
    ) : (
        <Empty description="Образцов операций не создано" />
    );

    const className = closed ? ["model-item-menu", "closed"] : ["model-item-menu"];

    return templates.status === LOAD_STATUSES.SUCCESS ? (
        <div className="item-menu-wrapper">
            <div className={className.join(" ")}>{itemsMenu}</div>
            <Link to={`/models/${params.modelId}/templates/new`}>
                <Button type="primary" className="add-item-btn" icon={<PlusOutlined />}>
                    Создать образец операции
                </Button>
            </Link>
            {createOpen ? <CreateTemplateModal open={createOpen} /> : <></>}
            {editOpen ? <EditTemplateModal open={editOpen} /> : <></>}
            {contextHandler}
        </div>
    ) : (
        <Skeleton active />
    );
};

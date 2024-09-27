import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useMatches, useNavigate, useParams } from "react-router-dom";
import { deleteTemplate, loadTemplates } from "../../../../redux/stores/templatesStore";
import { LOAD_STATUSES } from "../../../../GLOBAL";
import { Button, Col, Dropdown, Menu, Modal, Row, Skeleton } from "antd";
import { EditOutlined, PlusOutlined, CopyOutlined, DeleteOutlined, DashOutlined } from "@ant-design/icons";

import "../PanelMenu.css";
import CreateTemplateModal from "./dialogs/CreateTemplateModal";
import EditTemplateModal from "./dialogs/EditTemplateModal";

export default () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modal, contextHandler] = Modal.useModal();

    const templates = useSelector((state) => state.templates);
    const params = useParams();
    const matches = useMatches();
    const createOpen = Boolean(matches.find((match) => /models\/\d+\/templates\/new/g.test(match.pathname)));
    const editOpen = Boolean(matches.find((match) => /models\/\d+\/templates\/\d+\/edit/g.test(match.pathname)));

    useEffect(() => {
        dispatch(loadTemplates(params.modelId));
    }, []);

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

    const handleEditTemplate = (template) => navigate(`/models/${params.modelId}/templates/${template.id}/edit`);

    const handleDuplicateTemplate = async (template) => {
        // duplicate template
        // dispatch(duplicateTemplate({modelId: params.modelId, templateId: template.id}));
    };

    const handleDeleteTemplate = async (template) => {
        // delete template
        await dispatch(deleteTemplate({ modelId: params.modelId, templateId: template.id }));
        navigate(`/models/${params.modelId}/templates`);
    };

    const confirmDeleteTemplate = (template) => {
        modal.confirm({
            title: "Удаление ресурса",
            content: (
                <>
                    Вы уверены, что хотите удалить ресурс <b>{template.name}?</b>
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

    return templates.status === LOAD_STATUSES.SUCCESS ? (
        <div>
            <div className="model-item-menu">
                <Menu
                    selectedKeys={[params.templateId]}
                    items={templates.data.map((template) => {
                        return {
                            key: template.id.toString(),
                            label: (
                                <Row gutter={10}>
                                    <Col flex="auto">
                                        <Link to={`/models/${params.modelId}/templates/${template.id}`}>{template.name}</Link>
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
                            ),
                        };
                    })}
                />
            </div>
            <Link to={`/models/${params.modelId}/templates/new`}>
                <Button type="primary" style={{ width: "100%" }} icon={<PlusOutlined />}>
                    Создать образец операции
                </Button>
            </Link>
            <CreateTemplateModal open={createOpen} />
            <EditTemplateModal open={editOpen} />
            {contextHandler}
        </div>
    ) : (
        <Skeleton active />
    );
};

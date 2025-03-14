import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useMatches, useNavigate, useParams } from "react-router-dom";
import { deleteResource, loadResources } from "../../../../redux/stores/resourcesStore";
import { LOAD_STATUSES } from "../../../../GLOBAL";
import { Button, Col, Dropdown, Empty, Menu, Modal, Row, Skeleton, Typography } from "antd";
import { EditOutlined, PlusOutlined, CopyOutlined, DeleteOutlined, DashOutlined } from "@ant-design/icons";

import "../PanelMenu.css";
import CreateResourceModal from "./dialogs/CreateResourceModal";
import EditResourceModal from "./dialogs/EditResourceModal";

export default ({ closed }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modal, contextHandler] = Modal.useModal();

    const resources = useSelector((state) => state.resources);
    const params = useParams();
    const matches = useMatches();
    const createOpen = Boolean(matches.find((match) => /models\/\d+\/resources\/new/g.test(match.pathname)));
    const editOpen = Boolean(matches.find((match) => /models\/\d+\/resources\/\d+\/edit/g.test(match.pathname)));

    useEffect(() => {
        dispatch(loadResources(params.modelId));
    }, [params.modelId]);

    const dropDownItems = (resource) => [
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

    const handleEditResource = (resource) => navigate(`/models/${params.modelId}/resources/${resource.id}/edit`);

    const handleDuplicateResource = async (resource) => {
        // duplicate resource
        // dispatch(duplicateResource({modelId: params.modelId, resourceId: resource.id}));
    };

    const handleDeleteResource = async (resource) => {
        // delete resource
        await dispatch(deleteResource({ modelId: params.modelId, resourceId: resource.id }));
        navigate(`/models/${params.modelId}/resources`);
    };

    const confirmDeleteResource = (resource) => {
        modal.confirm({
            title: "Удаление ресурса",
            content: (
                <>
                    <Typography.Paragraph>
                        Вы уверены, что хотите удалить ресурс <b>{resource.name}?</b>
                    </Typography.Paragraph>
                    <Typography.Paragraph>При удалении ресурса удалятся также релевантные ресурсы в операциях</Typography.Paragraph>
                </>
            ),
            okText: "Удалить",
            cancelText: "Отмена",
            icon: <DeleteOutlined />,
            onOk: () => handleDeleteResource(resource),
        });
    };

    const options = {
        edit: handleEditResource,
        duplicate: handleDuplicateResource,
        delete: confirmDeleteResource,
    };

    const className = closed ? ["model-item-menu", "closed"] : ["model-item-menu"];

    const itemLabel = (resource) => (
        <Row style={{ width: "100%" }} gutter={10}>
            <Col flex="auto">
                <Link to={`/models/${params.modelId}/resources/${resource.id}`}>{resource.name}</Link>
            </Col>
            <Col>
                <Dropdown
                    trigger={["click"]}
                    menu={{
                        items: dropDownItems(resource),
                        onClick: ({ key }) => options[key](resource),
                    }}
                >
                    <Button size="small" icon={<DashOutlined />} />
                </Dropdown>
            </Col>
        </Row>
    );

    const itemsMenu = resources.data.length ? (
        <Menu
            selectedKeys={[params.resourceId]}
            items={resources.data.map((resource) => {
                return {
                    key: resource.id.toString(),
                    label: itemLabel(resource),
                };
            })}
        />
    ) : (
        <Empty description="Ресурсов не создано" />
    );

    return resources.status === LOAD_STATUSES.SUCCESS ? (
        <div className="item-menu-wrapper">
            <div className={className.join(" ")}>{itemsMenu}</div>
            <Link to={`/models/${params.modelId}/resources/new`}>
                <Button type="primary" className="add-item-btn" icon={<PlusOutlined />}>
                    Создать ресурс
                </Button>
            </Link>
            {createOpen ? <CreateResourceModal open={createOpen} /> : <></>}
            {editOpen ? <EditResourceModal open={editOpen} /> : <></>}
            {contextHandler}
        </div>
    ) : (
        <Skeleton active />
    );
};

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useMatches, useNavigate, useParams } from "react-router-dom";
import { deleteResource, loadResources } from "../../../../redux/stores/resourcesStore";
import { LOAD_STATUSES } from "../../../../GLOBAL";
import { Button, Col, Dropdown, Menu, Modal, Row, Skeleton } from "antd";
import { EditOutlined, PlusOutlined, CopyOutlined, DeleteOutlined, DashOutlined } from "@ant-design/icons";

import "../PanelMenu.css";
import CreateResourceModal from "./dialogs/CreateResourceModal";
import EditResourceModal from "./dialogs/EditResourceModal";

export default () => {
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
    }, []);

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

    const handleEditResource = (resource) =>
        navigate(`/models/${params.modelId}/resources/${resource.id}/edit`);

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
                    Вы уверены, что хотите удалить ресурс <b>{resource.name}?</b>
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

    return resources.status === LOAD_STATUSES.SUCCESS ? (
        <div>
            <div className="model-item-menu">
                <Menu
                    selectedKeys={[params.resourceId]}
                    items={resources.data.map((resource) => {
                        return {
                            key: resource.id.toString(),
                            label: (
                                <Row>
                                    <Col flex="auto">
                                        <Link to={`/models/${params.modelId}/resources/${resource.id}`}>
                                            {resource.name}
                                        </Link>
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
                            ),
                        };
                    })}
                />
            </div>
            <Link to={`/models/${params.modelId}/resources/new`}>
                <Button type="primary" style={{ width: "100%" }} icon={<PlusOutlined />}>
                    Создать ресурс
                </Button>
            </Link>
            <CreateResourceModal open={createOpen} />
            <EditResourceModal open={editOpen} />
            {contextHandler}
        </div>
    ) : (
        <Skeleton active />
    );
};

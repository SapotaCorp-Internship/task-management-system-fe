import { useState } from "react";
import { Menu, Typography, Button, Input, Popconfirm } from "antd";
import { 
  FileTextOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  CheckOutlined, 
  CloseOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import useCategories from "../hooks/useCategory"; 
import useAuth from "../hooks/useAuth"; 

const { Title } = Typography;

interface AppSidebarProps {
  collapsed: boolean;
}

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  const { 
    categories, 
    loading: isFetching, 
    actionLoading, 
    handleCreateCategory, 
    handleUpdateCategory, 
    handleDeleteCategory 
  } = useCategories();

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const { handleLogout, loading: isLoggingOut } = useAuth();

  const onAddSubmit = async () => {
    if (!newName.trim()) return setIsAdding(false);
    try {
      await handleCreateCategory(newName); 
      setNewName("");
      setIsAdding(false);
    } catch (err) {
    }
  };

  const onUpdateSubmit = async (id: string) => {
    if (!editName.trim()) return setEditingId(null);
    await handleUpdateCategory(id, editName);
    setEditingId(null);
  };

  const menuItems = Array.isArray(categories) ? categories.map((c) => ({
    key: c.id.toString(),
    icon: <FileTextOutlined />,
    label: (
      <div className="flex items-center justify-between group">
        {editingId === c.id.toString() ? (
          <Input
            size="small"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={() => onUpdateSubmit(c.id.toString())}
            onPressEnter={() => onUpdateSubmit(c.id.toString())}
            autoFocus
          />
        ) : (
          <span className="truncate flex-1">{c.name}</span>
        )}
        
        {!collapsed && editingId !== c.id.toString() && (
          <div className="hidden group-hover:flex items-center gap-2">
            <EditOutlined 
              className="text-blue-500 hover:scale-110" 
              onClick={(e) => {
                e.stopPropagation();
                setEditingId(c.id.toString());
                setEditName(c.name);
              }} 
            />
            <Popconfirm
              title="Delete this category?"
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDeleteCategory(c.id.toString()); 
              }}
              onCancel={(e) => e?.stopPropagation()}
            >
              <DeleteOutlined 
                className="text-red-500 hover:scale-110" 
                onClick={(e) => e.stopPropagation()} 
              />
            </Popconfirm>
          </div>
        )}
      </div>
    ),
  })) : [];

  return (
    <div className={`flex flex-col h-screen transition-all duration-300 bg-white shadow-lg ${collapsed ? "w-20" : "w-72"}`}>
      <div className={`flex items-center p-4 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
          <FileTextOutlined />
        </div>
        {!collapsed && <Title level={5} className="!mb-0">TaskFlow</Title>}
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <Menu 
          mode="inline" 
          inlineCollapsed={collapsed} 
          items={menuItems} 
          className="border-none bg-transparent" 
        />
        
        {!collapsed && isAdding && (
          <div className="px-4 py-2">
            <Input
              placeholder="Add Category..."
              size="small"
              value={newName}
              autoFocus
              disabled={actionLoading} 
              onChange={(e) => setNewName(e.target.value)}
              onPressEnter={onAddSubmit}
              suffix={<CheckOutlined className="cursor-pointer text-green-500" onClick={onAddSubmit} />}
              onBlur={() => !newName && setIsAdding(false)}
            />
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="p-4 space-y-4">
          <Button
            type="dashed"
            icon={isAdding ? <CloseOutlined /> : <PlusOutlined />}
            block
            onClick={() => setIsAdding(!isAdding)}
            loading={isFetching} 
          >
            {isAdding ? "Cancel" : "Add Category"}
          </Button>
          <Popconfirm
          title="Are you sure you want to logout?"
          onConfirm={handleLogout}
          okText="Logout"
          cancelText="Stay"
          okButtonProps={{ danger: true, loading: isLoggingOut }}
        >
          <Button 
            type="text" 
            danger 
            block 
            icon={<LogoutOutlined />}
            className={`flex items-center ${collapsed ? "justify-center" : "justify-start"}`}
          >
            {!collapsed && "Logout"}
          </Button>
        </Popconfirm>
        </div>
      )}
    </div>
  );
}
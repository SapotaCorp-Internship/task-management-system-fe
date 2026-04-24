import { useEffect, useState, useMemo } from "react";
import {
  Table,
  Card,
  Typography,
  Badge,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  Button,
  Skeleton,
  message,
  Modal,
  Timeline,
  Space,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  HistoryOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import useTasks from "../hooks/useTask";
import useCategories from "../hooks/useCategory";
import useGetStats from "../hooks/useGetStats";
import GenericForm from "./GenericForm";

const { Title, Text } = Typography;

export default function DashboardContent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<number | null>(null);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [currentHistory, setCurrentHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const {
    tasks,
    loading,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    getTaskHistoryById,
    actionLoading,
  } = useTasks();

  const { categories } = useCategories();
  const { stats, loading: statsLoading } = useGetStats();

  useEffect(() => {
    if (searchParams.get("login") === "success") {
      messageApi.success("Login successfully!");
      navigate("/dashboard", { replace: true });
    }
  }, [searchParams, messageApi, navigate]);

  const processedData = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority
        ? t.priority === filterPriority
        : true;
      const matchesStatus = filterStatus ? t.rawStatus === filterStatus : true;
      const matchesCategory = filterCategory
        ? t.categoryId === filterCategory
        : true;

      return (
        matchesSearch && matchesPriority && matchesStatus && matchesCategory
      );
    });
  }, [tasks, searchQuery, filterPriority, filterStatus, filterCategory]);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterPriority(null);
    setFilterStatus(null);
    setFilterCategory(null);
  };

  const handleViewHistory = async (id: string) => {
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const res = await getTaskHistoryById(id);
      setCurrentHistory(res || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const onAddTask = async (values: any) => {
    try {
      await handleCreateTask(values);
      setTaskFormOpen(false);
    } catch (err) {
      console.error("Add task error:", err);
    }
  };
  const renderStats = () => {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {stats.map((item) => (
          <Card
            key={item.label}
            className="rounded-2xl border-0 shadow-sm bg-white overflow-hidden"
            styles={{ body: { padding: "24px" } }}
          >
            <Skeleton loading={statsLoading} active paragraph={{ rows: 1 }}>
              <div className="flex items-center justify-between">
                <div>
                  <Text
                    type="secondary"
                    className="text-xs font-bold uppercase tracking-widest block mb-1"
                  >
                    {item.label}
                  </Text>
                  <Title
                    level={2}
                    className="!mb-0 !mt-0 font-bold text-gray-800"
                  >
                    {String(item.value).padStart(2, "0")}
                  </Title>
                </div>
                <div
                  className="p-3 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                  }}
                >
                  {item.label.includes("Done") ||
                  item.label.includes("Completed") ? (
                    <CheckCircleOutlined className="text-xl" />
                  ) : item.label.includes("Progress") ? (
                    <SyncOutlined spin className="text-xl" />
                  ) : item.label.includes("Todo") ? (
                    <ClockCircleOutlined className="text-xl" />
                  ) : (
                    <FileTextOutlined className="text-xl" />
                  )}
                </div>
              </div>
            </Skeleton>
          </Card>
        ))}
      </div>
    );
  };
  const renderFilterBar = () => (
    <div className="flex flex-wrap items-center gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search title..."
        prefix={<SearchOutlined className="text-gray-400" />}
        className="w-full sm:w-[220px] rounded-lg"
        allowClear
      />

      <Select
        placeholder="Category"
        className="w-[150px]"
        allowClear
        value={filterCategory}
        onChange={setFilterCategory}
        options={categories?.map((c) => ({ label: c.name, value: c.id }))}
      />

      <Select
        placeholder="Priority"
        className="w-[130px]"
        allowClear
        value={filterPriority}
        onChange={setFilterPriority}
        options={[
          { value: "HIGH", label: "🔴 High" },
          { value: "MEDIUM", label: "🟡 Medium" },
          { value: "LOW", label: "🟢 Low" },
        ]}
      />

      <Select
        placeholder="Status"
        className="w-[150px]"
        allowClear
        value={filterStatus}
        onChange={setFilterStatus}
        options={[
          { value: "TODO", label: "To Do" },
          { value: "DOING", label: "In Progress" },
          { value: "DONE", label: "Completed" },
        ]}
      />

      <Button
        icon={<ReloadOutlined />}
        onClick={resetFilters}
        className="text-gray-500 hover:text-blue-600 border-none bg-transparent shadow-none"
      >
        Reset
      </Button>
    </div>
  );

  const renderTable = () => {
    const columns = [
      {
        title: "Title & Description",
        key: "title",
        width: 300,
        render: (_: any, record: any) => (
          <div className="flex flex-col gap-1 py-1">
            <Input
              className="font-bold text-blue-700 border-transparent hover:border-gray-200 focus:bg-white bg-transparent p-0 px-1"
              defaultValue={record.title}
              onBlur={(e) =>
                e.target.value !== record.title &&
                handleUpdateTask(record.key, { title: e.target.value })
              }
            />
            <Text type="secondary" className="text-[11px] px-1 line-clamp-1">
              {record.description || "No description"}
            </Text>
          </div>
        ),
      },
      {
        title: "Category",
        key: "categoryId",
        width: 150,
        render: (_: any, record: any) => (
          <Select
            variant="borderless"
            className="w-full"
            value={record.categoryId}
            loading={actionLoading === record.key}
            onChange={(val) =>
              handleUpdateTask(record.key, { categoryId: val })
            }
            options={categories?.map((c) => ({ label: c.name, value: c.id }))}
            placeholder="Select Category"
          />
        ),
      },
      {
        title: "Priority",
        key: "priority",
        width: 120,
        render: (_: any, record: any) => (
          <Select
            variant="borderless"
            className="w-full"
            defaultValue={record.priority}
            onChange={(val) => handleUpdateTask(record.key, { priority: val })}
            options={[
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
            ]}
          />
        ),
      },
      {
        title: "Status",
        key: "status",
        width: 150,
        render: (_: any, record: any) => (
          <Select
            variant="borderless"
            className="w-full"
            defaultValue={record.rawStatus}
            onChange={(val) => handleUpdateTask(record.key, { status: val })}
            options={[
              { value: "TODO", label: <Badge status="default" text="To Do" /> },
              {
                value: "DOING",
                label: <Badge status="processing" text="In Progress" />,
              },
              {
                value: "DONE",
                label: <Badge status="success" text="Completed" />,
              },
            ]}
          />
        ),
      },
      {
        title: "Deadline",
        key: "dueDate",
        width: 180,
        render: (_: any, record: any) => (
          <DatePicker
            variant="borderless"
            showTime
            format="HH:mm - DD/MM/YYYY"
            className="w-full"
            defaultValue={record.deadline ? dayjs(record.deadline) : undefined}
            onChange={(date) =>
              handleUpdateTask(record.key, {
                deadline: date ? date.toISOString() : undefined,
              })
            }
          />
        ),
      },
      {
        title: "Action",
        key: "action",
        width: 100,
        render: (_: any, record: any) => (
          <Space>
            <Button
              type="text"
              icon={<HistoryOutlined className="text-blue-500" />}
              onClick={() => handleViewHistory(record.key)}
            />
            <Popconfirm
              title="Xóa công việc?"
              onConfirm={() => handleDeleteTask(record.key)}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <Card className="rounded-3xl border-0 shadow-sm bg-white p-4">
        <div className="mb-6 px-2">
          <Title level={4} className="!mb-0">
            List of Tasks
          </Title>
          <Text type="secondary" className="text-xs italic">
            Manage your tasks with ease. Click on a task to edit details or view
            history.
          </Text>
        </div>
        <Table
          columns={columns}
          dataSource={processedData}
          loading={loading}
          rowKey="key"
          pagination={{ pageSize: 6 }}
          scroll={{ x: 1100 }}
        />
      </Card>
    );
  };

  return (
    <div className="p-0">
      {contextHolder}

      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="!mb-0">
            Task Dashboard
          </Title>
          <Text type="secondary">
            Organize and track your daily productivity.
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="rounded-lg h-10 px-6 bg-blue-600 shadow-md"
          onClick={() => setTaskFormOpen(true)}
        >
          New Task
        </Button>
      </div>

      {renderStats()}
      {renderFilterBar()}
      {renderTable()}

      <GenericForm
        open={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={onAddTask}
        fields={[
          {
            name: "title",
            label: "Title",
            type: "text",
            rules: [{ required: true }],
          },
          { name: "description", label: "Description", type: "text" },
          {
            name: "categoryId",
            label: "Category",
            type: "select",
            options:
              categories?.map((c) => ({ label: c.name, value: c.id })) || [],
          },
          {
            name: "priority",
            label: "Priority",
            type: "select",
            options: ["LOW", "MEDIUM", "HIGH"],
            rules: [{ required: true }],
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "To Do", value: "TODO" },
              { label: "In Progress", value: "DOING" },
              { label: "Completed", value: "DONE" },
            ],
            rules: [{ required: true }],
          },
          { name: "deadline", label: "Deadline", type: "date" },
        ]}
        title="Create New Task"
        confirmLoading={loading}
      />

      <Modal
        title="Change History"
        open={historyOpen}
        onCancel={() => setHistoryOpen(false)}
        footer={null}
        width={450}
        centered
      >
        <div className="py-2 max-h-[500px] overflow-y-auto pr-2">
          <Skeleton loading={historyLoading} active>
            <Timeline
              items={currentHistory.map((h: any) => {
                const isCreate = h.action === "CREATED" || !h.oldValue;
                const isDeadline = h.action?.includes("DEADLINE");
                const formatValue = (val: string) => {
                  if (!val || val === "null") return "Trống";
                  if (isDeadline)
                    return dayjs(val).isValid()
                      ? dayjs(val).format("HH:mm - DD/MM/YYYY")
                      : val;
                  return val.length > 30 ? `${val.slice(0, 30)}...` : val;
                };
                return {
                  children: (
                    <div className="flex flex-col mb-2">
                      <Text type="secondary" className="text-[11px]">
                        {dayjs(h.changedAt).format("HH:mm - DD/MM/YYYY")}
                      </Text>
                      <div className="text-sm mt-1">
                        <Text strong className="text-blue-700 mr-2">
                          {h.action}:
                        </Text>
                        {isCreate ? (
                          <Text italic className="text-gray-500">
                            Task created
                          </Text>
                        ) : (
                          <>
                            <Text delete className="text-gray-400">
                              {formatValue(h.oldValue)}
                            </Text>
                            <span className="mx-2 text-gray-400">→</span>
                            <Text className="text-blue-600 font-medium">
                              {formatValue(h.newValue)}
                            </Text>
                          </>
                        )}
                      </div>
                    </div>
                  ),
                };
              })}
            />
          </Skeleton>
        </div>
      </Modal>
    </div>
  );
}

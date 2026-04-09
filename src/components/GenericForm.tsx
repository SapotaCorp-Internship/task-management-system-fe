import { Form, Input, Select, Modal, Button, InputNumber, DatePicker } from "antd";
import { useEffect } from "react";

interface Field {
  name: string;
  label: string;
  type: "text" | "select" | "number" | "date"; 
  options?: any[]; 
  rules?: any[];
}

interface GenericFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  fields?: Field[];
  title: string;
  initialValues?: any;
  confirmLoading?: boolean;
}

export default function GenericForm({
  open,
  onClose,
  onSubmit,
  fields = [],
  title,
  initialValues,
  confirmLoading
}: GenericFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [initialValues, open, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={field.rules}
          >
            {field.type === "text" && <Input placeholder={`Nhập ${field.label.toLowerCase()}`} />}

            {field.type === "number" && <InputNumber className="w-full" placeholder="0" />}

            {field.type === "date" && (
              <DatePicker 
                className="w-full" 
                placeholder="Select date"
                showTime={{ format: 'HH:mm' }} 
                format="DD/MM/YYYY" 
              />
            )}

            {field.type === "select" && (
              <Select placeholder={`Select ${field.label.toLowerCase()}`} allowClear>
                {field.options?.map((opt) => {
                  const value = typeof opt === "object" ? opt.value : opt;
                  const label = typeof opt === "object" ? opt.label : opt;
                  return (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        ))}

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={confirmLoading}>
            Confirm
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
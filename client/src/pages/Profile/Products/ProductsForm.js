import { Col, message, Modal, Row, Select, Tabs, Form, Input, Checkbox } from 'antd';
import React, { useEffect, useRef } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, EditProduct } from "../../../apicalls/products";  // Corrected here
import { SetLoader } from "../../../redux/loadersSlice";
import Images from './images';

const additionalThings = [
    {
        label: "Bill Available",
        name: "billAvailable",
    },
    {
        label: "Warranty Available",
        name: "warrantyAvailable",
    },
    {
        label: "Accessories Available",
        name: "accessoriesAvailable",
    },
    {
        label: "Box Available",
        name: "boxAvailable",
    },
];

const rules = [
    {
        required: true,
        message: "Required",
    }
];

function ProductsForm({ showProductForm, setShowProductForm, selectedProduct, getData }) {
    const dispatch = useDispatch();
    const [selectedTab = "1", setSelectedTab] = React.useState("1");
    const { user } = useSelector(state => state.users)
    const onFinish = async (values) => {
        try {

            dispatch(SetLoader(true));
            let response = null;
            if (selectedProduct) {
                response = await EditProduct(selectedProduct._id, values);
            } else {
                values.seller = user._id;
                values.status = "pending";
                response = await addProduct(values);
            }
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                getData();
                setShowProductForm(false);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };
    const formRef = React.useRef(null);

    useEffect(() => {
        if (selectedProduct) {
            formRef.current.setFieldsValue(selectedProduct);
        } else {
            formRef.current.resetFields();
        }
    }, [selectedProduct]);

    return (
        <Modal
            title=""
            open={showProductForm}
            onCancel={() => setShowProductForm(false)}
            centered
            width={1000}
            okText="Save"
            onOk={() => formRef.current.submit()}
            {...(selectedTab==="2" && {footer : false})}
        >
            <div>
                <h1 className="text-primary text-2xl text-center font-semibold uppercase">
                    {selectedProduct ? "Edit Product" : "Add Product"}
                </h1>
                <Tabs defaultActiveKey="1" activeKey={selectedTab} onChange={(key) => setSelectedTab(key)}>
                    <Tabs.TabPane tab="General" key="1">
                        <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{
                            billAvailable: false,
                            warrantyAvailable: false,
                            accessoriesAvailable: false,
                            boxAvailable: false
                        }}>
                            <Form.Item label="Name" name="name" rules={rules}>
                                <Input type="text" />
                            </Form.Item>
                            <Form.Item label="Description" name="description" rules={rules}>
                                <TextArea type="text" />
                            </Form.Item>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Form.Item label="Price" name="price" rules={rules}>
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="Category" name="category" rules={rules}>
                                        <Select>
                                            <Select.Option value="">Select</Select.Option>
                                            <Select.Option value="Electronics">Electronics</Select.Option>
                                            <Select.Option value="Fashion">Fashion</Select.Option>
                                            <Select.Option value="Home">Home</Select.Option>
                                            <Select.Option value="Sports">Sports</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={8}>
                                    <Form.Item label="Age" name="age" rules={rules}>
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className="flex gap-10">
                                {additionalThings.map((item, index) => {
                                    return (
                                        <Form.Item label={item.label} name={item.name} key={index} valuePropName="checked">
                                            <Input type="checkbox"
                                                value={item.name}
                                                onChange={(e) => {
                                                    formRef.current.setFieldsValue({
                                                        [item.name]: e.target.checked,
                                                    });
                                                }}
                                                checked={formRef.current?.getFieldValue(item.name)}
                                            />
                                        </Form.Item>
                                    );
                                })}
                            </div>
                        </Form>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Images" key="2">
                        <Images selectedProduct={selectedProduct} getData={getData} setShowProductForm={setShowProductForm}/>
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </Modal>
    );
}

export default ProductsForm;

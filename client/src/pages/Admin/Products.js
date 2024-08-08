import { Button, Table, message } from "antd";
import React, { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { EditProduct, GetProducts, UpdateProductStatus } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";

function Products() {
    const [products, setProducts] = React.useState([]);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProducts(null);
            dispatch(SetLoader(false));
            if (response.success) {
                setProducts(response.products);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    const onStatusUpdate = async (id, status) => {
        try {
            console.log('Updating status for:', id, 'to', status); // Debug log
            dispatch(SetLoader(true));
            const response = await UpdateProductStatus(id, status); // Pass status directly
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                getData();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    const columns = [
        { title: "Product", dataIndex: "name" },
        { title: "Description", dataIndex: "description" },
        { title: "Price", dataIndex: "price" },
        { title: "Category", dataIndex: "category" },
        { title: "Age", dataIndex: "age" },
        { title: "Status", dataIndex: "status" },
        {
            title: "Added On",
            dataIndex: "createdAt",
            render: (text, record) => moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => {
                const { status, _id } = record;
                return (
                    <div className="flex gap-3">
                        {status === "pending" && (<span className="underline cursor-pointer" onClick={() => onStatusUpdate(_id, "approved")}>Approve</span>)}
                        {status === "pending" && (<span className="underline cursor-pointer" onClick={() => onStatusUpdate(_id, "rejected")}>Reject</span>)}
                        {status === "blocked" && (<span className="underline cursor-pointer" onClick={() => onStatusUpdate(_id, "approved")}>Unblocked</span>)}
                        {status === "approved" && (<span className="underline cursor-pointer" onClick={() => onStatusUpdate(_id, "blocked")}>Block</span>)}
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <Table columns={columns} dataSource={products} rowKey="_id" />
        </div>
    );
}

export default Products;

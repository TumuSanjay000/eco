import { Button, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import ProductsForm from "./ProductsForm";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProduct, GetProducts } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";

function Products() {
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [showProductForm, setShowProductForm] = React.useState(false);
    const [products, setProducts] = React.useState([]);
    const { user } = useSelector((state) => state.users);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProducts({
                seller: user._id,
            });
            dispatch(SetLoader(false));
            if (response.success) {
                setProducts(response.products);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    const columns = [
        { title: "Name", dataIndex: "name" },
        { title: "Description", dataIndex: "description" },
        { title: "Price", dataIndex: "price" },
        { title: "Category", dataIndex: "category" },
        { title: "Age", dataIndex: "age" },
        { title: "Status", dataIndex: "status" },
        {
          title:"Added On",
          dataIndex:"createdAt",
          render : (text,record) => moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
        },
        {
            title: "Action", dataIndex: "action",
            render: (text, record) => {
                return (
                    <div className="flex gap-5">
                        <i className="ri-delete-bin-line" onClick={()=>{deleteProduct(record._id);}} ></i>
                        <i className="ri-pencil-line"
                          onClick={() => {
                            setSelectedProduct(record);
                            setShowProductForm(true);
                          }}
                        ></i>
                    </div>
                );
            }
        },
    ];

    const deleteProduct = async (id) => {
        try {
          dispatch(SetLoader(true));
          const response = await DeleteProduct(id);
          dispatch(SetLoader(false));
          if (response.success) {
            message.success(response.message);
            getData();
          } else {
            message.error(response.message);
          }
        } catch (error) {
          dispatch(SetLoader(false));
          message.error(error.message);
        }
      };
      

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <div className="flex justify-end mb-2">
                <Button type="default" onClick={() =>{
                    setSelectedProduct(null);
                    setShowProductForm(true)
                }}>
                    Add Product
                </Button>
            </div>
            <Table columns={columns} dataSource={products} />
            {showProductForm && (
                <ProductsForm
                    showProductForm={showProductForm}
                    setShowProductForm={setShowProductForm}
                    selectedProduct={selectedProduct}
                    getData={getData}
                />
            )}
        </div>
    );
}

export default Products;

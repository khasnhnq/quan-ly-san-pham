import { useEffect, useState } from "react";
import supabase from "./lib/supabase";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  // Lấy danh sách sản phẩm
  async function getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Lỗi:", error);
      return;
    }

    setProducts(data);
  }

  // Thêm sản phẩm
  async function addProduct(e) {
    e.preventDefault();

    if (!name || !price || !quantity) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const { error } = await supabase.from("products").insert([
      {
        name: name,
        price: Number(price),
        quantity: Number(quantity),
      },
    ]);

    if (error) {
      console.error("Lỗi thêm:", error);
      alert("Thêm sản phẩm thất bại!");
      return;
    }

    alert("Thêm sản phẩm thành công!");

    clearForm();
    getProducts();
  }

  // Xóa sản phẩm
  async function deleteProduct(id) {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Lỗi xóa:", error);
      alert("Xóa sản phẩm thất bại!");
      return;
    }

    alert("Xóa sản phẩm thành công!");

    getProducts();
  }

  // Chọn sản phẩm để sửa
  function editProduct(product) {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
  }

  // Cập nhật sản phẩm
  async function updateProduct(e) {
    e.preventDefault();

    if (!name || !price || !quantity) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: name,
        price: Number(price),
        quantity: Number(quantity),
      })
      .eq("id", editingId);

    if (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
      return;
    }

    alert("Cập nhật thành công!");

    clearForm();
    getProducts();
  }

  // Xóa dữ liệu form
  function clearForm() {
    setName("");
    setPrice("");
    setQuantity("");
    setEditingId(null);
  }

  return (
    <div className="container">
      <h1>Quản Lý Sản Phẩm - CI/CD</h1>

      {/* FORM */}
      <form
        className="product-form"
        onSubmit={editingId ? updateProduct : addProduct}
      >
        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Giá"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Số lượng"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Cập nhật" : "Thêm sản phẩm"}
        </button>

        {editingId && (
          <button type="button" className="cancel-btn" onClick={clearForm}>
            Hủy
          </button>
        )}
      </form>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>

              <td>{product.name}</td>

              <td>{Number(product.price).toLocaleString("vi-VN")} VNĐ</td>

              <td>{product.quantity}</td>

              <td>
                {new Date(product.created_at).toLocaleDateString("vi-VN")}
              </td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() => editProduct(product)}
                >
                  Sửa
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(product.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

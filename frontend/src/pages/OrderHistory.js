import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import { toast } from "react-toastify";
import "../styles/orderHistory.css";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    const [showModal, setShowModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await API.get("/orders/my-orders");
            setOrders(res.data.orders);
            setFilteredOrders(res.data.orders);
        } catch (err) {
            console.error("FETCH ORDERS ERROR:", err.response || err);
            setError(err.response?.data?.message || "Failed to fetch Orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // FILTER + SORT LOGIC
    useEffect(() => {
        let temp = [...orders];

        if (statusFilter !== "all") {
            temp = temp.filter((o) => o.status === statusFilter);
        }

        temp.sort((a, b) => {
            return sortOrder === "newest"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt);
        });

        setFilteredOrders(temp);
    }, [orders, statusFilter, sortOrder]);

    // REORDER
    const handleReorder = async (order) => {
        try {
            await API.post("/cart", {
                foodId: order.foodItem._id,
                quantity: order.quantity
            });

            toast.success(
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <span>Item added to cart!</span>
                    <button
                        onClick={() => navigate("/cart")}
                        style={{
                            background: "#ffd600",
                            color: "#000",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        Go to Cart →
                    </button>
                </div>
            );

        } catch (err) {
            toast.error("Failed to reorder");
        }
    };

    // CANCEL
    const confirmCancel = (orderId) => {
        setSelectedOrderId(orderId);
        setShowModal(true);
    };

    const handleCancel = async () => {
        try {
            await API.put(`/orders/${selectedOrderId}/cancel`);
            toast.success("Order cancelled");
            fetchOrders();
        } catch {
            toast.error("Failed to cancel order");
        } finally {
            setShowModal(false);
            setSelectedOrderId(null);
        }
    };
    const StatusBar = ({ status }) => {
        const steps = ["pending", "accepted", "preparing", "completed"];
        const normalizedStatus = status?.trim().toLowerCase();
        const currentIndex = steps.indexOf(normalizedStatus);
        if(currentIndex === -1) return null; //invalid status
        const stepIcons = {
            pending: "🧾",
            accepted: "👨‍🍳",
            preparing: "🍳",
            completed: "✅"
        };
        // calculate progress %
        const progressPercent =
    normalizedStatus === "completed"
        ? 100
        : (currentIndex / (steps.length - 1)) * 100;

        return (
            <div className="progress-wrapper">

                {/* LINE */}
                <div className="progress-line"></div>
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                ></div>

                {/* STEPS */}
                <div className="progress-steps">
                    {steps.map((step, index) => {
                        let className = "step";

                        if(normalizedStatus === "completed") {
                            className += " completed";
                        } else if (index < currentIndex) {
                            className += " completed";
                        } else if (index === currentIndex) {
                            className += " active";
                        }

                        return (
                            <div key={step} className={className}>
                                <div className="step-circle">
                                    {(normalizedStatus === "completed" || index < currentIndex)
                                        ? "✓"
                                        : stepIcons[step]}
                                </div>
                                <span className="step-label">
                                    {step.charAt(0).toUpperCase() + step.slice(1)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };
    if (loading) return (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    );

    if (error) return <p>{error}</p>;

    return (
        <div className="order-history-container">

            <div className="order-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ⬅ Back
                </button>
                <h2>Order History</h2>
            </div>

            {/* FILTER BAR */}
            <div className="filter-bar">
                <select onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="preparing">Preparing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <select onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            {filteredOrders.length === 0 ? (
                <p>No matching orders</p>
            ) : (
                filteredOrders.map((order) => (
                    <div key={order._id} className="order-card">

                        {/* TOP CONTENT */}
                        <div className="order-top">

                            {/* LEFT COLUMN */}
                            <div className="order-col left">
                                <div className="order-title">
                                    {order.foodItem.title}
                                </div>

                                <p className="order-meta">Cook: {order.cook.name}</p>

                                <p className="order-date">
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="order-col right">
                                <p className="order-meta">Qty: {order.quantity}</p>

                                <p className="order-price">₹{order.totalPrice}</p>

                                <p className={`status ${order.status}`}>
                                    {order.status}
                                </p>
                            </div>

                        </div>

                        {/* PROGRESS BAR FULL WIDTH */}
                        <div className="order-progress">
                            {order.status === "cancelled" ? (
                                <div className="cancelled-text">
                                    Order Cancelled ❌
                                </div>
                            ) : (
                                <StatusBar status={order.status} />
                            )}
                        </div>

                        {/* ACTIONS */}
                        <div className="action-buttons">
                            <button
                                className="reorder-btn"
                                onClick={() => handleReorder(order)}
                            >
                                Reorder
                            </button>

                            {order.status === "pending" && (
                                <button
                                    className="cancel-btn"
                                    onClick={() => confirmCancel(order._id)}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>

                    </div>
                ))
            )}

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Cancel this order?</p>
                        <div className="modal-buttons">
                            <button onClick={handleCancel}>Yes</button>
                            <button onClick={() => setShowModal(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default OrderHistory;
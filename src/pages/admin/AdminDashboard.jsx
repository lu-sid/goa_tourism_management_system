import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Hotel, Utensils, CalendarCheck, MessageSquare,
  Users, Menu, X, Search, Plus, Pencil, Trash2, RefreshCw,
  LogOut, MapPin, IndianRupee, Clock, CheckCircle2, AlertCircle,
  ChevronRight, Eye, Save, XCircle
} from "lucide-react";

import api from "../../services/api";
import useAuth from "../../hooks/useAuth";
import "../../styles/admin.css";

const sections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "restaurants", label: "Restaurants", icon: Utensils },
  { id: "packages", label: "Tour Packages", icon: MapPin },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "users", label: "Users", icon: Users }
];

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const date = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  }) : "—";

const errorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong.";

const bookingStatusOptions = (status) => {
  const transitions = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Completed", "Cancelled"],
    Completed: [],
    Cancelled: []
  };

  return [status, ...(transitions[status] || [])];
};
const emptyHotel = {
  name: "",
  description: "",
  category: "Resort",
  address: "",
  city: "Goa",
  pricePerNight: "",
  rating: "0",
  amenities: "",
  images: "",
  contactNumber: "",
  email: "",
  totalRooms: "0",
  availableRooms: "0",
  status: "Active"
};

const emptyRestaurant = {
  name: "",
  description: "",
  cuisine: "",
  address: "",
  city: "Goa",
  averageCost: "0",
  rating: "0",
  openingTime: "",
  closingTime: "",
  images: "",
  contactNumber: "",
  status: "Active"
};

function StatusBadge({ status }) {
  const value = status || "Unknown";
  const className = value.toLowerCase().replace(/\s+/g, "-");

  return <span className={`admin-status admin-status-${className}`}>{value}</span>;
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-icon"><Icon size={21} /></div>
      <div>
        <span>{label}</span>
        <strong>{value ?? "—"}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function ListingEditor({ type, initial, onClose, onSave, saving }) {
  const isHotel = type === "hotel";
  const [form, setForm] = useState(() => {
    if (!initial) return isHotel ? emptyHotel : emptyRestaurant;

    return isHotel
      ? {
          ...emptyHotel,
          ...initial,
          address: initial.location?.address || "",
          city: initial.location?.city || "",
          amenities: (initial.amenities || []).join(", "),
          images: (initial.images || []).join("\n")
        }
      : {
          ...emptyRestaurant,
          ...initial,
          address: initial.location?.address || "",
          city: initial.location?.city || "",
          cuisine: (initial.cuisine || []).join(", "),
          images: (initial.images || []).join("\n")
        };
  });

  const change = (event) => {
    setForm((old) => ({ ...old, [event.target.name]: event.target.value }));
  };

  const submit = (event) => {
    event.preventDefault();

    if (
      isHotel &&
      Number(form.availableRooms || 0) > Number(form.totalRooms || 0)
    ) {
      window.alert("Available rooms cannot exceed total rooms.");
      return;
    }

    const common = {
      name: form.name.trim(),
      description: form.description.trim(),
      location: {
        address: form.address.trim(),
        city: form.city.trim()
      },
      rating: Number(form.rating || 0),
      images: form.images.split("\n").map((x) => x.trim()).filter(Boolean),
      contactNumber: form.contactNumber.trim(),
      status: form.status
    };

    const payload = isHotel
      ? {
          ...common,
          category: form.category,
          pricePerNight: Number(form.pricePerNight),
          amenities: form.amenities.split(",").map((x) => x.trim()).filter(Boolean),
          email: form.email.trim(),
          totalRooms: Number(form.totalRooms || 0),
          availableRooms: Number(form.availableRooms || 0)
        }
      : {
          ...common,
          cuisine: form.cuisine.split(",").map((x) => x.trim()).filter(Boolean),
          averageCost: Number(form.averageCost || 0),
          openingTime: form.openingTime,
          closingTime: form.closingTime
        };

    onSave(payload);
  };

  return (
    <div className="admin-modal-backdrop" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <form className="admin-modal" onSubmit={submit}>
        <div className="admin-modal-heading">
          <div>
            <span className="admin-eyebrow">{initial ? "EDIT LISTING" : "NEW LISTING"}</span>
            <h2>{initial ? "Update" : "Add"} {isHotel ? "hotel" : "restaurant"}</h2>
          </div>
          <button type="button" className="admin-icon-button" onClick={onClose}><X /></button>
        </div>

        <div className="admin-form-grid">
          <label className="admin-field admin-field-wide">
            Name
            <input name="name" value={form.name} onChange={change} required />
          </label>

          <label className="admin-field admin-field-wide">
            Description
            <textarea name="description" value={form.description} onChange={change} rows="3" required />
          </label>

          {isHotel ? (
            <>
              <label className="admin-field">
                Category
                <select name="category" value={form.category} onChange={change}>
                  {["Luxury", "Resort", "Budget", "Homestay", "Villa", "Other"].map(x => <option key={x}>{x}</option>)}
                </select>
              </label>
              <label className="admin-field">
                Price per night (₹)
                <input name="pricePerNight" type="number" min="0" value={form.pricePerNight} onChange={change} required />
              </label>
            </>
          ) : (
            <>
              <label className="admin-field">
                Cuisine (comma separated)
                <input name="cuisine" value={form.cuisine} onChange={change} placeholder="Goan, Indian, Seafood" />
              </label>
              <label className="admin-field">
                Average cost (₹)
                <input name="averageCost" type="number" min="0" value={form.averageCost} onChange={change} />
              </label>
            </>
          )}

          <label className="admin-field">
            Address
            <input name="address" value={form.address} onChange={change} required />
          </label>
          <label className="admin-field">
            City
            <input name="city" value={form.city} onChange={change} required />
          </label>

          <label className="admin-field">
            Contact number
            <input name="contactNumber" value={form.contactNumber} onChange={change} />
          </label>
          <label className="admin-field">
            Rating (0–5)
            <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={change} />
          </label>

          {isHotel ? (
            <>
              <label className="admin-field">
                Email
                <input name="email" type="email" value={form.email} onChange={change} />
              </label>
              <label className="admin-field">
                Amenities (comma separated)
                <input name="amenities" value={form.amenities} onChange={change} placeholder="Wi-Fi, Pool, Parking" />
              </label>
              <label className="admin-field">
                Total rooms
                <input name="totalRooms" type="number" min="0" value={form.totalRooms} onChange={change} />
              </label>
              <label className="admin-field">
                Available rooms
                <input name="availableRooms" type="number" min="0" value={form.availableRooms} onChange={change} />
              </label>
            </>
          ) : (
            <>
              <label className="admin-field">
                Opening time
                <input name="openingTime" value={form.openingTime} onChange={change} placeholder="09:00 AM" />
              </label>
              <label className="admin-field">
                Closing time
                <input name="closingTime" value={form.closingTime} onChange={change} placeholder="10:00 PM" />
              </label>
            </>
          )}

          <label className="admin-field admin-field-wide">
            Image URLs (one URL per line)
            <textarea name="images" value={form.images} onChange={change} rows="3" placeholder="https://..." />
          </label>

          <label className="admin-field">
            Listing status
            <select name="status" value={form.status} onChange={change}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>

        <div className="admin-modal-actions">
          <button type="button" className="admin-button admin-button-light" onClick={onClose}>Cancel</button>
          <button type="submit" className="admin-button admin-button-primary" disabled={saving}>
            <Save size={16} /> {saving ? "Saving..." : "Save listing"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [users, setUsers] = useState([]);

  const [editor, setEditor] = useState(null);
  const [responseDrafts, setResponseDrafts] = useState({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.all([
        api.get("/hotels/admin/all"),
        api.get("/restaurants/admin/all"),
        api.get("/bookings"),
        api.get("/feedback"),
        api.get("/users")
      ]);

      setHotels(results[0].data.hotels || []);
      setRestaurants(results[1].data.restaurants || []);
      setBookings(results[2].data.bookings || []);
      setFeedback(results[3].data.feedback || []);
      setUsers(results[4].data.users || []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const filtered = (items, getText) => {
    const term = search.trim().toLowerCase();
    if (!term) return items;

    return items.filter(item => getText(item).toLowerCase().includes(term));
  };

  const saveListing = async (payload) => {
    if (!editor) return;

    setSaving(true);
    setError("");

    try {
      const base = editor.type === "hotel" ? "/hotels" : "/restaurants";
      if (editor.item?._id) {
        await api.put(`${base}/${editor.item._id}`, payload);
      } else {
        await api.post(base, payload);
      }

      setEditor(null);
      notify("Listing saved successfully.");
      await loadData();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const deleteListing = async (type, item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

    try {
      const base = type === "hotel" ? "/hotels" : "/restaurants";
      await api.delete(`${base}/${item._id}`);
      notify("Listing deleted.");
      await loadData();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const changeBookingStatus = async (booking, status) => {
    try {
      await api.patch(`/bookings/${booking._id}/status`, { status });
      notify(`Booking updated to ${status}.`);
      await loadData();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const changeFeedback = async (item, status) => {
    try {
      await api.put(`/feedback/${item._id}`, {
        status,
        adminResponse: responseDrafts[item._id] ?? item.adminResponse ?? ""
      });
      notify("Feedback updated.");
      await loadData();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const removeFeedback = async (item) => {
    if (!window.confirm("Delete this feedback permanently?")) return;

    try {
      await api.delete(`/feedback/${item._id}`);
      notify("Feedback deleted.");
      await loadData();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const removeUser = async (item) => {
    if (!window.confirm(`Delete user ${item.name}?`)) return;

    try {
      await api.delete(`/users/${item._id}`);
      notify("User deleted.");
      await loadData();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentTitle = sections.find(s => s.id === active)?.label || "Overview";

  const stats = useMemo(() => {
    const revenue = bookings
      .filter(x => ["Confirmed", "Completed"].includes(x.status))
      .reduce((total, x) => total + Number(x.totalAmount || 0), 0);

    return {
      hotels: hotels.length,
      restaurants: restaurants.length,
      bookings: bookings.length,
      pending: bookings.filter(x => x.status === "Pending").length,
      users: users.length,
      feedback: feedback.filter(x => x.status === "New").length,
      revenue,
      confirmed: bookings.filter(x => x.status === "Confirmed").length,
      completed: bookings.filter(x => x.status === "Completed").length,
      cancelled: bookings.filter(x => x.status === "Cancelled").length
    };
  }, [hotels, restaurants, bookings, users, feedback]);

  const recentBookings = bookings.slice(0, 5);

  const renderOverview = () => (
    <>
      <div className="admin-welcome">
        <div>
          <span className="admin-eyebrow">SUSHEGAD GOA · CONTROL CENTRE</span>
          <h2>Welcome back, {user?.name?.split(" ")[0] || "Admin"}.</h2>
          <p>Here's what's happening across your tourism platform.</p>
        </div>
        <button className="admin-button admin-button-light" onClick={loadData}>
          <RefreshCw size={16} /> Refresh data
        </button>
      </div>

      <div className="admin-stats-grid">
        <StatCard icon={Hotel} label="Hotels" value={stats.hotels} detail="All listings" />
        <StatCard icon={Utensils} label="Restaurants" value={stats.restaurants} detail="All listings" />
        <StatCard icon={CalendarCheck} label="Bookings" value={stats.bookings} detail={`${stats.pending} pending`} />
        <StatCard icon={IndianRupee} label="Booking value" value={money(stats.revenue)} detail="Confirmed and completed bookings" />
        <StatCard icon={Users} label="Tourists" value={stats.users} detail="Registered accounts" />
        <StatCard icon={MessageSquare} label="New feedback" value={stats.feedback} detail="Awaiting review" />
      </div>

      <section className="admin-panel admin-analytics-panel">
        <div className="admin-panel-heading">
          <div>
            <h3>Booking performance</h3>
            <p>Live status breakdown from stored bookings</p>
          </div>
          <strong>{stats.bookings} total</strong>
        </div>

        {[
          { label: "Pending", count: stats.pending },
          { label: "Confirmed", count: stats.confirmed },
          { label: "Completed", count: stats.completed },
          { label: "Cancelled", count: stats.cancelled }
        ].map(item => (
          <div className="admin-breakdown-row" key={item.label}>
            <div className="admin-breakdown-label">
              <span>{item.label}</span>
              <strong>{item.count}</strong>
            </div>
            <div className="admin-breakdown-track">
              <div
                className={`admin-breakdown-fill admin-breakdown-${item.label.toLowerCase()}`}
                style={{
                  width: `${stats.bookings ? (item.count / stats.bookings) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        ))}
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div><h3>Recent bookings</h3><p>Latest booking activity</p></div>
          <button className="admin-text-button" onClick={() => setActive("bookings")}>View all <ChevronRight size={16} /></button>
        </div>
        {recentBookings.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Reference</th><th>Tourist</th><th>Type</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b._id}>
                    <td className="admin-reference">{b.bookingId}</td>
                    <td>{b.user?.name || "Tourist"}</td>
                    <td>{b.bookingType}</td>
                    <td>{date(b.bookingDate || b.createdAt)}</td>
                    <td>{money(b.totalAmount)}</td>
                    <td><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="admin-empty">No bookings yet.</div>}
      </section>

      <div className="admin-quick-grid">
        <button onClick={() => { setActive("hotels"); setEditor({ type: "hotel", item: null }); }}>
          <Hotel /><span><strong>Add a hotel</strong><small>Create a new stay listing</small></span><Plus />
        </button>
        <button onClick={() => { setActive("restaurants"); setEditor({ type: "restaurant", item: null }); }}>
          <Utensils /><span><strong>Add a restaurant</strong><small>Create a dining listing</small></span><Plus />
        </button>
        <button onClick={() => setActive("bookings")}>
          <CalendarCheck /><span><strong>Review bookings</strong><small>{stats.pending} awaiting action</small></span><ChevronRight />
        </button>
      </div>
    </>
  );

  const renderListings = (type) => {
    const isHotel = type === "hotel";
    const items = isHotel ? hotels : restaurants;
    const visible = filtered(items, x =>
      `${x.name} ${x.location?.city} ${x.status}` 
    );

    return (
      <section className="admin-panel">
        <div className="admin-panel-heading admin-list-heading">
          <div><h3>{isHotel ? "Hotel listings" : "Restaurant listings"}</h3><p>Manage published and unpublished listings</p></div>
          <button className="admin-button admin-button-primary" onClick={() => setEditor({ type, item: null })}>
            <Plus size={17} /> Add {isHotel ? "hotel" : "restaurant"}
          </button>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${isHotel ? "hotels" : "restaurants"}...`} /></div>
          <span>{visible.length} listings</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Location</th><th>{isHotel ? "Price / night" : "Average cost"}</th><th>Rating</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {visible.map(item => (
                <tr key={item._id}>
                  <td><strong>{item.name}</strong><small className="admin-cell-sub">{isHotel ? item.category : (item.cuisine || []).join(", ")}</small></td>
                  <td>{item.location?.city || "—"}</td>
                  <td>{money(isHotel ? item.pricePerNight : item.averageCost)}</td>
                  <td>{Number(item.rating || 0).toFixed(1)} / 5</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>
                    <div className="admin-actions">
                      <button title="Edit" onClick={() => setEditor({ type, item })}><Pencil size={16} /></button>
                      <button title="Delete" className="admin-danger-icon" onClick={() => deleteListing(type, item)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <div className="admin-empty">No matching listings found.</div>}
        </div>
      </section>
    );
  };

  const renderBookings = () => {
    const visible = filtered(bookings, x =>
      `${x.bookingId} ${x.user?.name} ${x.user?.email} ${x.hotel?.name} ${x.status}`
    );

    return (
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h3>Booking management</h3><p>Review requests and update booking status</p></div></div>
        <div className="admin-toolbar">
          <div className="admin-search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings..." /></div>
          <span>{visible.length} bookings</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Reference</th><th>Tourist</th><th>Stay / package</th><th>Dates</th><th>Guests</th><th>Amount</th><th>Status</th><th>Update</th></tr></thead>
            <tbody>
              {visible.map(b => (
                <tr key={b._id}>
                  <td className="admin-reference">{b.bookingId}</td>
                  <td>{b.user?.name || "—"}<small className="admin-cell-sub">{b.user?.email || ""}</small></td>
                  <td>{b.hotel?.name || b.tourPackage?.name || b.bookingType}</td>
                  <td>{b.checkIn ? `${date(b.checkIn)} – ${date(b.checkOut)}` : date(b.bookingDate)}</td>
                  <td>{b.numberOfGuests}</td>
                  <td>{money(b.totalAmount)}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    <select className="admin-status-select" value={b.status} disabled={bookingStatusOptions(b.status).length === 1} onChange={e => changeBookingStatus(b, e.target.value)}>
                      {bookingStatusOptions(b.status).map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <div className="admin-empty">No bookings found.</div>}
        </div>
      </section>
    );
  };

  const renderFeedback = () => {
    const visible = filtered(feedback, x => `${x.name} ${x.email} ${x.subject} ${x.category} ${x.status}`);

    return (
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h3>Feedback & enquiries</h3><p>Review messages from tourists and respond to enquiries</p></div></div>
        <div className="admin-toolbar">
          <div className="admin-search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search feedback..." /></div>
          <span>{visible.length} messages</span>
        </div>
        <div className="admin-feedback-list">
          {visible.map(item => (
            <article className="admin-feedback-card" key={item._id}>
              <div className="admin-feedback-top">
                <div><span className="admin-eyebrow">{item.category}</span><h4>{item.subject}</h4><p>{item.name} · {item.email} · {date(item.createdAt)}</p></div>
                <StatusBadge status={item.status} />
              </div>
              <p className="admin-feedback-message">{item.message}</p>
              <label className="admin-field">
                Admin response
                <textarea
                  rows="2"
                  value={responseDrafts[item._id] ?? item.adminResponse ?? ""}
                  onChange={e => setResponseDrafts(old => ({ ...old, [item._id]: e.target.value }))}
                  placeholder="Write an internal response or reply..."
                />
              </label>
              <div className="admin-feedback-actions">
                <select className="admin-status-select" value={item.status} onChange={e => changeFeedback(item, e.target.value)}>
                  {["New", "In Progress", "Resolved"].map(s => <option key={s}>{s}</option>)}
                </select>
                <button className="admin-button admin-button-primary" onClick={() => changeFeedback(item, item.status)}><Save size={15} /> Save response</button>
                <button className="admin-icon-button admin-delete-button" title="Delete feedback" onClick={() => removeFeedback(item)}><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
          {!visible.length && <div className="admin-empty">No feedback found.</div>}
        </div>
      </section>
    );
  };

  const renderUsers = () => {
    const visible = filtered(users, x => `${x.name} ${x.email} ${x.phone} ${x.role}`);

    return (
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h3>Registered users</h3><p>View tourist accounts and account roles</p></div></div>
        <div className="admin-toolbar">
          <div className="admin-search"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." /></div>
          <span>{visible.length} users</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Action</th></tr></thead>
            <tbody>
              {visible.map(item => (
                <tr key={item._id}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.email}</td>
                  <td>{item.phone || "—"}</td>
                  <td><StatusBadge status={item.role} /></td>
                  <td>{date(item.createdAt)}</td>
                  <td>
                    {item._id !== user?._id && (
                      <button className="admin-icon-button admin-delete-button" title="Delete user" onClick={() => removeUser(item)}><Trash2 size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && <div className="admin-empty">No users found.</div>}
        </div>
      </section>
    );
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${mobileOpen ? "admin-sidebar-open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-mark">S</div>
          <div><strong>Sushegad Goa</strong><span>ADMIN STUDIO</span></div>
          <button className="admin-mobile-close" onClick={() => setMobileOpen(false)}><X /></button>
        </div>

        <div className="admin-side-label">WORKSPACE</div>
        <nav className="admin-nav">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <button key={section.id} className={active === section.id ? "active" : ""} onClick={() => {
                setSearch("");
                setMobileOpen(false);

                if (section.id === "packages") {
                  navigate("/admin/packages");
                  return;
                }

                setActive(section.id);
              }}>
                <Icon size={18} /><span>{section.label}</span>
                {section.id === "bookings" && stats.pending > 0 && <small>{stats.pending}</small>}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-mini">
            <div className="admin-avatar">{(user?.name || "A").charAt(0).toUpperCase()}</div>
            <div><strong>{user?.name || "Administrator"}</strong><span>Administrator</span></div>
          </div>
          <button className="admin-logout" onClick={handleLogout}><LogOut size={17} /> Sign out</button>
          <Link to="/" className="admin-back-site">← Back to website</Link>
        </div>
      </aside>

      {mobileOpen && <button className="admin-mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="admin-mobile-menu" onClick={() => setMobileOpen(true)}><Menu /></button>
          <div><span>Workspace</span><ChevronRight size={14} /><strong>{currentTitle}</strong></div>
          <button className="admin-refresh" onClick={loadData} title="Refresh"><RefreshCw size={17} /></button>
        </header>

        <div className="admin-content">
          {error && <div className="admin-alert admin-alert-error"><AlertCircle size={18} />{error}<button onClick={() => setError("")}><X size={16} /></button></div>}
          {notice && <div className="admin-alert admin-alert-success"><CheckCircle2 size={18} />{notice}</div>}

          {loading ? (
            <div className="admin-loading"><RefreshCw className="admin-spin" size={25} /><span>Loading admin workspace...</span></div>
          ) : (
            <>
              {active === "overview" && renderOverview()}
              {active === "hotels" && renderListings("hotel")}
              {active === "restaurants" && renderListings("restaurant")}
              {active === "bookings" && renderBookings()}
              {active === "feedback" && renderFeedback()}
              {active === "users" && renderUsers()}
            </>
          )}
        </div>
      </main>

      {editor && (
        <ListingEditor
          key={`${editor.type}-${editor.item?._id || "new"}`}
          type={editor.type}
          initial={editor.item}
          onClose={() => setEditor(null)}
          onSave={saveListing}
          saving={saving}
        />
      )}
    </div>
  );
}


import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../src/storeSlices/hooks";
import {
  fetchBookingById,
  updateBooking,
  type Booking,
  clearBooking,
} from "../../src/storeSlices/bookingSlice";

// Ensure HTML date inputs get yyyy-MM-dd strings
const toDateInput = (v?: string | null): string => {
  if (!v) return "";
  // If already yyyy-MM-dd, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  // Try to parse ISO and slice date part in UTC
  const d = new Date(v);
  if (isNaN(d.getTime())) return "";
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ReservationEdit = () => {
  const { id } = useParams();
  const bookingId = useMemo(() => Number(id), [id]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { booking, loading, error } = useAppSelector((s) => s.booking);

  const [form, setForm] = useState<Partial<Booking>>({
    check_in_date: "",
    check_out_date: "",
    status: "pending",
    additional_requests: "",
    total_cost: "",
  });

  useEffect(() => {
    if (Number.isFinite(bookingId)) {
      dispatch(fetchBookingById(bookingId));
    }
    return () => {
      dispatch(clearBooking());
    };
  }, [dispatch, bookingId]);

  useEffect(() => {
    if (booking && booking.booking_id === bookingId) {
      setForm({
        check_in_date: toDateInput(booking.check_in_date),
        check_out_date: toDateInput(booking.check_out_date),
        status: booking.status,
        additional_requests: booking.additional_requests ?? "",
        total_cost: booking.total_cost,
      });
    }
  }, [booking, bookingId]);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(bookingId)) return;
    await dispatch(updateBooking({ id: bookingId, updates: { ...form } }))
      .unwrap()
      .then(() => {
        navigate("/reservations");
      })
      .catch(() => {});
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6fa",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          padding: 24,
        }}
      >
        <h2 style={{ margin: 0, marginBottom: 4 }}>Edit Reservation</h2>
        <p style={{ marginTop: 0, color: "#667085" }}>Booking #{bookingId}</p>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              background: "#ffe8e8",
              color: "#a30000",
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label htmlFor="check_in_date" style={{ fontWeight: 600 }}>
              Check-in
            </label>
            <input
              id="check_in_date"
              name="check_in_date"
              type="date"
              value={form.check_in_date || ""}
              onChange={onChange}
              required
              style={{
                padding: "10px 12px",
                border: "1px solid #E4E7EC",
                borderRadius: 8,
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label htmlFor="check_out_date" style={{ fontWeight: 600 }}>
              Check-out
            </label>
            <input
              id="check_out_date"
              name="check_out_date"
              type="date"
              value={form.check_out_date || ""}
              onChange={onChange}
              required
              style={{
                padding: "10px 12px",
                border: "1px solid #E4E7EC",
                borderRadius: 8,
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label htmlFor="status" style={{ fontWeight: 600 }}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status || "pending"}
              onChange={onChange}
              style={{
                padding: "10px 12px",
                border: "1px solid #E4E7EC",
                borderRadius: 8,
                background: "white",
              }}
            >
              <option value="pending">pending</option>
              <option value="confirmed">confirmed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label htmlFor="total_cost" style={{ fontWeight: 600 }}>
              Total Cost
            </label>
            <input
              id="total_cost"
              name="total_cost"
              type="number"
              step="0.01"
              value={String(form.total_cost ?? "")}
              onChange={onChange}
              style={{
                padding: "10px 12px",
                border: "1px solid #E4E7EC",
                borderRadius: 8,
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label htmlFor="additional_requests" style={{ fontWeight: 600 }}>
              Additional Requests
            </label>
            <textarea
              id="additional_requests"
              name="additional_requests"
              value={(form.additional_requests as string) || ""}
              onChange={onChange}
              rows={4}
              style={{
                padding: "10px 12px",
                border: "1px solid #E4E7EC",
                borderRadius: 8,
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #E4E7EC",
                background: "#fff",
              }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                background: "#0ea5e9",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {loading ? "Updating..." : "Update Reservation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationEdit;

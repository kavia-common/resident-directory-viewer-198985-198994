import { MOCK_RESIDENTS } from "../data/mockResidents";

/**
 * Normalizes resident objects to a consistent shape used by the UI.
 * This allows backend payloads to vary slightly without breaking the UI.
 */
function normalizeResident(raw) {
  if (!raw || typeof raw !== "object") return null;

  const id = raw.id ?? raw._id ?? raw.uuid ?? raw.residentId;
  const firstName = raw.firstName ?? raw.first_name ?? raw.givenName ?? "";
  const lastName = raw.lastName ?? raw.last_name ?? raw.familyName ?? "";
  const unit = raw.unit ?? raw.apartment ?? raw.unitNumber ?? "";
  const phone = raw.phone ?? raw.phoneNumber ?? "";
  const email = raw.email ?? raw.emailAddress ?? "";
  const status = raw.status ?? raw.occupancyStatus ?? "Active";
  const moveInDate = raw.moveInDate ?? raw.move_in_date ?? raw.moveIn ?? "";
  const emergencyContact = raw.emergencyContact ?? raw.emergency_contact ?? null;
  const notes = raw.notes ?? raw.note ?? "";

  if (id === undefined || id === null) return null;

  return {
    id: String(id),
    firstName: String(firstName),
    lastName: String(lastName),
    unit: String(unit),
    phone: String(phone),
    email: String(email),
    status: String(status),
    moveInDate: String(moveInDate),
    emergencyContact: emergencyContact
      ? {
          name: String(emergencyContact.name ?? ""),
          phone: String(emergencyContact.phone ?? ""),
          relationship: String(emergencyContact.relationship ?? ""),
        }
      : null,
    notes: String(notes),
  };
}

// PUBLIC_INTERFACE
export async function getResidents() {
  /**
   * Fetch residents from `${process.env.REACT_APP_API_BASE}/residents` if configured,
   * otherwise return local mock data.
   */
  const base = process.env.REACT_APP_API_BASE;

  if (base) {
    const url = `${String(base).replace(/\/+$/, "")}/residents`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} from ${url}${text ? `: ${text}` : ""}`);
    }

    const payload = await res.json();
    const list = Array.isArray(payload) ? payload : payload?.residents ?? payload?.data ?? [];
    if (!Array.isArray(list)) {
      throw new Error("Unexpected response shape (expected array or { residents: [] })");
    }

    return list.map(normalizeResident).filter(Boolean);
  }

  // Fall back to mock data
  return MOCK_RESIDENTS;
}

import apiClient from "../api/axios";

const BASE = "/prescriptions";

const prescriptionService = {

    getAllByCustomer: (customerId) => {
        return apiClient.get(`${BASE}/customer/${customerId}`);
    },


    getById: (id) => {
        return apiClient.get(`${BASE}/${id}`);
    },

    // Create a prescription with medicines
    // payload shape:
    // {
    //   customerId, issueDate, startDate, durationInMonths,
    //   type, ordonnanceNumber, codeIndividuel, matriculeAdherent,
    //   regime, codeApci, notes,
    //   medicines: [{ medicineId, customMedicineName, instructions, fromMonth, toMonth, quantityPerMonth }]
    // }
    create: (prescriptionData) => {
        return apiClient.post(BASE, prescriptionData);
    },

    cancel: (id) => {
        return apiClient.patch(`${BASE}/${id}/cancel`);
    },

    // ─── Dispensing ───────────────────────────────────────────────────────────

    // First call — no overrides
    // payload: { itemId, quantity, overrideExpired: false, overrideEarly: false, note }
    //
    // If response.status === 202 → show confirmation dialog
    // Read response.data.outcome:
    //   "EXPIRED_WARNING"       → ask "Ordonnance expirée, confirmer ?"
    //   "EARLY_DISPENSE_WARNING" → ask "Mois pas encore atteint, confirmer ?"
    //
    // Second call — with override set to true after pharmacist confirms
    dispense: (dispenseData) => {
        return apiClient.post(`${BASE}/dispense`, dispenseData);
    },

    // ─── Helpers ─────────────────────────────────────────────────────────────

    dispenseOverrideExpired: (itemId, quantity, note = null) => {
        return apiClient.post(`${BASE}/dispense`, {
            itemId,
            quantity,
            overrideExpired: true,
            overrideEarly: false,
            note
        });
    },


    dispenseOverrideEarly: (itemId, quantity, note = null) => {
        return apiClient.post(`${BASE}/dispense`, {
            itemId,
            quantity,
            overrideExpired: false,
            overrideEarly: true,
            note
        });
    },


    dispenseOverrideBoth: (itemId, quantity, note = null) => {
        return apiClient.post(`${BASE}/dispense`, {
            itemId,
            quantity,
            overrideExpired: true,
            overrideEarly: true,
            note
        });
    }
};

export default prescriptionService;
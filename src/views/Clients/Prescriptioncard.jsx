import { useState } from 'react';

// react-bootstrap
import Badge from 'react-bootstrap/Badge';
import Collapse from 'react-bootstrap/Collapse';

// components
import PrescriptionStepper from './PrescriptionStepper';



const STATUS_CONFIG = {
    ACTIVE:    { label: 'Active',   bg: 'success', border: 'var(--bs-success)' },
    COMPLETED: { label: 'Complète', bg: 'primary', border: 'var(--bs-primary)' },
    CANCELLED: { label: 'Annulée',  bg: 'danger',  border: 'var(--bs-danger)'  },
};

const EXPIRED_BORDER = 'var(--bs-warning)';

export default function PrescriptionCard({ prescription }) {
    const [open, setOpen] = useState(false);

    const status = STATUS_CONFIG[prescription.status] || { label: prescription.status, bg: 'secondary', border: '#6c757d' };
    const isExpired = prescription.expired && prescription.status === 'ACTIVE';
    const borderColor = isExpired ? EXPIRED_BORDER : status.border;

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <div
            style={{
                border: `1.5px solid ${borderColor}`,
                borderLeft: `5px solid ${borderColor}`,
                borderRadius: '10px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                transition: 'box-shadow 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 3px 12px ${borderColor}28`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
            {/* ── Collapsed header ── */}
            <div
                onClick={() => setOpen(!open)}
                style={{
                    cursor: 'pointer',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '30px',
                }}
            >
                {/* Status badge */}
                <Badge
                    bg={isExpired ? 'warning' : status.bg}
                    text={isExpired ? 'dark' : undefined}
                    style={{
                        minWidth: '82px',
                        textAlign: 'center',
                        fontSize: '0.78rem',
                        padding: '6px 12px',
                        borderRadius: '6px',
                    }}
                >
                    {isExpired ? 'Expirée' : status.label}
                </Badge>

                {/* Date */}
                <span style={{ fontSize: '0.88rem', color: '#6c757d', whiteSpace: 'nowrap' }}>
          {formatDate(prescription.startDate)}
        </span>

                {/* Stepper */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <PrescriptionStepper
                        currentMonth={prescription.currentMonth}
                        durationInMonths={prescription.durationInMonths}
                        status={prescription.status}
                        expired={isExpired}
                    />
                </div>

                {/* Chevron */}
                <i
                    className={`ph ph-caret-${open ? 'up' : 'down'}`}
                    style={{ fontSize: '1rem', color: '#6c757d' }}
                />
            </div>

            {/* ── Expanded content ── */}
            <Collapse in={open}>
                <div>
                    <div style={{
                        borderTop: `1px solid ${borderColor}22`,
                        padding: '18px 20px',
                        backgroundColor: '#fafafa'
                    }}>
                        <div className="d-flex flex-wrap gap-3 mb-3">
                            {prescription.ordonnanceNumber && (
                                <div style={metaBlock}>
                                    <span style={metaLabel}>N° Ordonnance</span>
                                    <span style={metaValue} className="font-monospace">
                    {prescription.ordonnanceNumber}
                  </span>
                                </div>
                            )}
                            <div style={metaBlock}>
                                <span style={metaLabel}>Type</span>
                                <span style={metaValue}>{prescription.type === 'CNAM' ? 'CNAM' : 'Privée'}</span>
                            </div>
                            <div style={metaBlock}>
                                <span style={metaLabel}>Début</span>
                                <span style={metaValue}>{formatDate(prescription.startDate)}</span>
                            </div>
                            <div style={metaBlock}>
                                <span style={metaLabel}>Fin</span>
                                <span style={metaValue}>{formatDate(prescription.endDate)}</span>
                            </div>
                            <div style={metaBlock}>
                                <span style={metaLabel}>Durée</span>
                                <span style={metaValue}>{prescription.durationInMonths} mois</span>
                            </div>
                        </div>

                        {/* Dispensing placeholder */}
                        <div className="text-center text-muted py-3" style={{ fontSize: '0.88rem' }}>
                            <i className="ph ph-pills me-1" />
                            Les détails de dispensation seront affichés ici
                        </div>
                    </div>
                </div>
            </Collapse>
        </div>
    );
}

const metaBlock = { display: 'flex', flexDirection: 'column', gap: '3px' };
const metaLabel = {
    fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: '0.5px', color: '#adb5bd',
};
const metaValue = { fontSize: '0.9rem', fontWeight: 500, color: '#1a1a2e' };
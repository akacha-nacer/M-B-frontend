import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';

import MainCard from 'components/MainCard';

import customerService from 'services/customerService';
import prescriptionService from 'services/prescriptionService';

// components
import PrescriptionCard from './PrescriptionCard';

// ==============================|| PAGE - DETAIL CLIENT ||============================== //

export default function ClientDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loadingClient, setLoadingClient] = useState(true);
    const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            setLoadingClient(true);
            try {
                const response = await customerService.getById(id);
                setClient(response.data);
            } catch (err) {
                setError('Client introuvable.');
            } finally {
                setLoadingClient(false);
            }
        };

        const fetchPrescriptions = async () => {
            setLoadingPrescriptions(true);
            try {
                const response = await prescriptionService.getAllByCustomer(id);
                setPrescriptions(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setPrescriptions([]);
            } finally {
                setLoadingPrescriptions(false);
            }
        };

        fetchClient();
        fetchPrescriptions();
    }, [id]);

    if (loadingClient) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error || !client) {
        return (
            <Row>
                <Col xl={12}>
                    <MainCard>
                        <div className="alert alert-danger">{error || 'Client introuvable.'}</div>
                        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/clients')}>
                            <i className="ph ph-arrow-left me-1" />
                            Retour aux clients
                        </Button>
                    </MainCard>
                </Col>
            </Row>
        );
    }

    return (
        <Row className="g-3">

            {/* ── Client info card ── */}
            <Col xl={12}>
                <MainCard
                    title={
                        <div style={{ padding: '4px 0' }}>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <h2 style={{
                                    fontWeight: 700,
                                    fontSize: '1.5rem',
                                    letterSpacing: '-0.3px',
                                    marginBottom: 0,
                                    color: '#1a1a2e'
                                }}>
                                    {client.lastName?.toUpperCase()} {client.firstName}
                                </h2>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: 0 }}>
                                Fiche client
                            </p>
                        </div>
                    }
                    secondary={
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => navigate('/clients')}
                            >
                                <i className="ph ph-arrow-left me-1" />
                                Retour
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate(`/clients/${id}/nouvelle-ordonnance`)}
                            >
                                <i className="ph ph-plus me-1" />
                                Nouvelle ordonnance
                            </Button>
                        </div>
                    }
                >
                    {/* Client info grid */}
                    <Row className="g-3">
                        <Col sm={6} md={3}>
                            <div style={infoBlock}>
                                <span style={infoLabel}>CIN</span>
                                <span style={infoValue} className="font-monospace">{client.nationalId}</span>
                            </div>
                        </Col>
                        <Col sm={6} md={3}>
                            <div style={infoBlock}>
                                <span style={infoLabel}>N° CNSS</span>
                                <span style={infoValue}>{client.cnssNumber || <span className="text-muted">—</span>}</span>
                            </div>
                        </Col>
                        <Col sm={6} md={3}>
                            <div style={infoBlock}>
                                <span style={infoLabel}>Téléphone</span>
                                <span style={infoValue}>{client.phone || <span className="text-muted">—</span>}</span>
                            </div>
                        </Col>
                        <Col sm={6} md={3}>
                            <div style={infoBlock}>
                                <span style={infoLabel}>Adresse</span>
                                <span style={infoValue}>{client.address || <span className="text-muted">—</span>}</span>
                            </div>
                        </Col>
                    </Row>
                </MainCard>
            </Col>

            {/* ── Prescriptions ── */}
            <Col xl={12}>
                <MainCard
                    title={
                        <div style={{ padding: '4px 0' }}>
                            <h2 style={{
                                fontWeight: 700,
                                fontSize: '1.3rem',
                                letterSpacing: '-0.3px',
                                marginBottom: 0,
                                color: '#1a1a2e'
                            }}>
                                Ordonnances
                            </h2>
                            <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: 0 }}>
                                {prescriptions.length} ordonnance{prescriptions.length !== 1 ? 's' : ''} enregistrée{prescriptions.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    }
                >
                    {loadingPrescriptions ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" size="sm" />
                            <span className="ms-2 text-muted">Chargement des ordonnances...</span>
                        </div>
                    ) : prescriptions.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <i className="ph ph-prescription" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }} />
                            Aucune ordonnance enregistrée pour ce client
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-2">
                            {prescriptions.map((prescription) => (
                                <PrescriptionCard
                                    key={prescription.id}
                                    prescription={prescription}
                                />
                            ))}
                        </div>
                    )}
                </MainCard>
            </Col>

        </Row>
    );
}


const infoBlock = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '10px 14px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
};

const infoLabel = {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#6c757d',
};

const infoValue = {
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#1a1a2e',
};
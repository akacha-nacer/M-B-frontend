import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// react-bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';

// project-imports
import MainCard from 'components/MainCard';

// services
import customerService from 'services/customerService';

// ==============================|| PAGE - CLIENTS ||============================== //

export default function ClientsPage() {
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchClients = useCallback(async (query) => {
        setLoading(true);
        setError(null);
        try {
            const response = await customerService.search(query);
            setClients(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Erreur lors du chargement des clients.');
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        fetchClients('');
    }, [fetchClients]);


    useEffect(() => {
        const timer = setTimeout(() => {
            fetchClients(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search, fetchClients]);

    const handleRowClick = (clientId) => {
        navigate(`/clients/${clientId}`);
    };

    return (
        <Row>
            <Col xl={12}>
                <MainCard
                    title={
                        <div style={{ padding: '4px 0' }}>
                            <h2 style={{
                                fontWeight: 700,
                                fontSize: '1.6rem',
                                letterSpacing: '-0.4px',
                                marginBottom: '4px',
                                color: '#1a1a2e'
                            }}>
                                Gestion des clients
                            </h2>
                            <p style={{
                                fontSize: '0.95rem',
                                color: '#6c757d',
                                fontWeight: 400,
                                marginBottom: 0,
                                lineHeight: 1.5
                            }}>
                                Recherchez et gérez les clients de la pharmacie
                            </p>
                        </div>
                    }
                    secondary={
                        <Button
                            variant="primary"
                            onClick={() => navigate('/clients/nouveau')}
                        >
                            <i className="ph ph-plus me-1" />
                            Nouveau client
                        </Button>
                    }
                >
                    {/* Search bar */}
                    <InputGroup className="mb-3">
                        <InputGroup.Text>
                            <i className="ph ph-magnifying-glass" />
                        </InputGroup.Text>
                        <Form.Control
                            type="search"
                            placeholder="Rechercher par nom, CIN, CNSS ou téléphone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                        {search && (
                            <Button variant="outline-secondary" onClick={() => setSearch('')}>
                                <i className="ph ph-x" />
                            </Button>
                        )}
                    </InputGroup>

                    {/* States */}
                    {loading && (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" size="sm" />
                            <span className="ms-2 text-muted">Chargement...</span>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="alert alert-danger py-2">{error}</div>
                    )}

                    {/* Table */}
                    {!loading && !error && (
                        <Table responsive hover className="mb-0">
                            <thead>
                            <tr >
                                <th>#</th>
                                <th>Nom complet</th>
                                <th>CIN</th>
                                <th>CNSS</th>
                                <th>Téléphone</th>
                                <th>Adresse</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-4">
                                        {search
                                            ? `Aucun client trouvé pour "${search}"`
                                            : 'Aucun client enregistré'}
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client, index) => (
                                    <tr
                                        key={client.id}
                                        onClick={() => handleRowClick(client.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className="text-muted">{index + 1}</td>
                                        <td>
                                            <strong>{client.lastName?.toUpperCase()}</strong>{' '}
                                            {client.firstName}
                                        </td>
                                        <td>
                                            <Badge bg="light" text="dark" className="font-monospace">
                                                {client.nationalId}
                                            </Badge>
                                        </td>
                                        <td>{client.cnssNumber || <span className="text-muted">—</span>}</td>
                                        <td>{client.phone || <span className="text-muted">—</span>}</td>
                                        <td>{client.address || <span className="text-muted">—</span>}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    )}

                    {/* Result count */}
                    {!loading && !error && clients.length > 0 && (
                        <div className="text-muted text-end mt-2" style={{ fontSize: '0.85rem' }}>
                            {clients.length} client{clients.length > 1 ? 's' : ''} trouvé{clients.length > 1 ? 's' : ''}
                        </div>
                    )}
                </MainCard>
            </Col>
        </Row>
    );
}
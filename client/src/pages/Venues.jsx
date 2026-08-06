import React, { useState, useEffect } from 'react';
import { venuesAPI } from '../services/api';
import { useToast } from '../components/Toast';

const Venues = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState(''); const [capacity, setCapacity] = useState(300); const [layout, setLayout] = useState('Auditorium');
    const { showToast } = useToast();

    const loadVenues = async () => { try { setLoading(true); const res = await venuesAPI.getAll(); setVenues(res.data); } catch { showToast('Failed to load venues','error'); } finally { setLoading(false); } };

    useEffect(() => { loadVenues(); }, []);

    const handleCreate = async (e) => { e.preventDefault(); try { await venuesAPI.create({ name, capacity, hallLayout: layout }); showToast('Venue added!','success'); setIsModalOpen(false); setName(''); loadVenues(); } catch { showToast('Failed to add venue','error'); } };
    const handleDelete = async (id) => { if (!window.confirm('Delete venue?')) return; try { await venuesAPI.delete(id); showToast('Venue deleted','info'); loadVenues(); } catch { showToast('Failed','error'); } };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Venues Catalog</h2>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}><i className="fas fa-plus"></i> Add Venue</button>
            </div>
            {loading ? <p>Loading venues...</p> : (
                <div className="events-grid">
                    {venues.map(v => (
                        <div key={v.id} className="event-card card-glass hover-lift">
                            <div className="event-card-header">
                                <span className={`badge ${v.isIndoor ? 'badge-primary' : 'badge-success'}`}>{v.isIndoor ? 'Indoor' : 'Outdoor'}</span>
                                <span>Cap: {v.capacity}</span>
                            </div>
                            <div className="event-card-body">
                                <h3 className="event-card-title">{v.name}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Layout:</strong> {v.hallLayout}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Parking:</strong> {v.parkingInfo}</p>
                            </div>
                            <div className="event-card-footer">
                                <a href={v.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm"><i className="fas fa-map-pin"></i> Maps</a>
                                <button className="btn-icon" onClick={() => handleDelete(v.id)}><i className="far fa-trash-alt text-danger"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-box card-glass" style={{ maxWidth: '500px' }}>
                        <div className="modal-header"><h2>Add Venue</h2><button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button></div>
                        <form onSubmit={handleCreate} style={{ padding: '15px 0' }}>
                            <div className="input-group"><label>Venue Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="form-input" /></div>
                            <div className="input-group" style={{ marginTop: '10px' }}><label>Capacity</label><input type="number" value={capacity} onChange={e => setCapacity(+e.target.value)} required className="form-input" /></div>
                            <div className="input-group" style={{ marginTop: '10px' }}><label>Hall Layout</label><input type="text" value={layout} onChange={e => setLayout(e.target.value)} className="form-input" /></div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Venue</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Venues;

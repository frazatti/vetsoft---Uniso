
import React, { useState, useCallback } from 'react';
import { Client, Pet, Appointment, Page, AppointmentStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Clients } from './components/Clients';
import { Appointments } from './components/Appointments';

const initialClients: Client[] = [
    { id: '1', name: 'João da Silva', email: 'joao.silva@example.com', phone: '(11) 98765-4321', address: 'Rua das Flores, 123, São Paulo, SP' },
    { id: '2', name: 'Maria Oliveira', email: 'maria.oliveira@example.com', phone: '(21) 91234-5678', address: 'Avenida Copacabana, 456, Rio de Janeiro, RJ' },
];
const initialPets: Pet[] = [
    { id: 'p1', ownerId: '1', name: 'Rex', species: 'Cachorro', breed: 'Labrador', birthDate: '2020-05-10' },
    { id: 'p2', ownerId: '1', name: 'Mimi', species: 'Gato', breed: 'Siamês', birthDate: '2021-01-15' },
    { id: 'p3', ownerId: '2', name: 'Pingo', species: 'Cachorro', breed: 'Poodle', birthDate: '2019-11-20' },
];
const initialAppointments: Appointment[] = [
    { id: 'a1', clientId: '1', petId: 'p1', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), reason: 'Vacina anual', status: AppointmentStatus.SCHEDULED },
    { id: 'a2', clientId: '2', petId: 'p3', date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(), reason: 'Check-up de rotina', status: AppointmentStatus.COMPLETED },
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [clients, setClients] = useLocalStorage<Client[]>('vetsoft_clients', initialClients);
  const [pets, setPets] = useLocalStorage<Pet[]>('vetsoft_pets', initialPets);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('vetsoft_appointments', initialAppointments);

  const addClient = useCallback((clientData: Omit<Client, 'id'>) => {
    const newClient: Client = { ...clientData, id: crypto.randomUUID() };
    setClients(prev => [...prev, newClient]);
  }, [setClients]);

  const addPet = useCallback((petData: Omit<Pet, 'id'>) => {
    const newPet: Pet = { ...petData, id: crypto.randomUUID() };
    setPets(prev => [...prev, newPet]);
  }, [setPets]);

  const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = { ...appointmentData, id: crypto.randomUUID() };
    setAppointments(prev => [...prev, newAppointment]);
  }, [setAppointments]);

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  }, [setAppointments]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard clients={clients} pets={pets} appointments={appointments} />;
      case Page.Clients:
        return <Clients clients={clients} pets={pets} addClient={addClient} addPet={addPet} />;
      case Page.Appointments:
        return <Appointments appointments={appointments} clients={clients} pets={pets} addAppointment={addAppointment} updateAppointmentStatus={updateAppointmentStatus} />;
      default:
        return <Dashboard clients={clients} pets={pets} appointments={appointments} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-gray-800">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

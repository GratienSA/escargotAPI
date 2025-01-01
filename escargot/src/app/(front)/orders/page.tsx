"use client";

import { useState, useEffect } from 'react';
import { OrderType } from '@/utils/types';
import { getMyOrders } from '@/helpers/getData';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyOrders();
      if (response && response.data) {
        setOrders(response.data);
        setTotalPages(response.totalPages);
      } else {
        throw new Error("Aucune donnée reçue");
      }
    } catch (err) {
      console.error(err);
      setError('Échec de la récupération des commandes');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOrderSelect = (order: OrderType) => {
    setSelectedOrder(order);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  if (loading) return <div className="text-center">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center">Erreur : {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Mes commandes</h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 pr-4">
          <h2 className="text-xl font-semibold mb-2">Liste des commandes</h2>
          {orders.length > 0 ? (
            <>
              {orders.map((order) => (
                <div 
                  key={order.id} 
                  className="border p-4 mb-2 cursor-pointer hover:bg-gray-100 transition duration-200"
                  onClick={() => handleOrderSelect(order)}
                >
                  <p>Commande #{order.id}</p>
                  <p>Total: {order.totalAmount} €</p>
                  <p>Statut: {order.status}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button 
                  onClick={handlePreviousPage} 
                  disabled={page === 1}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                  Précédent
                </button>
                <button 
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                  Suivant
                </button>
              </div>
            </>
          ) : (
            <p>Aucune commande trouvée</p>
          )}
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <h2 className="text-xl font-semibold mb-2">Détails de la commande</h2>
          {selectedOrder ? (
            <div className="border p-4 rounded-lg shadow-md">
              <p>Commande #{selectedOrder.id}</p>
              <p>Total: {selectedOrder.totalAmount} €</p>
              <p>Statut: {selectedOrder.status}</p>
              <p>Date de création: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              <p>Dernière mise à jour: {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
              <p>Adresse de livraison: {selectedOrder.shippingStreet}, {selectedOrder.shippingZip} {selectedOrder.shippingCity}</p>
              <p>Méthode de paiement: {selectedOrder.paymentMethod}</p>
              <p>Prix des articles: {selectedOrder.itemsPrice} €</p>
              <p>Frais de livraison: {selectedOrder.shippingPrice} €</p>
              <p>Taxes: {selectedOrder.taxPrice} €</p>
              <p>Payé: {selectedOrder.isPaid ? 'Oui' : 'Non'}</p>
              <p>Livré: {selectedOrder.isDelivered ? 'Oui' : 'Non'}</p>
            </div>
          ) : (
            <p>Sélectionnez une commande pour voir les détails</p>
          )}
        </div>
      </div>
    </div>
  );
}

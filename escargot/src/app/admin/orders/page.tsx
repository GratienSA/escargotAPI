"use client";
import { useEffect, useState } from 'react';
import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { getUserProfile } from '@/helpers/auth'; 
import { deleteOrder, getAllOrders } from '@/helpers/getData';
import { formatCurrency, formatDateTime } from '@/utils/types';
import { OrderType } from '@/utils/types'; 

export default function OrdersPage({
  searchParams: { page = '1' },
}: {
  searchParams: { page: string }
}) {
  const [orders, setOrders] = useState<{ data: OrderType[]; totalPages: number } | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfile(); 
        if (userProfile.role !== 'admin') {
          throw new Error('Permission administrateur requise');
        }

        const fetchedOrders = await getAllOrders(10, Number(page));
        setOrders(fetchedOrders);
      } catch (error) {
        setFetchError('Erreur lors de la récupération des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  if (loading) {
    return <div>Chargement des commandes...</div>;
  }

  if (fetchError) {
    return <div>{fetchError}</div>;
  }

  if (!orders) {
    return <div>Aucune commande trouvée.</div>;
  }

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Commandes</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>Acheteur</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAYÉ</TableHead>
              <TableHead>LIVRÉ</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{(order.id)}</TableCell>
                <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                <TableCell>{order.userId ? order.userId: 'Utilisateur supprimé'}</TableCell>
                <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                <TableCell>{order.isPaid && order.paidAt ? formatDateTime(order.paidAt).dateTime : 'non payé'}</TableCell>
                <TableCell>{order.isDelivered && order.deliveredAt ? formatDateTime(order.deliveredAt).dateTime : 'non livré'}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order/${order.id}`}>Détails</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={() => deleteOrder(order.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders.totalPages} />
        )}
      </div>
    </div>
  );
}
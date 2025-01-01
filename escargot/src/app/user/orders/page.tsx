import Pagination from '@/components/shared/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getMyOrders } from '@/helpers/getData';
import { APP_NAME } from '@/lib/constants/index';
import { formatCurrency, formatDateTime } from '@/utils/types';
import { Metadata } from 'next';
import Link from 'next/link';
import { OrderType } from '@/utils/types'; 

export const metadata: Metadata = {
  title: `Mes Commandes - ${APP_NAME}`,
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const page = Number(searchParams.page) || 1;
  const userId = localStorage.getItem('userId');
  
  if (!userId) {
    return <div>Veuillez vous connecter pour voir vos commandes.</div>;
  }

  const ordersResponse = await getMyOrders(Number(userId), page, 6);
  
  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Commandes</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAYÉ</TableHead>
              <TableHead>LIVRÉ</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersResponse.data.length > 0 ? (
              ordersResponse.data.map((order: OrderType) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                  <TableCell>{formatCurrency(order.totalAmount)}</TableCell> 
                  <TableCell>
                    {order.isPaid && order.paidAt
                      ? formatDateTime(order.paidAt).dateTime
                      : 'non payé'}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered && order.deliveredAt
                      ? formatDateTime(order.deliveredAt).dateTime
                      : 'non livré'}
                  </TableCell>
                  <TableCell>
                    <Link href={`/order/${order.id}`}>
                      <span className="px-2">Détails</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Aucune commande trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

       
        {ordersResponse.totalPages > 1 && (
          <Pagination page={page} totalPages={ordersResponse.totalPages} />
        )}
      </div>
    </div>
  );
}
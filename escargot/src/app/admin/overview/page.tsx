"use client";

// DashboardPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeDollarSign, Barcode, CreditCard, Users } from 'lucide-react';
import { deleteOrder, getOrderSummary } from '@/helpers/getData';
import Charts from './charts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { formatCurrency, formatDateTime, formatNumber, OrderType } from '@/utils/types';
import DeleteDialog from '@/components/shared/delete-dialog';

export default async function DashboardPage() {
  // Fetch the order summary on the server side
  const summary = await getOrderSummary();

  return (
    <div className="space-y-4">
      <h1 className="h2-bold">Tableau de bord</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
            <BadgeDollarSign />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.ordersPrice)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventes</CardTitle>
            <CreditCard />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.usersCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.productsCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Graphique des ventes</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Charts
              data={{
                salesData: summary.salesData,
              }}
            />
          </CardContent>
        </Card>

        {/* Section pour les ventes récentes */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ventes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Table pour afficher les ventes récentes */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Acheteur</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latestOrders.map((order: OrderType) => (
                  <TableRow key={order.id}>
                    {/* Affichage des détails de la commande */}
                    <TableCell>{order.userId ? order.userId : 'Utilisateur supprimé'}</TableCell>

                    <TableCell>{formatDateTime(order.createdAt).dateOnly}</TableCell>

                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>

                    {/* Lien vers les détails de la commande */}
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className="px-2">Détails</span>
                      </Link>
                      {/* Delete dialog for removing orders */}
                      <DeleteDialog id={order.id} action={() => deleteOrder(order.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}

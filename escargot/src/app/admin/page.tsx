"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { getAllProducts, getCategories, getOrderHistory } from "@/helpers/getData"
import { OrderType } from "@/utils/types" 

export default function AdminDashboard() {
  const [salesData, setSalesData] = useState({ amount: 0, numberOfSales: 0 })
  const [userData, setUserData] = useState({ userCount: 0, averageValuePerUser: 0 })
  const [productData, setProductData] = useState({ totalCount: 0, categoryCount: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [products, categories, orders] = await Promise.all([
          getAllProducts(),
          getCategories(),
          getOrderHistory(),
        ])

        const totalSales = orders.reduce((sum: number, order: OrderType) => sum + (order.total || 0), 0)
        setSalesData({
          amount: totalSales,
          numberOfSales: orders.length,
        })

        
        const uniqueUsers = new Set(orders.map((order: OrderType) => order.userId))
        setUserData({
          userCount: uniqueUsers.size,
          averageValuePerUser: uniqueUsers.size > 0 ? totalSales / uniqueUsers.size : 0,
        })

        
        setProductData({
          totalCount: products.length,
          categoryCount: categories.length,
        })

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <p>Loading dashboard data...</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${salesData.numberOfSales} Orders`}
        body={salesData.amount.toFixed(2)}
      />
      <DashboardCard
        title="Customers"
        subtitle={`${userData.averageValuePerUser.toFixed(2)} Average Value`}
        body={userData.userCount.toString()}
      />
      <DashboardCard
        title="Products"
        subtitle=""
        body={productData.totalCount.toString()}
      />
    </div>
  )
}

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  )
}
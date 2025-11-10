"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, TrendingUp, Calendar, Download } from "lucide-react"

export function PayoutManager() {
  const payoutHistory = [
    {
      id: 1,
      date: "2024-01-15",
      amount: "$2,450.00",
      status: "completed",
      method: "Bank Transfer",
      ordersCount: 45,
    },
    {
      id: 2,
      date: "2024-01-08",
      amount: "$1,890.50",
      status: "completed",
      method: "Bank Transfer",
      ordersCount: 38,
    },
    {
      id: 3,
      date: "2024-01-01",
      amount: "$3,120.75",
      status: "completed",
      method: "Bank Transfer",
      ordersCount: 52,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Payout Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$4,567.25</div>
            <p className="text-sm text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Jan 22</div>
            <p className="text-sm text-muted-foreground">Automatic transfer scheduled</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$28,456</div>
            <p className="text-sm text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Payout History */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>Track your recent payouts and earnings</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutHistory.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>{payout.date}</TableCell>
                    <TableCell className="font-bold">{payout.amount}</TableCell>
                    <TableCell>{payout.method}</TableCell>
                    <TableCell>{payout.ordersCount}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">{payout.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

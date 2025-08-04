"use client"
import { useEffect, useState } from "react"
import authorizedAxiosInstance from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package as PackageIcon, Star, Search, Plus, Edit2, Trash2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ModalCreatePackage from "./components/ModalCreatePackage"
import ModalEditPackage from "./components/ModalEditPackage"

interface Package {
  _id: string
  icon: string
  name: string
  description: string[]
  price: number
  duration: number
  target_type: 'user' | 'shop'
  createdAt: string
  updatedAt: string
}

interface PaginationMetadata {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface UserPackage {
  _id: string
  user_id: {
    _id: string
    full_name: string
    email: string
    phone: string
    avatar?: string
  }
  package_id: Package
  payment_id: {
    amount: number
    status: string
  }
  createdAt: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [userPackages, setUserPackages] = useState<UserPackage[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState("packages")
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editPackage, setEditPackage] = useState<Package | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [paginationMetadata, setPaginationMetadata] = useState<PaginationMetadata>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  useEffect(() => {
    if (tab === "packages") fetchPackages()
    if (tab === "userPackages") fetchUserPackages(currentPage)
  }, [tab, currentPage])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await authorizedAxiosInstance.get("/v1/packages")
      setPackages(res.data?.data?.packages || [])
    } catch (err) {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPackages = async (page = 1) => {
    setLoading(true)
    try {
      const res = await authorizedAxiosInstance.get(`/v1/user-packages?page=${page}`)
      setUserPackages(res.data?.data?.data || [])
      setPaginationMetadata(res.data?.data?.metadata || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
      })
    } catch (err) {
      // handle error
    } finally {
      setLoading(false)
    }
  }

  const filteredPackages = packages.filter(pkg =>
    !search || pkg.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredUserPackages = userPackages.filter(up => {
    const pkg = up.package_id
    return (
      !search || (pkg?.name && pkg.name.toLowerCase().includes(search.toLowerCase()))
    )
  })

  return (
    <div className="space-y-6 p-6">
      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <PackageIcon className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Quản lý gói dịch vụ</h1>
            </div>
            <TabsList>
              <TabsTrigger value="packages">Danh sách gói</TabsTrigger>
              <TabsTrigger value="userPackages">Giao dịch người dùng</TabsTrigger>
            </TabsList>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={tab === "packages" ? "Tìm kiếm gói dịch vụ..." : "Tìm kiếm theo tên gói..."}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            {tab === "packages" && (
              <Button onClick={() => setCreateOpen(true)} className="bg-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Tạo gói mới
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="packages">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map(pkg => (
                <div key={pkg._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                  <div className="p-6 border-b flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {pkg.icon === 'star' ? (
                          <Star className="w-6 h-6 text-yellow-400" />
                        ) : (
                          <PackageIcon className="w-6 h-6 text-primary" />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold">{pkg.name}</h3>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                            pkg.target_type === 'shop' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {pkg.target_type === 'shop' ? '🏪 Dành cho quán' : '👤 Dành cho người dùng'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => { setEditPackage(pkg); setEditOpen(true); }}
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-primary">
                        {pkg.price.toLocaleString()}đ
                        <span className="text-sm font-normal text-gray-500 ml-1">/ {pkg.duration} ngày</span>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {pkg.description.map((desc, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
                          <span className="text-gray-600">{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 text-sm text-gray-500 rounded-b-lg mt-auto">
                    Cập nhật lần cuối: {new Date(pkg.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="userPackages">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold">Danh sách giao dịch gói dịch vụ</h3>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                      <div className="w-24 h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUserPackages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <PackageIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có giao dịch nào</h3>
                <p className="text-gray-500">Danh sách giao dịch gói dịch vụ sẽ xuất hiện ở đây</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Thông tin người dùng</TableHead>
                        <TableHead className="font-semibold">Gói dịch vụ</TableHead>
                        <TableHead className="font-semibold">Thời gian</TableHead>
                        <TableHead className="font-semibold">Thanh toán</TableHead>
                        <TableHead className="font-semibold text-center">Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUserPackages.map(up => (
                        <TableRow key={up._id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {up.user_id?.avatar ? (
                                <img 
                                  src={up.user_id.avatar} 
                                  alt={up.user_id.full_name} 
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                  {up.user_id?.full_name?.charAt(0) || '?'}
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{up.user_id?.full_name}</div>
                                <div className="text-sm text-gray-500">{up.user_id?.email}</div>
                                {up.user_id?.phone && (
                                  <div className="text-sm text-gray-500">{up.user_id.phone}</div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">{up.package_id?.name}</div>
                            <div className="text-sm text-gray-500">
                              {up.package_id?.price?.toLocaleString()}đ / {up.package_id?.duration} ngày
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {new Date(up.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(up.createdAt).toLocaleTimeString('vi-VN')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {up.payment_id?.amount?.toLocaleString()}đ
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${up.payment_id?.status === 'success' ? 'bg-green-100 text-green-800' : 
                                up.payment_id?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                up.payment_id?.status === 'failed' ? 'bg-red-100 text-red-800' : 
                                'bg-gray-100 text-gray-800'}`}>
                              {up.payment_id?.status === 'success' ? 'Thành công' :
                               up.payment_id?.status === 'pending' ? 'Đang xử lý' :
                               up.payment_id?.status === 'failed' ? 'Thất bại' : 
                               'Không xác định'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {!loading && filteredUserPackages.length > 0 && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Hiển thị {((paginationMetadata.page - 1) * paginationMetadata.limit) + 1} đến{' '}
                      {Math.min(paginationMetadata.page * paginationMetadata.limit, paginationMetadata.total)} trong số{' '}
                      {paginationMetadata.total} kết quả
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentPage(prev => {
                            const newPage = prev - 1
                            fetchUserPackages(newPage)
                            return newPage
                          })
                        }}
                        disabled={currentPage <= 1}
                      >
                        Trang trước
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: paginationMetadata.totalPages }, (_, i) => i + 1).map(page => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setCurrentPage(page)
                              fetchUserPackages(page)
                            }}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentPage(prev => {
                            const newPage = prev + 1
                            fetchUserPackages(newPage)
                            return newPage
                          })
                        }}
                        disabled={currentPage >= paginationMetadata.totalPages}
                      >
                        Trang sau
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

      </Tabs>

      <ModalCreatePackage open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={fetchPackages} />
      <ModalEditPackage open={editOpen} onClose={() => setEditOpen(false)} pkg={editPackage} onSuccess={fetchPackages} />
    </div>
  )
} 
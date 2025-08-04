"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import authorizedAxiosInstance from "@/lib/axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, GripVertical } from "lucide-react"

interface ModalEditPackageProps {
  open: boolean
  onClose: () => void
  pkg: any | null
  onSuccess?: () => void
}

interface PackageForm {
  name: string
  description: string[]
  price: number
  duration: number
  icon?: string
  target_type: 'user' | 'shop'
}

interface DynamicInputListProps {
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
}

const DynamicInputList = ({ value = [], onChange, placeholder = "Nhập mô tả..." }: DynamicInputListProps) => {
  const handleAdd = () => {
    onChange([...value, ""]);
  };
  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  const handleChange = (index: number, newValue: string) => {
    const updated = [...value];
    updated[index] = newValue;
    onChange(updated);
  };
  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            <input
              type="text"
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md border border-dashed border-blue-300"
      >
        <Plus className="w-4 h-4" />
        Thêm mô tả
      </button>
    </div>
  );
};

export default function ModalEditPackage({ open, onClose, pkg, onSuccess }: ModalEditPackageProps) {
  const { register, handleSubmit, reset, formState: { isSubmitting }, setValue, watch } = useForm<PackageForm>({
    defaultValues: {
      name: "",
      description: [],
      price: 0,
      duration: 1,
      icon: "",
      target_type: "user",
    }
  })

  const descriptionValue = watch("description") as string[] | string;
  const targetTypeValue = watch("target_type");

  useEffect(() => {
    if (pkg) {
      reset({
        name: pkg.name || "",
        description: Array.isArray(pkg.description) ? pkg.description : (pkg.description ? [pkg.description] : []),
        price: pkg.price || 0,
        duration: pkg.duration || 1,
        icon: pkg.icon || "",
        target_type: pkg.target_type || "user",
      })
    }
  }, [pkg, reset])

  const onSubmit = async (data: PackageForm) => {
    if (!pkg) return
    try {
      await authorizedAxiosInstance.put(`/v1/packages/${pkg._id}`, data)
      toast.success("Cập nhật gói thành công!")
      onClose()
      onSuccess?.()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Cập nhật gói thất bại")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa gói</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium">Tên gói <span className="text-red-500">*</span></label>
            <Input {...register("name", { required: true })} placeholder="Nhập tên gói" />
          </div>
          
          <div className="space-y-3">
            <Label className="text-base font-medium">Loại gói dịch vụ</Label>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {targetTypeValue === 'shop' ? '🏪' : '👤'}
                </div>
                <div>
                  <div className="font-medium">
                    {targetTypeValue === 'shop' ? 'Dành cho quán cà phê' : 'Dành cho người dùng'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {targetTypeValue === 'shop' 
                      ? 'Gói dịch vụ nâng cấp cho chủ quán cà phê' 
                      : 'Gói VIP cho người dùng cuối'}
                  </div>
                </div>
              </div>
              <Switch
                checked={targetTypeValue === 'shop'}
                onCheckedChange={(checked) => setValue('target_type', checked ? 'shop' : 'user')}
              />
            </div>
          </div>
          <div>
            <label className="block font-medium">Mô tả <span className="text-red-500">*</span></label>
            <DynamicInputList
              value={Array.isArray(descriptionValue) ? descriptionValue : []}
              onChange={(val: string[]) => setValue("description", val)}
              placeholder="Nhập mô tả..."
            />
          </div>
          <div>
            <label className="block font-medium">Giá <span className="text-red-500">*</span></label>
            <Input {...register("price", { valueAsNumber: true })} type="number" placeholder="Giá gói (VNĐ)" />
          </div>
          <div>
            <label className="block font-medium">Thời lượng (ngày) <span className="text-red-500">*</span></label>
            <Input {...register("duration", { valueAsNumber: true })} type="number" placeholder="Số ngày sử dụng" />
          </div>
          <div>
            <label className="block font-medium">Icon (URL)</label>
            <Input {...register("icon")} placeholder="Link icon (nếu có)" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-white">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 